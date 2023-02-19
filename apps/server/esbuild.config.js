require('esbuild').build({
	entryPoints: ["src/index.ts"],
	bundle: true,
	platform: 'node',
	external: ['express', 'multer'],
	outfile: "dist/index.js",
	plugins: [
		require('esbuild-copy-static-files')({
			src: 'src/public',
			dest: 'dist/public',
			recursive: true
		}),
		require('esbuild-copy-static-files')({
			src: 'src/views',
			dest: 'dist/views',
			recursive: true
		})
	]
}).then(() => {
	console.log('⚡ Done')
}).catch(() => {
	process.exit(1)
})