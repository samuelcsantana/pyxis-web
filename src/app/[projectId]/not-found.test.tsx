import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithMessages } from '@/test-utils/render-with-messages';
import UnknownScreen, { generateMetadata as unknownScreenMetadata } from './[...unknown]/page';
import ProjectNotFound, { generateMetadata } from './not-found';

vi.mock('next/navigation', () => ({
  notFound: () => {
    throw new Error('not-found');
  },
  useParams: () => ({ projectId: 'p-store' }),
}));

describe('ProjectNotFound', () => {
  it('says the page was not found and leads back to the Overview of the same project', async () => {
    renderWithMessages(<ProjectNotFound />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Page not found');
    expect(
      screen.getByText('There is nothing at this address in this project.'),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Open the Overview' })).toHaveAttribute(
      'href',
      '/p-store/overview',
    );
    expect((await generateMetadata()).title).toBe('Page not found');
  });
});

describe('UnknownScreen', () => {
  it('answers not found for any path under a project that is not a screen', async () => {
    expect(() => UnknownScreen()).toThrow('not-found');
    expect((await unknownScreenMetadata()).title).toBe('Page not found');
  });
});
