import { describe, expect, it } from 'vitest';
import { dashboardManifest } from './web-app-manifest';

describe('dashboardManifest', () => {
  it('names the app and points at the icons it already serves', () => {
    const app = dashboardManifest();

    expect(app.name).toBe('Pyxis');
    expect(app.start_url).toBe('/');
    expect(app.display).toBe('standalone');
    expect(app.icons?.map((icon) => icon.src)).toEqual(['/icon.svg', '/apple-icon.png']);
  });
});
