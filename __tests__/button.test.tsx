import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '@/src/app/components/button';

describe('Button', () => {
    it('renders its children', () => {
        render(<Button>Save</Button>);
        expect(
            screen.getByRole('button', { name: 'Save' }),
        ).toBeInTheDocument();
    });

    it('fires onClick when pressed', async () => {
        const onClick = vi.fn();
        render(<Button onClick={onClick}>Click</Button>);

        await userEvent.click(screen.getByRole('button'));

        expect(onClick).toHaveBeenCalledOnce();
    });

    it('forwards arbitrary button attributes', () => {
        render(
            <Button type='submit' aria-label='confirm'>
                Go
            </Button>,
        );

        const button = screen.getByRole('button', { name: 'confirm' });
        expect(button).toHaveAttribute('type', 'submit');
    });

    it('does not fire onClick when disabled', async () => {
        const onClick = vi.fn();
        render(
            <Button disabled onClick={onClick}>
                Click
            </Button>,
        );

        const button = screen.getByRole('button');
        expect(button).toBeDisabled();

        await userEvent.click(button);

        expect(onClick).not.toHaveBeenCalled();
    });

    it('applies hover styles only when enabled', () => {
        const { rerender } = render(<Button>Enabled</Button>);
        expect(screen.getByRole('button')).toHaveClass('hover:bg-gray-800');

        rerender(<Button disabled>Disabled</Button>);
        expect(screen.getByRole('button')).not.toHaveClass('hover:bg-gray-800');
    });
});
