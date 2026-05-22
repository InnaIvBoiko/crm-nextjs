'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface AuthUser {
    name: string;
    email: string;
}

interface AuthContextValue {
    user: AuthUser | null;
    login: (email: string, password: string) => void;
    register: (name: string, email: string, password: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = 'crm-auth-user';

/** Build a display name from the local-part of an email address. */
function nameFromEmail(email: string): string {
    const local = email.split('@')[0] ?? '';
    const name = local
        .split(/[._-]+/)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');

    return name || 'User';
}

/**
 * Mock client-side authentication. There is no backend — the session lives in
 * React state and is mirrored to localStorage so it survives a page reload.
 * Any credentials are accepted (demo mode).
 */
export function AuthProvider({ children }: React.PropsWithChildren) {
    const [user, setUser] = useState<AuthUser | null>(null);

    // Restore the session after mount: keeps the server/client render in sync
    // (both start as `null`), then updates once localStorage is readable.
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return;

        try {
            setUser(JSON.parse(stored) as AuthUser);
        } catch {
            localStorage.removeItem(STORAGE_KEY);
        }
    }, []);

    const persist = (next: AuthUser | null) => {
        setUser(next);
        if (next) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } else {
            localStorage.removeItem(STORAGE_KEY);
        }
    };

    const login = (email: string) => {
        persist({ name: nameFromEmail(email), email });
    };

    const register = (name: string, email: string) => {
        persist({ name: name.trim() || nameFromEmail(email), email });
    };

    const logout = () => persist(null);

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
