import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import currentUserQuery from '../queries/FetchCurrentUser';

export default (WrappedComponent) => {
    class RequireAuth extends Component {

        componentWillUpdate(nextProps) {              
            if (!nextProps.loading && !nextProps.user) {             
              this.props.history.push('/signin');
            }
        }

        render() {
            return <WrappedComponent {...this.props} />;
        }
    }

    const withData = graphql(currentUserQuery, {
        props: ({ data: { loading, error, user } }) => ({
            loading, error, user
        })
    });

    return withRouter(withData(RequireAuth)); 
};
