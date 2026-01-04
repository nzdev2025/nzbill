import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import type { AppSettings } from '../types';

export interface UserProfile {
    balance: number;
    level: number;
    settings: AppSettings;
}

const DEFAULT_SETTINGS: AppSettings = {
    soundEnabled: true,
    notificationsEnabled: true,
    language: 'th',
    characterId: 'may',
    characterOutfit: 'default',
    reminderTime: '09:00',
    theme: 'light',
};

export function useProfile() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProfile = useCallback(async () => {
        if (!user) return;

        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error) throw error;

            if (data) {
                setProfile({
                    balance: data.balance,
                    level: data.level,
                    settings: data.settings || DEFAULT_SETTINGS,
                });
            }
        } catch (err: unknown) {
            console.error('Error fetching profile:', err);
            const message = err instanceof Error ? err.message : 'Unknown error';
            setError(message);
        } finally {
            setLoading(false);
        }
    }, [user]);

    // Update specific field in profile
    const updateProfile = async (updates: Partial<UserProfile>) => {
        if (!user) return;

        try {
            // Optimistic update
            setProfile((prev) => prev ? { ...prev, ...updates } : null);

            const { error } = await supabase
                .from('profiles')
                .update(updates)
                .eq('id', user.id);

            if (error) throw error;
        } catch (err: unknown) {
            console.error('Error updating profile:', err);
            // Revert on error? For now simpler to just log
            fetchProfile(); // Refetch to sync
        }
    };

    // Update balance specifically (convenience method)
    const updateBalance = (newBalance: number) => {
        return updateProfile({ balance: newBalance });
    };

    const updateLevel = (newLevel: number) => {
        return updateProfile({ level: newLevel });
    };

    const updateSettings = (newSettings: AppSettings) => {
        return updateProfile({ settings: newSettings });
    };

    useEffect(() => {
        if (user) {
            fetchProfile();

            // Realtime subscription for profile changes
            const channel = supabase
                .channel('profile-changes')
                .on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'public',
                        table: 'profiles',
                        filter: `id=eq.${user.id}`,
                    },
                    (payload) => {
                        if (payload.new) {
                            const newData = payload.new as { balance: number; level: number; settings: AppSettings };
                            setProfile({
                                balance: newData.balance,
                                level: newData.level,
                                settings: newData.settings || DEFAULT_SETTINGS,
                            });
                        }
                    }
                )
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        } else {
            setProfile(null);
        }
    }, [user, fetchProfile]);

    return {
        profile,
        loading,
        error,
        updateBalance,
        updateLevel,
        updateSettings,
        refetch: fetchProfile
    };
}
