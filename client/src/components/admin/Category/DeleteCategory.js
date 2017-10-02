import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { Panel, Button } from 'react-bootstrap';
import Loading from '../../Loading';
import Error from '../../Error';
import categoryQuery from '../../../queries/FetchCategory';
import query from '../../../queries/FetchCategories';
import deleteCategoryMutation from '../../../mutations/DeleteCategory';

    class DeleteCategory extends Component {

        constructor(props) {
          super(props);
          this.state = { errors: [] };
        }

        onDelete() {   
            const { category, deleteCategory } = this.props;
            deleteCategory({ id: category.id }, (errors) => {            
            this.setState({ errors });
            });
        }

        renderDeleteMessage() {
            const { loading, error, category, history } = this.props;

            if (loading) return <Loading message='category' />;
            if (error) return <Error message={error.message} />;

             return (
                <div>
                 <Panel header={'Confirmation'} bsStyle="primary" style={{ maxWidth: '400px' }}>
                    Are you sure you want to delete the category '{ category.name }' ? <br /><br />
                    <Button onClick={() => history.push('/categories')}>No</Button>&nbsp; 
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

DeleteCategory.propTypes = {
    history: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.object,
    category: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
    }),
    deleteCategory: PropTypes.func.isRequired
};

const withData = graphql(categoryQuery, {
  options: ({ match: { params: { id } } }) => ({    
     variables: { id }     
  }),
  props: ({ data: { loading, error, category } }) => ({
      loading, error, category
  })
});

const withMutations = graphql(deleteCategoryMutation, {
    props: ({ ownProps: { history }, mutate }) => ({
        deleteCategory: ({ id }, cb) => mutate({
           variables: { id },
            update: (store, { data: { deleteCategory } }) => {                                  
                const data = store.readQuery({ query });            
                data.categories = data.categories.filter(
                    (category) => category.id !== deleteCategory.id);             
                store.writeQuery({ query, data });                                       
           }  
        })
        .then(() => history.push('/categories'))
        .catch(res => {
           const errors = res.graphQLErrors.map(error => error.message);     
           cb(errors);    
        }),
    }),
});

export default withRouter(
               withMutations(
               withData(DeleteCategory)));
