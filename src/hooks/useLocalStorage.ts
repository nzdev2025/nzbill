import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for managing data in localStorage with TypeScript support
 */
export function useLocalStorage<T>(
    key: string,
    initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
    // Get stored value or use initial value
    const readValue = useCallback((): T => {
        if (typeof window === 'undefined') {
            return initialValue;
        }

        try {
            const item = window.localStorage.getItem(key);
            return item ? (JSON.parse(item) as T) : initialValue;
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    }, [initialValue, key]);

    const [storedValue, setStoredValue] = useState<T>(readValue);

    // Return a wrapped version of useState's setter function
    const setValue = useCallback(
        (value: T | ((prev: T) => T)) => {
            setStoredValue((prevValue) => {
                try {
                    // Allow value to be a function for same API as useState
                    const valueToStore = value instanceof Function ? value(prevValue) : value;

                    // Save to localStorage
                    if (typeof window !== 'undefined') {
                                            window.localStorage.setItem(key, JSON.stringify(valueToStore));
                                            
                                            // We don't need to manually dispatch for the same window as state is already updated.
                                            // The 'storage' event is for other tabs/windows.
                                        }
                                            
                                        return valueToStore;                } catch (error) {
                    console.warn(`Error setting localStorage key "${key}":`, error);
                    return prevValue;
                }
            });
        },
        [key]
    );

    // Remove value from localStorage
    const removeValue = useCallback(() => {
        try {
            if (typeof window !== 'undefined') {
                window.localStorage.removeItem(key);
                setStoredValue(initialValue);
            }
        } catch (error) {
            console.warn(`Error removing localStorage key "${key}":`, error);
        }
    }, [initialValue, key]);

    // Listen for changes in other tabs/windows
    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === key && event.newValue !== null) {
                try {
                    setStoredValue(JSON.parse(event.newValue) as T);
                } catch (error) {
                    console.warn(`Error parsing storage event for key "${key}":`, error);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [key]);

    return [storedValue, setValue, removeValue];
}

export default useLocalStorage;
