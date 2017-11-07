import * as local from '../../src/auth/localUtilities';

describe('localUtilities', () => {
  it('should get session storage', () => {
    const session = local.sessionStorageGetter();
    expect(session).not.toBeNull();
  });

  it('shoud get local storage', () => {
    const localStorage = local.localStorageGetter();
    expect(localStorage).not.toBeNull();
  });

  it('should get window hash', () => {
    window.location.hash = 'test';
    const hash = local.getWindowHash();
    expect(hash).toEqual('#test');
  });
});
