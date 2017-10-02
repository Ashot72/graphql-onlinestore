
export const schema = [`   

    # User
    type User {

        # The ID of this entry
        id: ID!

        # The name of the user
        name: String!

        # The surname of the user
        surname: String!

        # The age of the user
        age: Int

        # The password of the user
        password: String!

        # The email of the user
        email: String!
    }

    # User input
    input UserInput {

        # The ID of this entry
        id: ID

        # The name of the user
        name: String

        # The surname of the user
        surname: String

        # The age of the user
        age: Int

        # The password of the user
        password: String

        # The email of the user
        email: String
    }
`];
