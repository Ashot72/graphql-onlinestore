import { gql } from 'react-apollo';

export default gql`
  fragment CategoryDetail on Category {
        id
        name
        description
  }
`;
