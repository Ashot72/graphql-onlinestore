import { gql } from 'react-apollo';
import ProductPicture from '../fragments/ProductPicture';
import ProductDetail from '../fragments/Product';

export default gql`
  subscription productAdded ($categoryId: ID!) {
    productAdded(categoryId: $categoryId) {
       ...ProductDetail
       ...ProductPicture
    }
  }
  ${ProductDetail}
  ${ProductPicture}
`;

