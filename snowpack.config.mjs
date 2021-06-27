/** @type {import("snowpack").SnowpackUserConfig } */
export default {
  // These work around bugs in snowpack and the node polyfill buffer library
  alias: {
    "'enet'": 'enet',
    'safer-buffer': 'safe-buffer',
  },
  // slippi-visualiser is a separate project by schmooblidon.
  mount: {
    public: { url: '/', static: true },
    src: { url: '/dist' },
    '../slippi-visualiser': { url: '/slippi-visualiser', static: true },
  },
  plugins: ['@snowpack/plugin-typescript'],
  packageOptions: {
    polyfillNode: true,
  },
};
