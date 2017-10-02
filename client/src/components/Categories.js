import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { NavLink } from 'react-router-dom';
import Loading from './Loading';
import Error from './Error';
import categoriesQuery from '../queries/FetchCategories';

const Categories = ({ loading, error, categories }) => {    
    if (loading) return <Loading message='categories' />;
    if (error) return <Error message={error.message} />;

    return (
        <div style={{ lineHeight: '25px' }}>
            { categories && categories.map(cat => 
                <div key={cat.id}>
                    <NavLink 
                      activeStyle={{ color: 'black', fontSize: '15px', textDecoration: 'none' }} 
                      to={`/${cat.id}`}
                    >
                      { cat.name }
                    </NavLink>
                </div>
            )}
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
