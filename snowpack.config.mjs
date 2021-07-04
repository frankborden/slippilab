/** @type {import("snowpack").SnowpackUserConfig } */
export default {
  // These work around bugs in snowpack and the node polyfill buffer library
  alias: {
    "'enet'": 'enet',
    'safer-buffer': 'safe-buffer',
  },
  mount: {
    public: { url: '/', static: true },
    src: { url: '/dist' },
  },
  packageOptions: {
    polyfillNode: true,
  },
};
