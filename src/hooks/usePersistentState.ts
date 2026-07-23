
import React, { useState } from 'react';

/**
 * Suspended local storage persistence.
 * This hook now acts as a simple useState wrapper to comply with direct cloud orientation.
 */
export const usePersistentState = <T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
    // Persistence logic disabled (localStorage suspended)
    const [state, setState] = useState<T>(initialValue);
    return [state, setState];
};
