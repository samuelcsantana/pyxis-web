import type {
  CreateProjectKeyOutcome,
  CreateProjectOutcome,
  DeleteProjectOutcome,
  ProjectKeyKind,
  RevokeProjectKeyOutcome,
  SaveProjectOutcome,
  SetCityOutcome,
} from '@/domain/project-management';
import {
  DEMO_STORE,
  type DemoTranslator,
  demoProjectNameOf,
  demoProjectOf,
} from '../demo/demo-projects';
import { demoPublicKeyId } from '../projects/demo-project-settings';
import type { IProjectManagementService } from './project-management-service.interface';

export const DEMO_CREATED_KEY_ID = '4d0f6b8c-5e7a-4f9b-8c4d-6e8f0a2b4c5d';

export const DEMO_CREATED_KEYS: Readonly<Record<ProjectKeyKind, string>> = {
  public: 'pyxis_pk_DemoPublicKeyThatSendsNothing0',
  secret: 'pyxis_sk_DemoSecretKeyThatErasesNothing',
};

export class MockProjectManagementService implements IProjectManagementService {
  constructor(private readonly translator: DemoTranslator) {}

  create(): Promise<CreateProjectOutcome> {
    return Promise.resolve({
      kind: 'created',
      project: { projectId: DEMO_STORE.id, publicKey: DEMO_CREATED_KEYS.public },
    });
  }

  update(): Promise<SaveProjectOutcome> {
    return Promise.resolve({ kind: 'saved' });
  }

  setCity(_projectId: string, cityEnabled: boolean): Promise<SetCityOutcome> {
    return Promise.resolve({ kind: 'saved', cityEnabled });
  }

  createKey(_projectId: string, kind: ProjectKeyKind): Promise<CreateProjectKeyOutcome> {
    return Promise.resolve({
      kind: 'created',
      key: { id: DEMO_CREATED_KEY_ID, kind, key: DEMO_CREATED_KEYS[kind] },
    });
  }

  revokeKey(projectId: string, keyId: string): Promise<RevokeProjectKeyOutcome> {
    return Promise.resolve(
      keyId === demoPublicKeyId(projectId) ? { kind: 'lastPublicKey' } : { kind: 'revoked' },
    );
  }

  async delete(projectId: string, confirmName: string): Promise<DeleteProjectOutcome> {
    const name = demoProjectNameOf(demoProjectOf(projectId), await this.translator());
    return confirmName === name ? { kind: 'deleted' } : { kind: 'nameMismatch' };
  }
}
