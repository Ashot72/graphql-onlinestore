import { gql } from 'react-apollo';

export default gql`
  mutation addOrUpdateCategory($category: CategoryInput!) {
    addOrUpdateCategory(category: $category){
      id
      name
      description
    }
}
`;
