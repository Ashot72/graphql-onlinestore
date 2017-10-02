import mongoose from 'mongoose';
import { withFilter } from 'graphql-subscriptions';
import { pubsub } from '../services/pubsub';

const ERROR = 'Must be logged in for this action';
const PRODUCT_ADDED = 'productAdded';

export const rootResolvers = {
  Query: {  
    // Users
    users: (parent, _, { User, req: { user } }) => {
      if (!user) { throw new Error(ERROR); }    
         return User.find({});
    },    
        
    user: (parent, _, { req }) => req.user, 
    
    // Categories
    categories: (parent, _, { Category }) => Category.find({}),

    category: (parent, { id }, { Category, req: { user } }) => {
        if (!user) { throw new Error(ERROR); }
        return Category.findById({ _id: id });
    },
 
    // Products
    products: (parent, { category, offset, limit }, { Product }) => 
                    Product.find({ category }).skip(offset).limit(limit),

    product: (parent, { id }, { Product, req: { user } }) => {
       if (!user) { throw new Error(ERROR); }
       return Product.findById({ _id: id }); 
    },

    fileBase64: (parent, { productId }, { Product }) => Product.fileBase64(productId),          
   
    // Orders
    ordersByProduct: (parent, { productId }, { Order, req: { user } }) => {
       if (!user) { throw new Error(ERROR); }
       return Order.findByProduct(productId);
    },

    ordersByUser: (parent, _, { Order, req: { user } }) => {
      if (!user) { throw new Error(ERROR); }
      return Order.findByUser(user.id);
    }    
  },
  Mutation: {
    // Auth
    signup: (parent, { user }, { AuthService, req }) => AuthService.signup({ user, req }),

    login: (parent, { email, password }, { AuthService, req }) => 
                                AuthService.login({ email, password, req }),

    logout: (parent, _, { req }) => {
      const { user } = req;  
      req.logout();
      return user;
    },
    // Users
    deleteUser: (parent, { id }, { User, req: { user } }) => {
      if (!user) { throw new Error(ERROR); }
      return User.findByIdAndRemove({ _id: id });
    }, 

    updateUser: (parent, { user }, { User, req }) => {
      if (!req.user) { throw new Error(ERROR); }
      return User.findByIdAndUpdate(user.id, user, { new: true });
    },

    // Categories
    addOrUpdateCategory: (parent, { category }, { Category, req: { user } }) => {
      if (!user) { throw new Error(ERROR); }  
     const categoryId = category.id ? category.id : mongoose.Types.ObjectId();
     return Category.findByIdAndUpdate(categoryId, category, { new: true, upsert: true });
    },

    deleteCategory: (parent, { id }, { Category, req: { user } }) => {
       if (!user) { throw new Error(ERROR); }
      return Category.findByIdAndRemove({ _id: id });
    },

    // Products
    addProduct: async (parent, { product }, { Product, req: { user } }) => {
        if (!user) { throw new Error(ERROR); }
       const productAdded = await Product.addProduct(product);    
       pubsub.publish(PRODUCT_ADDED, { productAdded, categoryId: product.category });
       return productAdded;     
    }, 

    updateProduct: async (parent, { product }, { Product, req: { user } }) => {
       if (!user) { throw new Error(ERROR); }
      return await Product.updateProduct(product);      
    },

    deletePicture: (parent, { id }, { Product, req: { user } }) => {
       if (!user) { throw new Error(ERROR); }
      return Product.removePicture(id);
    },

    deleteProduct: (parent, { id }, { Product, req: { user } }) => {
        if (!user) { throw new Error(ERROR); }
       return Product.removeProduct(id); 
    },

    // Orders 
    addOrder: (parent, { order }, { Order, req: { user } }) => {
        if (!user) { throw new Error(ERROR); }
       return Order.saveOrder(order);     
    },

    updateProductQuantity: (parent, args, { Order, req: { user } }) => {
       if (!user) { throw new Error(ERROR); }
       return Order.updateProductQuantity(args);
    },
    
    deleteOrder: (parent, { id }, { Order, req: { user } }) => {
       if (!user) { throw new Error(ERROR); }
       return Order.findByIdAndRemove({ _id: id });
    } 
  },
  Subscription: {
    productAdded: {         
       subscribe: withFilter(() => pubsub.asyncIterator(PRODUCT_ADDED), (payload, args) => 
          payload.productAdded.category.toString() === args.categoryId
       )    
    }
  }
};
