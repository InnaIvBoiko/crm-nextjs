'use client';

import React, {
    createContext,
    useCallback,
    useContext,
    useSyncExternalStore,
} from 'react';

export type UserRole = 'admin' | 'user';

export interface AuthUser {
    name: string;
    email: string;
    role: UserRole;
}

interface AuthContextValue {
    user: AuthUser | null;
    /** True when the signed-in user may create / edit / delete. */
    isAdmin: boolean;
    login: (email: string, password: string) => void;
    register: (name: string, email: string, password: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = 'crm-auth-user';
const AUTH_EVENT = 'crm-auth-change';

/**
 * Ready-made accounts surfaced in the login modal. Roles are fixed: only the
 * admin account can mutate data — everyone else (these and any sign-up) is a
 * read-only user, so nobody can self-promote to admin.
 */
export const DEMO_ACCOUNTS = {
    admin: { email: 'admin@example.com', password: 'Password123!' },
    user: { email: 'user@example.com', password: 'Password123!' },
} as const;

/** Resolve a role from an email — the admin demo address is the only admin. */
function roleForEmail(email: string): UserRole {
    return email.trim().toLowerCase() === DEMO_ACCOUNTS.admin.email
        ? 'admin'
        : 'user';
}

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
 * localStorage-backed auth store. Reading on mount via `useSyncExternalStore`
 * (instead of an effect + setState) keeps the server/client render in sync —
 * both start from `getServerSnapshot()` (`null`) and the client swaps in the
 * stored session after hydration.
 *
 * `getSnapshot` must return a stable reference while the value is unchanged, so
 * the parsed user is cached and only recomputed when the raw string changes.
 */
let cachedRaw: string | null = null;
let cachedUser: AuthUser | null = null;

function readUser(): AuthUser | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === cachedRaw) return cachedUser;

    cachedRaw = raw;
    if (!raw) {
        cachedUser = null;
        return null;
    }

    try {
        const parsed = JSON.parse(raw) as Partial<AuthUser>;
        const email = parsed.email ?? '';
        cachedUser = {
            name: parsed.name ?? nameFromEmail(email),
            email,
            // Backfill role for sessions saved before roles existed.
            role: parsed.role ?? roleForEmail(email),
        };
    } catch {
        localStorage.removeItem(STORAGE_KEY);
        cachedRaw = null;
        cachedUser = null;
    }

    return cachedUser;
}

function subscribe(callback: () => void): () => void {
    window.addEventListener(AUTH_EVENT, callback);
    window.addEventListener('storage', callback);
    return () => {
        window.removeEventListener(AUTH_EVENT, callback);
        window.removeEventListener('storage', callback);
    };
}

function writeUser(next: AuthUser | null): void {
    if (next) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } else {
        localStorage.removeItem(STORAGE_KEY);
    }
    // Notify same-tab subscribers (the native `storage` event only fires in
    // *other* tabs).
    window.dispatchEvent(new Event(AUTH_EVENT));
}

/**
 * Mock client-side authentication. There is no backend — the session lives in
 * localStorage and is mirrored into React via an external store. Any
 * credentials are accepted (demo mode); the role is derived from the email.
 */
export function AuthProvider({ children }: React.PropsWithChildren) {
    const user = useSyncExternalStore(subscribe, readUser, () => null);

    const login = useCallback((email: string) => {
        writeUser({
            name: nameFromEmail(email),
            email,
            role: roleForEmail(email),
        });
    }, []);

    const register = useCallback((name: string, email: string) => {
        // Sign-ups are always read-only users.
        writeUser({
            name: name.trim() || nameFromEmail(email),
            email,
            role: 'user',
        });
    }, []);

    const logout = useCallback(() => writeUser(null), []);

    return (
        <AuthContext.Provider
            value={{
                user,
                isAdmin: user?.role === 'admin',
                login,
                register,
                logout,
            }}
        >
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
