import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatusLabel from '@/src/app/components/status-label';
import { CompanyStatus } from '@/src/lib/api';

describe('StatusLabel', () => {
    it('renders a human-readable label for each status', () => {
        const cases: [CompanyStatus, string][] = [
            [CompanyStatus.Active, 'Active'],
            [CompanyStatus.NotActive, 'Not Active'],
            [CompanyStatus.Pending, 'Pending'],
            [CompanyStatus.Suspended, 'Suspended'],
        ];

        for (const [status, label] of cases) {
            const { unmount } = render(<StatusLabel status={status} />);
            expect(screen.getByText(label)).toBeInTheDocument();
            unmount();
        }
    });

    it('renders plain text without the badge when styled is false', () => {
        const { container } = render(
            <StatusLabel status={CompanyStatus.Active} styled={false} />,
        );

        expect(screen.getByText('Active')).toBeInTheDocument();
        // No wrapping badge element — just the bare text node.
        expect(container.querySelector('div')).toBeNull();
    });

    it('marks the badge as disabled-styled when disabled', () => {
        const { container } = render(
            <StatusLabel status={CompanyStatus.Active} disabled />,
        );

        expect(container.firstChild).toHaveClass('cursor-not-allowed');
    });
});
