require('esbuild').build({
	entryPoints: ["src/index.ts"],
	bundle: true,
	platform: 'node',
	external: [
		'artillery-plugin-metrics-by-endpoint',
		'bcrypt',
		'express-compression',
		'connect-mongo',
		'cookie-parser',
		'cors',
		'dotenv',
		'express',
		'express-handlebars',
		'googleapis',
		'jsonwebtoken',
		'mongoose',
		'mongoose-paginate-v2',
		'multer',
		'nodemailer',
		'passport',
		'passport-github2',
		'passport-jwt',
		'passport-local',
		'passport-spotify',
		'socket.io',
		'winston',
		'@faker-js/faker'
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
		})
	]
}).then(() => {
	console.log('⚡ Done')
}).catch(err => {
	console.error(err)
	process.exit(1)
})