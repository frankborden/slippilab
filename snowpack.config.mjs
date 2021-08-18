/** @type {import("snowpack").SnowpackUserConfig } */
export default {
  alias: {
    // https://github.com/ChALkeR/safer-buffer/issues/7
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
