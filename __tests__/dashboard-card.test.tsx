import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import DashboardCard from '@/src/app/components/dashboard-card';

describe('DashboardCard', () => {
    it('renders the label and children content', () => {
        render(
            <DashboardCard label='Sales'>
                <p>Body content</p>
            </DashboardCard>,
        );

        expect(screen.getByText('Sales')).toBeInTheDocument();
        expect(screen.getByText('Body content')).toBeInTheDocument();
    });

    it('accepts a ReactNode label, not just a string', () => {
        render(
            <DashboardCard label={<span data-testid='custom'>Top</span>}>
                <div />
            </DashboardCard>,
        );

        expect(screen.getByTestId('custom')).toHaveTextContent('Top');
    });
});
