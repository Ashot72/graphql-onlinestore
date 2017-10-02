import { find } from 'lodash';

export const schema = [`

 scalar Date

  # Order detail
  type OrderDetail {

    # The ID of this entry
    id: ID!

    # An ordered product
    product: Product!

    # An ordered product quantity
    quantity: Int!
  }

  # Order
  type Order {

    # The ID of this entry
    id: ID!

    # A timestamp of when the order was placed
    createdAt: Date!

    # A timestamp of when the order was updated
    updatedAt: Date!

    # The orderer
    user: User!

    # The order detail
    orderDetail: [OrderDetail!]!  
  }

  # Order input
  input OrderInput {

      # The ID of this entry
      id: ID

      # The ID of orderer
      user: ID

      # The ordered product ID
      product: ID

      # The ordered product quantity
      quantity: Int!
  }
`];

export const resolvers = {
  Order: {    
    user: ({ user }, _, { User, dataloaders: { dataUserLoader: { userLoader } } }) =>   
      userLoader.load(user),
    // User.findById({ _id: user }), // no dataloader    

    orderDetail: async ({ orderDetail }, _, { Product,
                        dataloaders: { dataProductLoader: { productLoader } } }) => {
        const promises = orderDetail.map(detail => productLoader.load(detail.product)
        // no dataloader
        // const promises = orderDetail.map(detail => Product.findById({ _id: detail.product }) 
        .then(product => {            
            /* eslint no-underscore-dangle: 0 */
            const theOrderDetail = find(orderDetail, { product: product._id });     
            theOrderDetail.product = product;  
                       
            return theOrderDetail;
        })            
      );    

      return Promise.all(promises).then(orderdetail => orderdetail);   
    }
  }
};
