import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProjectPanel } from './project-panel';

describe('ProjectPanel', () => {
  it('lists the project settings', () => {
    render(
      <ProjectPanel
        project={{
          id: 'p1',
          name: 'Demo Store',
          timezone: 'America/Sao_Paulo',
          conversionEvent: 'signup_completed',
        }}
      />,
    );

    expect(screen.getByRole('heading', { name: 'Project settings' })).toBeInTheDocument();
    expect(screen.getByText('America/Sao_Paulo')).toBeInTheDocument();
    expect(screen.getByText('signup_completed')).toBeInTheDocument();
  });

  it('says when no conversion event is set', () => {
    render(
      <ProjectPanel project={{ id: 'p2', name: 'Docs', timezone: 'UTC', conversionEvent: null }} />,
    );

    expect(screen.getByText('Not set')).toBeInTheDocument();
  });
});
