import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: { type: String, required: true },
  description: { type: String }
}, {
    timestamps: true 
});

CategorySchema.pre('findOneAndUpdate', function (next) {    
  const update = this.getUpdate();

  if (update.name.trim() === '') {
    return next(new Error('Name is required'));
  }
  next();
});

export const Category = mongoose.model('category', CategorySchema);
