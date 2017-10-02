import { gql } from 'react-apollo';
import ProductPicture from '../fragments/ProductPicture';
import UserDetail from '../fragments/User';

export default gql`
  query ordersByUser {
    ordersByUser {
      id
      createdAt
      user {
        ...UserDetail   
      }
      orderDetail {
        id
        product {
          id
          name
           category {
            id
            name
          }
          ...ProductPicture   
        }
        quantity
      }
    }
}
${UserDetail}
${ProductPicture}
`;

