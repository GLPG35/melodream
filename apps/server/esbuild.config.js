require('esbuild').build({
	entryPoints: ["src/index.ts"],
	bundle: true,
	platform: 'node',
	external: [
		'bcrypt',
		'compression',
		'connect-mongo',
		'cookie-parser',
		'cors',
		'dotenv',
		'express',
		'express-handlebars',
		'jsonwebtoken',
		'mongoose',
		'mongoose-paginate-v2',
		'multer',
		'passport',
		'passport-github2',
		'passport-jwt',
		'passport-local',
		'passport-spotify',
		'socket.io'
	],
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
		}),
		require('esbuild-copy-static-files')({
			src: 'src/.logs',
			dest: 'dist/.logs',
			recursive: true
		})
	]
}).then(() => {
	console.log('⚡ Done')
}).catch(() => {
	process.exit(1)
})