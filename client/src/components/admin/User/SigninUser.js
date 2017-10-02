import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import currentUserQuery from '../../../queries/FetchCurrentUser';
import signinMutation from '../../../mutations/SigninUser';
import UserForm from './UserForm';

class SigninUser extends Component {

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
                <div className="title">Sign In</div>
                <UserForm
                    signup={false}
                    errors={this.state.errors}
                    onSubmit={this.onSubmit.bind(this)}
                />
            </div>
        );
    }
}

SigninUser.propTypes = { 
    history: PropTypes.object.isRequired,
    user: PropTypes.shape({
         id: PropTypes.string.isRequired,       
         email: PropTypes.string.isRequired
    }),
    submitUser: PropTypes.func.isRequired
};

const withMutations = graphql(signinMutation, {
    props: ({ mutate }) => ({
        submitUser: ({ user: { email, password } }, cb) => mutate({
           variables: { email, password },
           refetchQueries: [{ query: currentUserQuery }] 
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
               withData(SigninUser)));
