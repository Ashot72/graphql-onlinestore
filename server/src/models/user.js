import bcrypt from 'bcrypt-nodejs';
import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const Schema = mongoose.Schema;

const validateEmail = email => {
    const re = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
};

const UserSchema = new Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    age: { type: Number, required: true, min: 4 },
    password: { type: String, required: true },
    email: { 
        type: String, 
        required: true, 
        lowercase: true, 
        trim: true, 
        unique: true,
        validate: [validateEmail, 'Please fill a valid email address']    
 }
}, {
    timestamps: true 
});

UserSchema.pre('save', function save(next) {
   const user = this;
   if (!user.isModified('password')) { return next(); }
   bcrypt.genSalt(10, (err, salt) => {
       if (err) { return next(err); }
       bcrypt.hash(user.password, salt, null, (error, hash) => {
        if (error) { return next(error); }
        user.password = hash;
        next();
       });
   });
});

UserSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
       cb(err, isMatch);
    });
};

UserSchema.plugin(uniqueValidator);

export const User = mongoose.model('user', UserSchema);
