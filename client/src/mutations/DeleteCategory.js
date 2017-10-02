import { gql } from 'react-apollo';

export default gql`
    mutation deleteCategory($id: ID!) {
        deleteCategory(id: $id){
            id
            name
            description
        }
    }
`;
