import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import UnknownScreen, { metadata as unknownScreenMetadata } from './[...unknown]/page';
import ProjectNotFound, { metadata } from './not-found';

vi.mock('next/navigation', () => ({
  notFound: () => {
    throw new Error('not-found');
  },
  useParams: () => ({ projectId: 'p-store' }),
}));

describe('ProjectNotFound', () => {
  it('says the page was not found and leads back to the Overview of the same project', () => {
    render(<ProjectNotFound />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Page not found');
    expect(screen.getByRole('link', { name: 'Open the Overview' })).toHaveAttribute(
      'href',
      '/p-store/overview',
    );
    expect(metadata.title).toBe('Page not found · Pyxis');
  });
});

describe('UnknownScreen', () => {
  it('answers not found for any path under a project that is not a screen', () => {
    expect(() => UnknownScreen()).toThrow('not-found');
    expect(unknownScreenMetadata.title).toBe('Page not found · Pyxis');
  });
});
