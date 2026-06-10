import adapter from '@sveltejs/adapter-static';

const dev = process.env.NODE_ENV !== 'production';

export default {
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: 'index.html'
		}),

		paths: {
			base: dev ? '' : '/LtDragibusDev.github.io'
		},

		prerender: {
			handleHttpError: 'warn'
		}
	}
};