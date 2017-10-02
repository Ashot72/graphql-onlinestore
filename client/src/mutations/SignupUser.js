import { gql } from 'react-apollo';

export default gql`
   mutation signup($user: UserInput!){
        signup(user: $user){
            id
            name
            surname
            age       
        }
    }
`;
