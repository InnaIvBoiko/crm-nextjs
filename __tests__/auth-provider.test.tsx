import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from '@/src/app/components/auth-provider';

const STORAGE_KEY = 'crm-auth-user';

function Harness() {
    const { user, login, logout } = useAuth();
    return (
        <div>
            <span data-testid='user'>{user ? user.name : 'guest'}</span>
            <button onClick={() => login('jane.doe@acme.com', 'pw')}>
                login
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
    });

    it('restores a session from localStorage on mount', () => {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ name: 'Stored User', email: 'stored@acme.com' }),
        );

        renderWithProvider();

        expect(screen.getByTestId('user')).toHaveTextContent('Stored User');
    });

    it('derives a display name from the email and persists on login', async () => {
        renderWithProvider();

        await userEvent.click(screen.getByRole('button', { name: 'login' }));

        expect(screen.getByTestId('user')).toHaveTextContent('Jane Doe');
        expect(localStorage.getItem(STORAGE_KEY)).toContain('jane.doe@acme.com');
    });

    it('clears the session on logout', async () => {
        renderWithProvider();
        await userEvent.click(screen.getByRole('button', { name: 'login' }));
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
