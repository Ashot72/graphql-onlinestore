import { gql } from 'react-apollo';
import UserDetail from '../fragments/User';

export default gql`
  query {
      users {
        ...UserDetail  
     }
  }
  ${UserDetail}
`;
