import { gql } from 'react-apollo';
import ProductPicture from '../fragments/ProductPicture';
import ProductDetail from '../fragments/Product';

export default gql`
  query products ($category: ID, $offset: Int, $limit: Int) {
    products(category: $category, offset: $offset, limit: $limit) {
       ...ProductDetail
       ...ProductPicture
    }
  }
  ${ProductDetail}
  ${ProductPicture}
`;
