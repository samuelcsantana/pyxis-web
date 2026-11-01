import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import { InstallCall } from './install-call';

const navigation = vi.hoisted(() => ({ search: 'range=7d&country=BR&kind=reads' }));

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(navigation.search),
}));

const WAITING = 'Waiting for the first event';

describe('InstallCall', () => {
  it('opens Install keeping the period and the filters, and says the project waits for its first event', () => {
    renderWithMessages(<InstallCall projectId="p 1" waiting={WAITING} />);

    const call = screen.getByRole('link', { name: 'Install Pyxis, Waiting for the first event' });
    expect(call).toHaveAttribute('href', '/p%201/install?range=7d&country=BR');
  });

  it('pulses its dot only when motion is welcome, and hides it from assistive technology', () => {
    const { container } = renderWithMessages(<InstallCall projectId="p1" waiting={WAITING} />);

    const dot = container.querySelector('.motion-safe\\:animate-pulse');
    expect(dot).toHaveAttribute('aria-hidden', 'true');
    expect(container.querySelector('.animate-pulse')).toBeNull();
  });

  it('speaks the language of the admin', () => {
    renderWithMessages(
      <InstallCall projectId="p1" waiting="Aguardando o primeiro evento" />,
      'pt-BR',
    );

    expect(
      screen.getByRole('link', { name: 'Instalar o Pyxis, Aguardando o primeiro evento' }),
    ).toBeInTheDocument();
  });
});
