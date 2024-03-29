import passport, { DoneCallback } from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as GithubStrategy } from 'passport-github2'
import { Strategy as SpotifyStrategy } from 'passport-spotify'
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt'
import UserManager from '../dao/db/userManager'
import { cookieExtractor, parseSessionUser } from '../utils'

const users = new UserManager()

const initialize = () => {
	passport.use(new JWTStrategy({
		jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
		secretOrKey: process.env.SECRET as string
	}, (jwt_payload, done) => {
		try {
			done(null, jwt_payload)
		} catch (err) {
			done(err)
		}
	}))

	passport.use(new SpotifyStrategy({
		clientID: process.env.SPOTIFY_CLIENT_ID as string,
		clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
		callbackURL: 'https://melodream-server.onrender.com/api/login/spotify/check'
	}, (_accessToken, _refreshToken, _expires_in, profile, done) => {
		const { _json } = profile

		users.addSocialUser({
			name: _json.display_name,
			email: _json.email,
			userType: 'user'
		}).then(user => {
			return done(null, parseSessionUser(user))
		}).catch(err => {
			return done(err)
		})
	}))

	passport.use(new GithubStrategy({
		clientID: process.env.GITHUB_CLIENT_ID as string,
		clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
		callbackURL: !process.env.PORT ? 'https://melodream-server.onrender.com/api/login/github/check' : ''
	}, (_accessToken: any, _refreshToken: any, profile: any, done: DoneCallback) => {
		const { _json } = profile
		
		users.addSocialUser({
			name: _json.name,
			email: _json.email,
			userType: 'user'
		}).then(user => {
			return done(null, parseSessionUser(user))
		}).catch(err => {
			return done(err)
		})
	}))

	passport.use('local-login', new LocalStrategy({
		usernameField: 'email',
		passReqToCallback: true
	}, (req, _email, _password, done) => {
		const { email, password } = req.body

		return users.authUser(email, password)
		.then(user => {
			if (!user) return done(null, false)

			return done(null, parseSessionUser(user))
		}).catch(err => {
			return done(err)
		})
	}))

	passport.use('register', new LocalStrategy({
		passReqToCallback: true,
		usernameField: 'email'
	}, (req, _email, _password, done) => {
		const { name, email, password, userType, cart } = req.body

		return users.addUser({ email, name, password, userType, cart })
		.then(user => {
			return done(null, parseSessionUser(user))
		}).catch(err => {
			return done(err)
		})
	}))
}

export default initialize
