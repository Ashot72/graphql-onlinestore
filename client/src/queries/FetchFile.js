import { gql } from 'react-apollo';

export default gql`
  query fileBase64($productId: ID!) {
    fileBase64(productId: $productId) {
      file
    }
  }
`;
