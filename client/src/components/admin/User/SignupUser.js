import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import query from '../../../queries/FetchUsers';
import currentUserQuery from '../../../queries/FetchCurrentUser';
import signupMutation from '../../../mutations/SignupUser';
import UserForm from './UserForm';

class SignupUser extends Component {
  
   constructor(props) {
       super(props);
       this.state = { errors: [] };
   }

   componentWillUpdate(nextProps) {    
      const { user, history } = this.props;
      if (!user && nextProps.user) {
          history.push('/');
      }
   }
   
    onSubmit(evt, user) {   
        evt.preventDefault();
        
        this.props.submitUser({ user }, (errors) => {            
           this.setState({ errors });
        });
    }

    render() {    
        return (
            <div>
                <div className="title">Sign Up</div>
                <UserForm
                    signup
                    errors={this.state.errors}
                    onSubmit={this.onSubmit.bind(this)}
                />
            </div>
        );
    }
}

SignupUser.propTypes = { 
    history: PropTypes.object.isRequired,
    user: PropTypes.shape({
         id: PropTypes.string.isRequired,       
         email: PropTypes.string.isRequired
    }),
    submitUser: PropTypes.func.isRequired
};

const withMutations = graphql(signupMutation, {
    props: ({ mutate }) => ({
        submitUser: ({ user }, cb) => mutate({
           variables: { user },      
              refetchQueries: [{ query: currentUserQuery }],        
              update: (store, { data: { signup } }) => {                                        
                const data = store.readQuery({ query });
                data.users.push(signup);                            
                store.writeQuery({ query, data });                                      
              }  
        })          
        .catch(res => {
           const errors = res.graphQLErrors.map(error => error.message);
           cb(errors);
        }),
    }),
});

const withData = graphql(currentUserQuery, {
  props: ({ data: { loading, error, user } }) => ({
      loading, error, user
  })
});

export default withRouter(
               withMutations(
               withData(SignupUser)));
