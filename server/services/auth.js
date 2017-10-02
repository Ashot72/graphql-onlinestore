import mongoose from 'mongoose';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

const User = mongoose.model('user');

passport.serializeUser((user, done) => {     
    done(null, user.id);
});

passport.deserializeUser((id, done) => {      
  User.findById(id, (err, user) => {
      done(err, user);
  });
});

passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
   User.findOne({ email: email.toLowerCase() }, (err, user) => {          
       if (err) { return done(err); }
       if (!user) { return done(null, false, 'Invalid Credentials'); }
       user.comparePassword(password, (error, isMatch) => {
           if (error) { return done(error); }
           if (isMatch) {           
               return done(null, user);
           }
           return done(null, false, 'Invalid Credentials');
       });
   });
}));

const signup = ({ user, req }) => {
    if (!user.email || !user.password) { 
       throw new Error('You must provide an email and password');
    }
    return User.findOne({ email: user.email })
     .then(existingUser => {
         if (existingUser) { throw new Error('Email in use'); }
         return new User(user).save();
     })
     .then(usr => 
         new Promise((resolve, reject) => {
             req.login(usr, (err) => {
                 if (err) { reject(err); }
                 resolve(usr);
             });
         })
     );
};

const login = ({ email, password, req }) => 
    new Promise((resolve, reject) => {
        passport.authenticate('local', (err, user) => {          
            if (!user) { reject('Invalid Credentials'); }     
            req.login(user, () => resolve(user));
        })({ body: { email, password } });
    });

export default { signup, login };
