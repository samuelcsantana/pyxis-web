import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TEST_PROJECT } from '@/test-utils/project-choices';
import { ProjectChoicesProvider, useProjectChoices } from './project-choices';

function CurrentName() {
  const { currentProject, projects, canCreateProject, ownsCurrentProject } = useProjectChoices();
  return (
    <p>
      {`${currentProject.name} of ${String(projects.length)}, new: ${String(canCreateProject)}, owned: ${String(ownsCurrentProject)}`}
    </p>
  );
}

describe('ProjectChoicesProvider', () => {
  it('gives the projects of the admin, the current one, whether one can be created and whether the admin owns it', () => {
    render(
      <ProjectChoicesProvider
        projects={[TEST_PROJECT]}
        currentProject={TEST_PROJECT}
        canCreateProject
        ownsCurrentProject
      >
        <CurrentName />
      </ProjectChoicesProvider>,
    );

    expect(screen.getByText('Demo Store of 1, new: true, owned: true')).toBeInTheDocument();
  });

  it('refuses to be read without a provider above it', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    expect(() => render(<CurrentName />)).toThrow(
      'useProjectChoices needs a ProjectChoicesProvider above it.',
    );
  });
});
