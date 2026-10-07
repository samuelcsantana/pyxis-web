import { describe, expect, it } from 'vitest';
import manifest from './manifest';

describe('manifest', () => {
  it('names the app and points at the icons it already serves', () => {
    const app = manifest();

    expect(app.name).toBe('Pyxis');
    expect(app.start_url).toBe('/');
    expect(app.display).toBe('standalone');
    expect(app.icons?.map((icon) => icon.src)).toEqual(['/icon.svg', '/apple-icon.png']);
  });
});
