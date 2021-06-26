/** @type {import("snowpack").SnowpackUserConfig } */
export default {
  alias: {
    "'enet'": 'enet',
    'safer-buffer': 'safe-buffer',
  },
  mount: {
    public: { url: '/', static: true },
    src: { url: '/dist' },
    "../slippi-visualiser": {url: '/slippi-visualiser', static: true },
  },
  plugins: [
    [
      '@snowpack/plugin-typescript',
      {
        /* Yarn PnP workaround: see https://www.npmjs.com/package/@snowpack/plugin-typescript */
        ...(process.versions.pnp ? { tsc: 'yarn pnpify tsc' } : {}),
      },
    ],
  ],
  routes: [
    /* Enable an SPA Fallback in development: */
    // {"match": "routes", "src": ".*", "dest": "/index.html"},
  ],
  optimize: {
    /* Example: Bundle your final build: */
    // "bundle": true,
  },
  packageOptions: {
    polyfillNode: true,
    /* ... */
  },
  devOptions: {
    /* ... */
  },
  buildOptions: {
    /* ... */
  },
};
