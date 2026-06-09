import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from '@/src/app/components/auth-provider';

const STORAGE_KEY = 'crm-auth-user';

function Harness() {
    const { user, isAdmin, login, logout } = useAuth();
    return (
        <div>
            <span data-testid='user'>{user ? user.name : 'guest'}</span>
            <span data-testid='role'>{user ? user.role : 'none'}</span>
            <span data-testid='isAdmin'>{String(isAdmin)}</span>
            <button onClick={() => login('jane.doe@acme.com', 'pw')}>
                login-user
            </button>
            <button onClick={() => login('admin@example.com', 'pw')}>
                login-admin
            </button>
            <button onClick={logout}>logout</button>
        </div>
    );
}

function renderWithProvider() {
    return render(
        <AuthProvider>
            <Harness />
        </AuthProvider>,
    );
}

describe('AuthProvider', () => {
    beforeEach(() => localStorage.clear());
    afterEach(() => localStorage.clear());

    it('starts logged out when nothing is stored', () => {
        renderWithProvider();
        expect(screen.getByTestId('user')).toHaveTextContent('guest');
        expect(screen.getByTestId('isAdmin')).toHaveTextContent('false');
    });

    it('restores a session from localStorage on mount', () => {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
                name: 'Stored User',
                email: 'stored@acme.com',
                role: 'user',
            }),
        );

        renderWithProvider();

        expect(screen.getByTestId('user')).toHaveTextContent('Stored User');
    });

    it('backfills a role for sessions saved before roles existed', () => {
        // No `role` field — should be derived from the email (here: user).
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ name: 'Legacy', email: 'legacy@acme.com' }),
        );

        renderWithProvider();

        expect(screen.getByTestId('role')).toHaveTextContent('user');
        expect(screen.getByTestId('isAdmin')).toHaveTextContent('false');
    });

    it('logs in a regular email as a read-only user', async () => {
        renderWithProvider();

        await userEvent.click(
            screen.getByRole('button', { name: 'login-user' }),
        );

        expect(screen.getByTestId('user')).toHaveTextContent('Jane Doe');
        expect(screen.getByTestId('role')).toHaveTextContent('user');
        expect(screen.getByTestId('isAdmin')).toHaveTextContent('false');
        expect(localStorage.getItem(STORAGE_KEY)).toContain('jane.doe@acme.com');
    });

    it('grants admin to the admin demo email', async () => {
        renderWithProvider();

        await userEvent.click(
            screen.getByRole('button', { name: 'login-admin' }),
        );

        expect(screen.getByTestId('role')).toHaveTextContent('admin');
        expect(screen.getByTestId('isAdmin')).toHaveTextContent('true');
    });

    it('clears the session on logout', async () => {
        renderWithProvider();
        await userEvent.click(
            screen.getByRole('button', { name: 'login-user' }),
        );
        expect(screen.getByTestId('user')).toHaveTextContent('Jane Doe');

        await userEvent.click(screen.getByRole('button', { name: 'logout' }));

        expect(screen.getByTestId('user')).toHaveTextContent('guest');
        expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });

    it('ignores corrupt stored data instead of crashing', () => {
        localStorage.setItem(STORAGE_KEY, 'not-json{');

        renderWithProvider();

        expect(screen.getByTestId('user')).toHaveTextContent('guest');
    });
});
