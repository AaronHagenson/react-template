import {isIis} from '../../src/config/configSource';

describe('configSource', () => {
  it('should return false', () => {
    expect(isIis()).toBe(false);
  });
});
