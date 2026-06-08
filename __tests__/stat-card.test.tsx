import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatCard, {
    StatCardType,
} from '@/src/app/components/stat-card/stat-card';

describe('StatCard', () => {
    it('renders the label and counter', () => {
        render(
            <StatCard
                type={StatCardType.Dark}
                label='Active companies'
                counter={42}
            />,
        );

        expect(screen.getByText('Active companies')).toBeInTheDocument();
        expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('renders a zero counter rather than treating it as empty', () => {
        render(
            <StatCard type={StatCardType.Dark} label='Promotions' counter={0} />,
        );

        expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('applies the dark variant styling', () => {
        const { container } = render(
            <StatCard type={StatCardType.Dark} label='Dark' counter={1} />,
        );

        expect(container.firstChild).toHaveClass('bg-gray-900');
    });

    it('applies the gradient variant styling', () => {
        const { container } = render(
            <StatCard
                type={StatCardType.Gradient}
                label='Gradient'
                counter={1}
            />,
        );

        expect(container.firstChild).toHaveClass('bg-purple-200');
    });
});
