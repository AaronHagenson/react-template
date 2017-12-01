import initialState from '../../src/reducers/initialState';

describe('initialState', () => {
  it('should return an empty object', () => {
    expect(initialState).toEqual({});
  });
});
