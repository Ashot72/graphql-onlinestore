import { gql } from 'react-apollo';
import CategoryDetail from '../fragments/Category';

export default gql`
  query {
    categories {
        ...CategoryDetail
    }
  }
  ${CategoryDetail}
`;
