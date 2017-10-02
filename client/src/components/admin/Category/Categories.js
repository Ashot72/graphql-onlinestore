import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { Link } from 'react-router-dom';
import Loading from '../../Loading';
import Error from '../../Error';
import categoriesQuery from '../../../queries/FetchCategories';
import AddCategory from './AddCategory';

const Categories = ({ loading, error, categories }) => {    
if (loading) return <Loading message='categories' />;
if (error) return <Error message={error.message} />;

return (
    <div>
        <div className="title">Add Category</div>            
        <AddCategory />          
        <div className="row"> 
                <div className="col-xs-12 col-sm-4 header">
                <div className="column">Name</div>
                </div>
                <div className="hidden-xs col-sm-5 header">
                <div className="column">Description</div>
                </div>
                <div className="hidden-xs col-sm-3 header center">
                <div className="column">Action</div>
                </div>
            </div>
            { 
                 categories && categories.map((cat, index) => {
                  const row = index % 2 === 0; 

                  return (
                    <div className="row" key={cat.id}>
                        <div className={`col-xs-12 col-sm-4 ${row ? 'odd' : 'even'}`}>
                            <div className={(cat.id < 0 ? 'column optimistic' : 'column')}>
                                { cat.name }
                            </div>
                        </div>
                        <div className={`hidden-xs col-sm-5 ${row ? 'odd' : 'even'}`}>
                            <div className={(cat.id < 0 ? 'column optimistic' : 'column')}>
                                { cat.description }&nbsp;
                            </div>
                        </div>
                        <div className={`hidden-xs col-sm-3 " ${row ? 'odd' : 'even'}`}>
                        <div className="column center">
                            <Link to={`/category/products/${cat.id}`}>View Products</Link> |&nbsp;
                            <Link to={`/category/edit/${cat.id}`}>Edit</Link> |&nbsp; 
                            <Link to={`/category/delete/${cat.id}`}>Delete</Link> 
                        </div>
                        </div>
                    </div>
                 );
                })
            }
        </div>   
      );
};

Categories.propTypes = {
    loading: PropTypes.bool.isRequired,
    error: PropTypes.object,
    categories: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
    }))
};

const withData = graphql(categoriesQuery, {
  props: ({ data: { loading, error, categories } }) => ({
      loading, error, categories
  })
});
  
export default withData(Categories);
