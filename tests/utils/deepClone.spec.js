import clone from '../../src/utils/deepClone';

describe('deepClone', () => {
  it('should clone an object', () => {
    const thing1 = {
      word: 'cat',
      array: [1, 2, 3, 4, 5],
      subObject: {
        param: 10
      }
    };

    const thing2 = clone(thing1);

    expect(thing1).toEqual(thing2);
    expect(thing1).not.toBe(thing2);
  });
});
