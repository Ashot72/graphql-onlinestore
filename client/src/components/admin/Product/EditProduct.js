import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import Loading from '../../Loading';
import Error from '../../Error';
import productQuery from '../../../queries/FetchProduct';
import productsQuery from '../../../queries/FetchProducts';
import updateProductMutation from '../../../mutations/UpdateProduct';
import deletePictureMutation from '../../../mutations/DeletePicture';
import ProductForm from './ProductForm';

class EditProduct extends Component {

   constructor(props) {
       super(props);
       this.state = { errors: [] };   
   }

    onDeletePicture(evt, id) {
        evt.preventDefault();

        const { match: { params: { catId } } } = this.props;
        this.props.deletePicture({ id, catId }, (errors) => {                         
           this.setState({ errors });            
        });
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

    renderProduct() {
        const { loading, error, product } = this.props;

        if (loading) return <Loading message='product' />;
        if (error) return <Error message={error.message} />;

        return (
            <div>
                <div className="title">Update Product</div> 
                <ProductForm
                    product={product}
                    errors={this.state.errors}
                    onDeletePicture={this.onDeletePicture.bind(this)}
                    onSubmit={this.onSubmit.bind(this)} 
                    onCancel={this.onCancel.bind(this)}
                />
            </div>
        );            
    }

    render() {
        return (
            <div>
                { this.renderProduct() }                 
            </div>
        );
    }
}

EditProduct.propTypes = {   
    history: React.PropTypes.object.isRequired, 
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
        category: PropTypes.string,
        unitPrice: PropTypes.number.isRequired,
        totalInStock: PropTypes.number.isRequired,
        picture: PropTypes.shape({
            name: PropTypes.string,
            size: PropTypes.number,
            type: PropTypes.string,
            image: PropTypes.string
        })
    }),
    submitProduct: PropTypes.func.isRequired
};

const withData = graphql(productQuery, {
  options: ({ match: { params: { id } } }) => ({      
     variables: { id }     
  }),
  props: ({ data: { loading, error, product } }) => ({
      loading, error, product
  })
});

const withMutationsUpdateProdcut = graphql(updateProductMutation, {
    props: ({ ownProps: { match: { params: { catId } }, history }, mutate }) => ({
        submitProduct: ({ product }, cb) => mutate({
           variables: { product }
        })    
        .then(() => history.push(`/category/products/${catId}`))   
        .catch(res => {
           const errors = res.graphQLErrors.map(error => error.message);
           cb(errors);
        }),
    }),
});

const withMutationsDeletePicture = graphql(deletePictureMutation, {
    props: ({ mutate }) => ({
        deletePicture: ({ id, catId }, cb) => mutate({
           variables: { id },
             refetchQueries: [{ query: productsQuery,
              variables: { category: catId } 
             }], 
        })            
        .catch(res => {       
           const errors = res.graphQLErrors.map(error => error.message);
           cb(errors);
        }),
    }),
});

export default withRouter(
               withData(
               withMutationsUpdateProdcut(
               withMutationsDeletePicture(EditProduct))));
