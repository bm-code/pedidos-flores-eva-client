import { useCallback, useMemo, useState } from "react"

export function useLocalStorage(key, initialValue = {}) {
    const [state, setState] = useState(() => {
        let value = localStorage.getItem(key);
        if (!value) return initialValue;
        return JSON.parse(value);
    });

    let setValue = useCallback(function createSetValue(value) {
        localStorage.setItem(key, JSON.stringify(value));
        setState(value);
    }, [key]);

    return useMemo(() => {
        return [state, setValue]
    }, [state, setValue]);
}