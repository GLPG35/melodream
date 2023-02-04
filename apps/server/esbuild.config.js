require('esbuild').build({
	entryPoints: ["src/index.ts"],
	bundle: true,
	platform: 'node',
	external: ['express'],
	outfile: "dist/index.js"
}).then(() => {
	console.log('⚡ Done')
}).catch(() => {
	process.exit(1)
}).then(() => {
	require('fs/promises').readFile('./dist/index.js', 'utf8')
	.then(data => {
		const parsedData = data.replace(/("|')(.*)assets\/(.*)('|")/g, '"./$3"')

		require('fs/promises').writeFile('./dist/index.js', parsedData, 'utf-8').then(() => {
			require('fs/promises').cp('./src/assets', './dist', { recursive: true })
		})
	})
})

