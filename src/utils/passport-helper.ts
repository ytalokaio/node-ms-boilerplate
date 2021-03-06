import passport from 'passport';
import passportLocal from 'passport-local';
import passportJwt from 'passport-jwt';
import jwt from 'jsonwebtoken';
import ErrorHandler from './error';

const USERS_MOCK = [
  {
    id: 1,
    name: 'Lucas Harada',
    email: 'lucas@mobixtec.com',
    password: '123123',
  },
  {
    id: 2,
    name: 'Renato Rodrigues',
    email: 'renato@mobixtec.com',
    password: '123123',
  },
];

const JWT_AUDIENCE = 'mobixtec.com';
const JWT_ISSUER = 'accounts.mobixtec.com';
const JWT_SECRET = process.env.JWT_SECRET || 'thisneedstobestoredsafelyandnevercommited';

const jwtOpts = {
  jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
  issuer: JWT_ISSUER,
  audience: JWT_AUDIENCE,
};

const localStrategy = new passportLocal.Strategy(
  {
    usernameField: 'email',
    passwordField: 'password',
  },
  (
    email: string,
    password: string,
    done: (error: Error, user?: object, options?: passportLocal.IVerifyOptions) => void,
  ) => {
    const user = USERS_MOCK.find(
      (mockUser) => mockUser.email === email && mockUser.password === password,
    );
    if (!user) {
      return done(new ErrorHandler(401, 'Email and password combination is invalid.'));
    }
    return done(null, user, { message: 'Signed in successfully.' });
  },
);

const jwtStrategy = new passportJwt.Strategy(
  jwtOpts,
  (payload: { email: string }, done: passportJwt.VerifiedCallback) => {
    const user = USERS_MOCK.find((user) => user.email === payload.email) || null;
    if (!user) {
      return done(new ErrorHandler(404, 'User not found'));
    } else {
      return done(null, user);
    }
  },
);

export const getToken = (user: { email: string }): string =>
  jwt.sign({ email: user.email }, JWT_SECRET, {
    audience: JWT_AUDIENCE,
    issuer: JWT_ISSUER,
  });

passport.use(localStrategy);
passport.use(jwtStrategy);
