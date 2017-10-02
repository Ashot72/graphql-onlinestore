import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { isNil } from 'lodash';
import { Thumbnail } from 'react-bootstrap';
import Loading from './Loading';
import Error from './Error';
import ordersQuery from '../queries/FetchOrders';
import { toLocalTime } from './functions';

const Orders = ({ loading, error, ordersByUser }) => {
    if (loading) return <Loading message='orders' />;
    if (error) return <Error message={error.message} />;

return (
 <div>
    <div className="title">Orders</div>  
    <div className="row"> 
        <div className="col-xs-12 col-sm-6 header" style={{ fontSize: '20px' }}>
            <div className="column">Orderer</div>
        </div>
            <div className="hidden-xs col-sm-6 header" style={{ fontSize: '20px' }}>
            <div className="column">Created</div>
        </div>  
    </div>             
        { 
        ordersByUser.map((order, index) => {
            const row = index % 2 === 0;

        return (
            <div className="row" key={order.id}>
                <div className={`col-xs-12 col-sm-6 " ${row ? 'odd' : 'even'}`}>
                    <div className="column">{ order.user.name} { order.user.surname }</div>
                </div>
                <div className={`hidden-xs col-sm-6 " ${row ? 'odd' : 'even'}`}>
                    <div className="column">{ toLocalTime(order.createdAt) }</div>
                </div>
        
                <div className={'col-xs-12'} style={{ paddingLeft: '30px' }}>
                {                            
                    order.orderDetail.map(
                    ({ id, product: { name, picture, category }, quantity }, innerIndex) => {
                        const innerRow = innerIndex % 2 === 0;
                    
                        return (
                        <div className="row" key={id}>
                          <div className={'col-xs-6 col-sm-2'}>
                            { !isNil(picture.name) ?
                                <Thumbnail
                                    href="#" 
                                    src={`data:${picture.type};base64,${picture.image}`} 
                                    alt={name} 
                                    title={name} 
                                /> :
                                <Thumbnail href="#" src="./nopicture.jpg" /> 
                            }
                          </div>
                          <div className={`col-xs-4 " ${innerRow ? 'even' : 'odd'}`}>
                                <div className="column">{ name }</div>
                          </div>
                          <div className={`hidden-xs col-sm-4 " ${innerRow ? 'even' : 'odd'}`}>
                            <div className="column"><strong>Category:</strong> {category.name}</div>
                          </div>
                          <div className={`col-xs-2 col-sm-2 " ${innerRow ? 'even' : 'odd'}`}>
                             <div className="column"><strong>Qty:</strong> {quantity}</div>
                          </div>                                         
                         </div>                             
                        );
                      }                       
                  )}                   
              </div>                         
            </div>
          );
        }
      )}
 </div>     
 );
};

Orders.propTypes = {
    loading: PropTypes.bool.isRequired,
    error: PropTypes.object,  
    ordersByUser: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,         
        createdAt: PropTypes.number,
        updatedAt: PropTypes.number,
        user: PropTypes.shape({
          name: PropTypes.string.isRequired, 
          surname: PropTypes.string.isRequired, 
          email: PropTypes.string.isRequired, 
        }),
        orderDetail: PropTypes.arrayOf(PropTypes.shape({
            quantity: PropTypes.number.isRequired,
            product: PropTypes.shape({
               id: PropTypes.string.isRequired,
               name: PropTypes.string.isRequired,
               category: PropTypes.object.isRequired,
               picture: PropTypes.shape({
                 name: PropTypes.string,
                 size: PropTypes.number,
                 type: PropTypes.string,
                 image: PropTypes.string
             })           
         }),
       })),
    }))
};

const withData = graphql(ordersQuery, {
  options: ({     
     // fetchPolicy: 'cache-and-network',        
  }),
  props: ({ data: { loading, error, ordersByUser } }) => ({
      loading, error, ordersByUser
  })
});

export default withData(Orders);
