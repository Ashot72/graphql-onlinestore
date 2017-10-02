import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';

export const schema = [`

  # Product
  type Product {

      # The ID of this entry
      id: ID!

      # The name of the product
      name: String!

      # The product category
      category: Category!

      # The unit price of the product
      unitPrice: Float!

      # The total in stock of the product
      totalInStock: Int!

      # A timestamp of when the product was submitted
      createdAt: Date!

      # A timestamp of when the product was updated
      updatedAt: Date!  

      # The product picture
      picture: Picture   
  }
   
  # Product picture
  type Picture {

    # The name of the picture
    name: String

    # The type of the picture
    type: String

    # The size of the picture
    size: Int    

    # The image of the picture
    image: String
  }

  # Uploaded file
  input Upload {

    # The name of the file
    name: String!

    # The type of the file
    type: String!

    # The size of the file
    size: Int!

    # The path of the file
    path: String!   
  }

   # Product input
   input ProductInput {

        # The ID of this entry
        id: ID

        # The name of the product
        name: String

        # The category ID of the product
        category: ID

        # The unit price of the product
        unitPrice: Float

        # The total in stock of the product
        totalInStock: Int

        # The product picture
        picture: Upload
    }

    # Downloaded file content
    type FileContent {

      # File data
      file: String
    }
`];

  const dateType = new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return new Date(value); // value from the client
    },
    serialize(value) {
      return value.getTime(); // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10); // ast value is always in string format
      }
      return null;
    },
  });


export const resolvers = {
  Date: dateType,
  Product: {
    category: ({ category }, _, { Category, 
                 dataloaders: { dataCategoryLoader: { categoryLoader } } }) =>      
      categoryLoader.load(category),
       //Category.findById({ _id: category }), //no dataloader    
    picture: ({ picture }) => {    
      if (picture.image) {
          /*eslint no-param-reassign: 0*/
          picture.image = picture.image.toString('base64');          
      }            
      return picture;
    }     
  }
};
