import { gql } from 'react-apollo';
import ProductPicture from '../fragments/ProductPicture';
import ProductDetail from '../fragments/Product';

export default gql`
    mutation updateProduct($product: ProductInput!) {
      updateProduct(product: $product) {
          ...ProductDetail
          ...ProductPicture                     
        }
    }   
    ${ProductDetail}
    ${ProductPicture} 
`;

