import { gql } from 'react-apollo';

export default gql`
 mutation addOrder ($order: OrderInput!) {
    addOrder(order: $order){
        id
        user {
            id
        }
        orderDetail{
            id     
            product {
                id
            }
            quantity
        }
    }
}
`;

