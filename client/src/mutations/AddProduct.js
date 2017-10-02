
import { gql } from 'react-apollo';
import ProductPicture from '../fragments/ProductPicture';
import ProductDetail from '../fragments/Product';

export default gql`
    mutation addProduct($product: ProductInput!) {
    addProduct(product: $product) {
       ...ProductDetail
       ...ProductPicture
      }
    }
    ${ProductDetail}
    ${ProductPicture}
`;

