import passport from 'passport';
import LocalStrategy from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

import db from '../models';

// import { sendVerificationEmail } from '../helpers/email';

require('dotenv').config();
const { Op } = require("sequelize");

const localOptions = {
  passReqToCallback: true,
  usernameField: 'email',
};

passport.serializeUser((user, done) => { // In serialize user you decide what to store in the session. Here I'm storing the user id only.
  done(null, user.id);
});

passport.deserializeUser((id, done) => { // Here you retrieve all the info of the user from the session storage using the user id stored in the session earlier using serialize user.
  db.user.findOne({
    where: {
      [Op.or]: [
        { id },
      ],
    },
  }).then((user) => {
    done(null, user);
  }).catch((error) => {
    done(error, null);
  });
});

const localLogin = new LocalStrategy(localOptions, (req, email, password, done) => {
  console.log(email);
  console.log(password);
  db.user.findOne({
    where: {
      [Op.or]: [
        {
          email: email.toLowerCase(),
        },
      ],
    },
  }).then((user) => {
    if (!user) {
      req.authErr = 'USER_NOT_EXIST';
      return done(null, false, { message: 'USER_NOT_EXIST' });
    }
    user.comparePassword(password, (err, isMatch) => {
      if (!isMatch) {
        console.log('password does not match');
        req.authErr = 'WRONG_PASSWORD';
        return done(null, false, { message: 'USER_NOT_EXIST' });
      }

      if (user.role < 1) {
        console.log('email is not verified');
        req.authErr = 'EMAIL_NOT_VERIFIED';
        console.log('123');
        return done('EMAIL_NOT_VERIFIED', false);
      }
      console.log('end locallogin');
      console.log('services/passport req.session.tfa called to true');
      req.session.tfa = user.tfa;
      done(null, user);
    });
  }).catch((error) => {
    console.log('localLogin error services/passport');
    console.log(error);
    req.authErr = error;
    done(error, false);
  });
});

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: process.env.JWT_SECRET,
};

const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  console.log(payload);
  console.log('jwtLogin payload');
  db.user.findOne({
    where: {
      [Op.or]: [
        { id: payload.sub },
      ],
    },
  }).then((exist) => {
    if (exist) {
      console.log('jwt login exist');
      done(null, exist);
    } else {
      console.log('jwtLogin warning');
      done(null, false);
    }
  }).catch((error) => done(error, false));
});

passport.use(jwtLogin);
passport.use(localLogin);
