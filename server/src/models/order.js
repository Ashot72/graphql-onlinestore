import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const OrderDetailSchema = new Schema({
  product: { 
     type: Schema.Types.ObjectId,
     ref: 'product',
     required: true
   },
   quantity: { 
       type: Number, 
       required: true, 
       min: 1 
    },
});

const OrderSchema = new Schema({ 
   user: {
     type: Schema.Types.ObjectId,
     ref: 'user'
   },
   orderDetail: [OrderDetailSchema]
}, {
    timestamps: true 
});

OrderSchema.statics.saveOrder = function ({ id, user, product, quantity }) {    
  return this.findById({ _id: id || mongoose.Types.ObjectId() })
  .then(order => {  
      /*eslint no-param-reassign: 0*/
      order = (order == null) ? new Order({ user }) : order;         
      order.orderDetail.push({ product, quantity });
      return order.save();
   });    
};

OrderSchema.statics.findByProduct = function (productId) { 
     return this.find({ 'orderDetail.product': productId })
     .then(orders => orders);
};

OrderSchema.statics.findByUser = function (userId) {   
     return this.find({ user: userId })
     .then(orders => orders);
};

OrderSchema.statics.updateProductQuantity = function ({ orderId, orderDetailId, quantity }) {  
     return this.findOneAndUpdate({
            _id: orderId,
            orderDetail: {
              $elemMatch: { _id: orderDetailId }
            }
      },
      { $set: { 'orderDetail.$.quantity': quantity } },
      { new: true }
     )
     .then(order => order);     
};

export const Order = mongoose.model('order', OrderSchema);
