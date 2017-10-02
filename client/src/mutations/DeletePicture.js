
import { gql } from 'react-apollo';

export default gql`
    mutation deletePicture($id: ID!) {
        deletePicture(id: $id) {
              id           
            }
        }    
`;

