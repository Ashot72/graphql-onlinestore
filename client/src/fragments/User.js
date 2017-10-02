import { gql } from 'react-apollo';

export default gql`
  fragment UserDetail on User {     
        id
        name
        surname
        age
        email   
  }
`;
