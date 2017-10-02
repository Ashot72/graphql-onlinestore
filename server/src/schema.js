import { makeExecutableSchema } from 'graphql-tools';
import { rootResolvers } from './resolvers';
import { sqlSchema, sqlResolvers } from './schemas';

const rootSchema = [`
    type Query { 
        
        # Returns users
        users: [User!]!

        # Returns The logged in user
        user: User
        
        # Return categories
        categories: [Category!]

        # Returns single category
        category(            
            # The category ID

            id: ID!
        ): Category!

        # Returns Products
        products(
            # The category ID
            category: ID, 

            # The number of items to skip, for pagination
            offset: Int, 
            
            # The number of items to fetch starting from the offset, for pagination
            limit: Int            
        ): [Product]

        # Returns single Product
        product(
            # The product ID
            id: ID!
        ): Product!

        # Returns dile content Base64
        fileBase64(
            # The product ID
            productId: ID!
        ): FileContent

        # Returns orders by product ID
        ordersByProduct(
            # The product ID
            productId: ID
        ): [Order!]!

        # Returns logged in user's orders
        ordersByUser: [Order!]!        
    }

    type Mutation {  

        # User sign up
        signup(
            # The user input
            user: UserInput!
        ): User!

        # User login
        login(
            # user's email address
            email: String!,
            
            # user's password
            password: String!
        ): User!

        # User logout
        logout: User!

        # User update
        updateUser(
            # the user input
            user: UserInput
        ):  User!

        # User deletion
        deleteUser(
            # The user id
            id: ID!
        ): User!  

        # Category addition or update
        addOrUpdateCategory(
            # The category input
            category: CategoryInput!
        ): Category!     

        # Category deletion
        deleteCategory(
            # The category id
            id: ID!
        ): Category!  

        # Product addition
        addProduct(
            # The product input
            product: ProductInput!
        ): Product!

        # Product update
        updateProduct(
            # The product input
            product: ProductInput!
        ): Product!

        # Product deletion
        deleteProduct(
            # The product ID
            id: ID!
        ): Product!

        # Product picture deletion
        deletePicture(
            # The prodcut ID
            id: ID!
        ): Product!

        # Order addition
        addOrder(
            # The order input
            order: OrderInput!
        ): Order!

        # Product quantity update
        updateProductQuantity(
            # The order ID
            orderId: ID!, 

            # The order detail ID
            orderDetailId: ID!, 

            # The wuantity
            quantity: Int!
        ): Order!

        # Order deletion
        deleteOrder(
            # The order ID
            id: ID!
        ): Order!
    }
         
    type Subscription {  

         # Subscription fires on every product added
         productAdded(
             # The category ID
             categoryId: ID!
         ): Product
    }
`];

const schemas = [...rootSchema, ...sqlSchema];
const resolvers = { ...rootResolvers, ...sqlResolvers };

const schema = makeExecutableSchema({ 
  typeDefs: schemas, 
  resolvers 
});
export { schema };
