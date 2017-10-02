/*eslint no-param-reassign: 0*/

import * as fs from 'fs';
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: { type: String, required: true },
  category: { 
    type: Schema.Types.ObjectId,
    ref: 'category',
    required: true
  },
  unitPrice: { 
      type: Number,
       required: true, 
       min: 1 
  },
  totalInStock: {
       type: Number, 
       required: true,
       min: 1
  },
  picture: {
    name: { type: String },
    type: { type: String },
    size: { type: Number },
    image: { type: Buffer }
  }
}, {
    timestamps: true 
});

ProductSchema.statics.addProduct = function (product) {  
      const picture = product.picture;   
     
      if (picture) {        
         picture.image = fs.readFileSync(picture.path);  
      }     
     
      return new Product(product).save()
        .then(dbProduct => {
          if (picture) { fs.unlinkSync(picture.path); }
          return dbProduct;
        });      
};

ProductSchema.statics.updateProduct = function ({ id, name, unitPrice, totalInStock, picture }) { 
    return this.findById({ _id: id })
      .then(product => {
         product.name = name; 
         product.unitPrice = unitPrice;
         product.totalInStock = totalInStock; 

         if (picture) { 
            product.picture = picture;
            product.picture.image = fs.readFileSync(picture.path); 
         } 

         return new Product(product).save()
          .then(dbProduct => {
            if (picture) { fs.unlinkSync(picture.path); }
            return dbProduct;
        });           
      });
};

ProductSchema.statics.removePicture = function (id) { 
  return this.findByIdAndUpdate({ _id: id }, { $unset: { picture: 1 } })
    .then(product => product);
};

ProductSchema.statics.removeProduct = function (id) { 
   const Order = mongoose.model('order');

   return this.findByIdAndRemove({ _id: id })
    .then(product => 
          Order.update({ 'orderDetail.product': id },    
          {
            $pull: { orderDetail: { product: id } }
          },
          { multi: true })
          .then(() => product)   
    );
};   

ProductSchema.statics.fileBase64 = function (id) {
   return this.findById({ _id: id })
    .then(({ picture: { image } }) =>   
      (image ? { file: image.toString('base64') } : null)  
   );
};

export const Product = mongoose.model('product', ProductSchema);
