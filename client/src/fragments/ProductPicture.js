import { gql } from 'react-apollo';

export default gql`
  fragment ProductPicture on Product {
     picture {
          name
          type 
          image
        }   
  }
`;
