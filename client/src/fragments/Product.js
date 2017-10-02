import { gql } from 'react-apollo';

export default gql`
  fragment ProductDetail on Product {
        id
        name
        unitPrice
        totalInStock
        createdAt
        updatedAt       
  }
`;
