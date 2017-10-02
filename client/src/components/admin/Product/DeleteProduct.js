import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { Panel, Button } from 'react-bootstrap';
import Loading from '../../Loading';
import Error from '../../Error';
import productQuery from '../../../queries/FetchProduct';
import query from '../../../queries/FetchProducts';
import deleteProductMutation from '../../../mutations/DeleteProduct';
import ordersQuery from '../../../queries/FetchOrders';

class DeleteProduct extends Component {

    constructor(props) {
        super(props);
        this.state = { errors: [] };
    }

    onDelete() {   
        const { product, deleteProduct } = this.props;
        deleteProduct({ id: product.id }, (errors) => {            
        this.setState({ errors });
        });
    }

     renderDeleteMessage() {
        const { loading, error, product, history, match: { params: { catId } } } = this.props;

        if (loading) return <Loading message='product' />;
        if (error) return <Error message={error.message} />;

        return (
            <div>
            <Panel header={'Confirmation'} bsStyle="primary" style={{ maxWidth: '400px' }}>
                Are you sure you want to delete the product '{ product.name }' ? <br /><br />
              <Button onClick={() => history.push(`/category/products/${catId}`)}>No</Button>&nbsp; 
                <Button bsStyle="primary" onClick={this.onDelete.bind(this)}>Yes</Button>    
            </Panel>                           
        </div>           
         );
      }

      render() {
        return (
            <div>
                { this.renderDeleteMessage() }     
                <div>
                    {this.state.errors.map(error => <div key={error}>{error}</div>)}
                </div>            
            </div>
        );
      } 
}

DeleteProduct.propTypes = {
    history: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.object,
    match: React.PropTypes.shape({
         params: React.PropTypes.shape({
           catId: React.PropTypes.string,
        })
    }),
    product: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        category: PropTypes.object,
        unitPrice: PropTypes.number.isRequired,
        totalInStock: PropTypes.number.isRequired,
        picture: PropTypes.shape({
            name: PropTypes.string,
            size: PropTypes.number,
            type: PropTypes.string,
            image: PropTypes.string
        })
    }),
    deleteProduct: PropTypes.func.isRequired
};

const withData = graphql(productQuery, {
  options: ({ match: { params: { id } } }) => ({    
     variables: { id }     
  }),
  props: ({ data: { loading, error, product } }) => ({
      loading, error, product
  })
});

const withMutations = graphql(deleteProductMutation, {
    props: ({ ownProps: { match: { params: { catId } }, history }, mutate }) => ({
        deleteProduct: ({ id }, cb) => mutate({
           variables: { id },
            refetchQueries: [{ query: ordersQuery }], 
            update: (store, { data: { deleteProduct } }) => {                                  
                const data = store.readQuery({ query,
                   variables: { category: catId }     
                });            
                data.products = data.products.filter(
                    (product) => product.id !== deleteProduct.id);             
                store.writeQuery({ query, 
                    variables: { category: catId }, 
                data });                                       
           }  
        })
        .then(() => history.push(`/category/products/${catId}`)) 
        .catch(res => {
           const errors = res.graphQLErrors.map(error => error.message);     
           cb(errors);    
        }),
    }),
});

export default withRouter(
               withMutations(
               withData(DeleteProduct)));
