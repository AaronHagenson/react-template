import {createAuth} from '../../src/auth/auth0Factory';

describe('auth0Factory', () => {
  it('should create auth instance', () => {
    const auth = createAuth({
      domain: 'domain',
      clientID: 'client',
      callbackURL: 'url',
      responseType: 'token'
    });

    expect(auth).not.toBeNull();
  });
});
