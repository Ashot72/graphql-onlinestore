import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { isEmpty } from 'lodash';
import query from '../../../queries/FetchCategories';
import addOrUpdateCategoryMutation from '../../../mutations/AddOrUpdateCategory';
import CategoryForm from './CategoryForm';

class AddCategory extends Component {
  
   constructor(props) {
       super(props);
       this.state = { errors: [] };
   }

    onSubmit(evt, category) {   
        evt.preventDefault();
     
        const { name, description } = evt.target; 

        this.props.submitCategory({ category }, (errors) => { 
            if (!isEmpty(errors)) {           
               this.setState({ errors });
            } else {
                name.value = description.value = '';
                this.setState({ errors: [] });
            }
        });
    }

    render() {    
        return (         
            <CategoryForm
                errors={this.state.errors}
                onSubmit={this.onSubmit.bind(this)} 
            />           
        );
    }
}

AddCategory.propTypes = { 
    submitCategory: PropTypes.func.isRequired
};

const withMutations = graphql(addOrUpdateCategoryMutation, {
    props: ({ mutate }) => ({
        submitCategory: ({ category }, cb) => mutate({
           variables: { category },
              optimisticResponse: {
                addOrUpdateCategory: {
                  name: category.name,
                  description: category.description,
                  id: Math.round(Math.random() * -1000000).toString(),
                  __typename: 'Category'
                }
              },
              update: (store, { data: { addOrUpdateCategory } }) => {                             
                const data = store.readQuery({ query });
                data.categories.push(addOrUpdateCategory);                            
                store.writeQuery({ query, data });                                      
              }  
        })     
        .then(() => cb())
        .catch(res => {
           const errors = res.graphQLErrors.map(error => error.message);
           cb(errors);
        })           
    }),
});

export default withMutations(AddCategory);
