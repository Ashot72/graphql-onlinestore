import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { Link } from 'react-router-dom';
import Loading from '../../Loading';
import Error from '../../Error';
import productsQuery from '../../../queries/FetchProducts';

const Products = ({ match: { params: { id } }, loading, error, products }) => {
    if (loading) return <Loading message='products' />;
    if (error) return <Error message={error.message} />;

    return (
        <div>
            <div className="title">Products</div> 
            <div className="row"> 
                 <div className="col-xs-12">
                    <div className="column">
                       <Link to={`/product/new/${id}`}>
                         <div>Add Product</div>
                       </Link>
                    </div>
                  </div>                 
            </div>
            <div className="row"> 
                  <div className="col-xs-12 col-sm-6 header">
                    <div className="column">Name</div>
                  </div>                
                  <div className="hidden-xs col-sm-6 header center">
                    <div className="column">Action</div>
                  </div>
                { products.map((product, index) => {
                    const row = index % 2 === 0;

                    return (
                        <div key={product.id}>
                            <div className={`col-xs-12 col-sm-6 " ${row ? 'odd' : 'even'}`}>
                                <div className="column">{ product.name }</div>
                            </div>
                             <div className={`hidden-xs col-sm-6 " ${row ? 'odd' : 'even'}`}>
                                <div className="column center">
                                  <Link to={`/product/edit/${id}/${product.id}`}>Edit</Link> |&nbsp;
                                  <Link to={`/product/delete/${id}/${product.id}`}>Delete</Link> 
                                 </div>
                             </div>                                                     
                        </div>
                        );
                    }
                )}
            </div>
        </div>
    );
};

Products.propTypes = {
    loading: PropTypes.bool.isRequired,
    error: PropTypes.object,
    products: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,          
        createdAt: PropTypes.number,
        updatedAt: PropTypes.number
    }))
};

const withData = graphql(productsQuery, {
  options: ({ match: { params: { id } } }) => ({    
     variables: { category: id }        
  }),
  props: ({ data: { loading, error, products } }) => ({
      loading, error, products
  })
});

export default withData(Products);
