import { gql } from 'react-apollo';
import ProductPicture from '../fragments/ProductPicture';
import ProductDetail from '../fragments/Product';

export default gql`
  query product ($id: ID!) {
    product(id: $id) {
        ...ProductDetail
        ...ProductPicture 
    }
  }
  ${ProductDetail}
  ${ProductPicture}
`;

