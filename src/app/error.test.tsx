import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Component, type ReactNode, Suspense, use } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiRequestError } from '@/domain/errors';
import ProjectLayout from './[projectId]/layout';
import RootError from './error';

const state = vi.hoisted<{ failure: Error }>(() => ({ failure: new Error('not set') }));

vi.mock('next/navigation', () => ({
  redirect: (path: string) => {
    throw new Error(`redirect:${path}`);
  },
  notFound: () => {
    throw new Error('not-found');
  },
  usePathname: () => '/p-store/overview',
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ replace: vi.fn(), refresh: vi.fn() }),
}));

vi.mock('@/services/projects/projects-service.factory', () => ({
  createProjectsService: () => ({ currentAdmin: () => Promise.reject(state.failure) }),
}));

interface RouteBoundaryProps {
  readonly children: ReactNode;
  readonly fallback: (error: Error) => ReactNode;
}

interface RouteBoundaryState {
  readonly error: Error | null;
}

class RouteBoundary extends Component<RouteBoundaryProps, RouteBoundaryState> {
  override state: RouteBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  override render() {
    const { error } = this.state;
    return error === null ? this.props.children : this.props.fallback(error);
  }
}

function Awaited({ content }: { readonly content: Promise<ReactNode> }) {
  return use(content);
}

beforeEach(() => {
  state.failure = Object.assign(new ApiRequestError('/v1/me', 503), { digest: 'd1g35t' });
  vi.spyOn(console, 'error').mockImplementation(() => undefined);
});

describe('RootError', () => {
  it('catches a failed /v1/me in the project layout with the branded panel and a retry', async () => {
    const retry = vi.fn();
    const layout = ProjectLayout({
      children: <p>screen</p>,
      params: Promise.resolve({ projectId: 'p-store' }),
    });

    await act(async () => {
      render(
        <RouteBoundary fallback={(error) => <RootError error={error} retry={retry} />}>
          <Suspense fallback={null}>
            <Awaited content={layout} />
          </Suspense>
        </RouteBoundary>,
      );
      await layout.catch(() => undefined);
    });

    expect(
      screen.getByRole('heading', { level: 1, name: 'Could not load this data' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('main')).toHaveTextContent(/^Pyxis/);
    expect(screen.getByText('error id d1g35t')).toBeInTheDocument();
    expect(screen.queryByText('screen')).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));

    expect(retry).toHaveBeenCalledOnce();
  });

  it('shows no error id when the failure has none', () => {
    render(<RootError error={new Error('boom')} retry={vi.fn()} />);

    expect(screen.queryByText(/error id/)).not.toBeInTheDocument();
  });
});
