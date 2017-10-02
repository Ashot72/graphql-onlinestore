import { gql } from 'react-apollo';

export default gql`
    mutation deleteProduct($id: ID!) {
        deleteProduct(id: $id){
            id            
        }
    }
`;
