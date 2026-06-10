import adapter from '@sveltejs/adapter-static';

/** User/org site (repo named username.github.io) is served at the domain root — no base path. */
const base = process.env.BASE_PATH ?? '';

export default {
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: 'index.html',
      strict: false
    }),

    paths: {
      base
    },

    prerender: {
      handleHttpError: 'warn',
      handleUnseenRoutes: 'ignore'
    }
  }
};