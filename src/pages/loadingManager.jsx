// src/loadingManager.js
let handlers = {
  showLoading: () => {},
  hideLoading: () => {},
};

export const setLoadingHandlers = (newHandlers) => {
  handlers = newHandlers;
};

export const getLoadingHandlers = () => handlers;
