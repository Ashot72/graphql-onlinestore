export const schema = [`

  # Category
  type Category {

    # The ID of this entry
    id: ID!

    # The name of the category
    name: String!

    # The description of the category
    description: String
  }

  # Category input
  input CategoryInput {

    # The ID of this entry
    id: ID

    # The name of the category
    name: String

    # The description of the category
    description: String
  }
`];
