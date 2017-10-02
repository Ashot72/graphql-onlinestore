import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import query from '../../../queries/FetchProducts';
import addProductWithMutation from '../../../mutations/AddProduct';
import ProductForm from './ProductForm';

class AddProduct extends Component {

   constructor(props) {
       super(props);
       this.state = { errors: [] };   
   }

    onSubmit(evt, product) {   
        evt.preventDefault();
        /*eslint no-param-reassign: 0*/
        product.category = this.props.match.params.catId; 
      
        this.props.submitProduct({ product }, (errors) => {                   
           this.setState({ errors });
        });
    }

    onCancel() {   
        const { history, match: { params: { catId } } } = this.props;
        history.push(`/category/products/${catId}`);
    }

    render() {    
        return (
            <div>
                <div className="title">Add Product</div> 
                <ProductForm
                    errors={this.state.errors}
                    onSubmit={this.onSubmit.bind(this)}
                    onCancel={this.onCancel.bind(this)}
                />
            </div>
        );
    }
}

AddProduct.propTypes = {    
     history: React.PropTypes.object,  
     match: React.PropTypes.shape({
         params: React.PropTypes.shape({
           catId: React.PropTypes.string,
        })
    }),
    submitProduct: PropTypes.func.isRequired
};

const withMutations = graphql(addProductWithMutation, {
    props: ({ ownProps: { match: { params: { catId } }, history }, mutate }) => ({
        submitProduct: ({ product }, cb) => mutate({
           variables: { product },
              update: (store, { data: { addProduct } }) => {      
                try {                           
                    const data = store.readQuery({ query,
                    variables: { category: catId } 
                    });
                    // don't double add the message
                    if (!data.products.find(prd => prd.id === addProduct.id)) {                     
                        data.products.push(addProduct);
                    }
                    
                    store.writeQuery({ query, 
                        variables: { category: catId }, 
                    data });   
                 } catch (e) {                    
                    // continue regardless of error
                }                                    
           }  
        })
        .then(() => history.push(`/category/products/${catId}`))
        .catch(res => {
           const errors = res.graphQLErrors.map(error => error.message);
           cb(errors);
        }),
    }),
});

export default withRouter(withMutations(AddProduct));
