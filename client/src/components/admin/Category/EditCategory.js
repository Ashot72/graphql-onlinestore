import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import Loading from '../../Loading';
import Error from '../../Error';
import categoryQuery from '../../../queries/FetchCategory';
import addOrUpdateCategoryMutation from '../../../mutations/AddOrUpdateCategory';
import CategoryForm from './CategoryForm';

  class EditCategory extends Component {

   constructor(props) {
       super(props);
       this.state = { errors: [] };
   }

    onSubmit(evt, category) {   
        evt.preventDefault();
        
        this.props.submitCategory({ category }, (errors) => {            
           this.setState({ errors });
        });
    }

   onCancel() {    
        this.props.history.push('/categories');
    }

    renderCategory() {
        const { loading, error, category } = this.props;

        if (loading) return <Loading message='category' />;
        if (error) return <Error message={error.message} />;

        return (
               <CategoryForm
                  Category={category}
                  errors={this.state.errors}
                  onSubmit={this.onSubmit.bind(this)}
                  onCancel={this.onCancel.bind(this)}
               />
        );
    }

    render() {
        return (
            <div>
                { this.renderCategory() }                 
            </div>
        );
    }    
}

EditCategory.propTypes = {
    history: React.PropTypes.object.isRequired, 
    loading: PropTypes.bool.isRequired,
    error: PropTypes.object,
    category: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
    }),
    submitCategory: PropTypes.func.isRequired
};

const withData = graphql(categoryQuery, {
  options: ({ match: { params: { id } } }) => ({    
     variables: { id }
  }),
  props: ({ data: { loading, error, category } }) => ({
      loading, error, category
  })
});
    
const withMutations = graphql(addOrUpdateCategoryMutation, {
    props: ({ ownProps: { history }, mutate }) => ({
        submitCategory: ({ category }, cb) => mutate({
           variables: { category }
        })
        .then(() => history.push('/categories'))
        .catch(res => {
           const errors = res.graphQLErrors.map(error => error.message);
           cb(errors);
        }),
    }),
});

export default withRouter(
               withData(
               withMutations(EditCategory)));
