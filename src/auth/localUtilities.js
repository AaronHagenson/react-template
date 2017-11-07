export const sessionStorageGetter = () => {
  return window['sessionStorage'];
};

export const localStorageGetter = () => {
  return window['localStorage'];
};

export const getWindowHash = () => {
  return global.window.location.hash;
};

export const isNullOrEmpty = value => {
  return value === undefined || value === null || value === '';
};
