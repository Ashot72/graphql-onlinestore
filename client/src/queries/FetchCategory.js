import { gql } from 'react-apollo';
import CategoryDetail from '../fragments/Category';

export default gql`
 query category($id: ID!) {
    category(id: $id) {
      ...CategoryDetail
    }
 }
 ${CategoryDetail}
`;
