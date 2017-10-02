import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import Loading from '../../Loading';
import Error from '../../Error';
import usersQuery from '../../../queries/FetchUsers';

const Users = ({ loading, error, users }) => {
    if (loading) return <Loading message='users' />;
    if (error) return <Error message={error.message} />;

    return (
        <div> 
            <div className="title">Users</div>
            <div className="row"> 
                <div className="col-xs-6 col-sm-4 header">
                    <div className="column">Full Name</div>
                </div>           
                <div className="col-xs-6 col-sm-4 header">
                    <div className="column">Email</div>
                </div> 
                <div className="hidden-xs col-sm-4 header">
                    <div className="column">Age</div>
                </div>
            </div>           
            { users.map((user, index) => {
                    const row = index % 2 === 0;

                     return (
                        <div className="row" key={user.id}>    
                            <div className={`col-xs-6 col-sm-4 " + ${row ? 'odd' : 'even'}`}>
                                <div className="column">{ user.name } { user.surname }</div>
                            </div>
                            <div className={`col-xs-6 col-sm-4 ' ${row ? 'odd' : 'even'}`}>
                                <div className="column">{ user.email }</div>
                            </div> 
                            <div className={`hidden-xs col-sm-4 ' ${row ? 'odd' : 'even'}`}>
                                <div className="column">{ user.age }&nbsp;</div>
                            </div>             
                        </div>
                     );
                } 
               
            )}
        </div>
    );
};

Users.propTypes = {
    loading: PropTypes.bool.isRequired,
    error: PropTypes.object,
    users: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        surname: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        age: PropTypes.number,
    }))
};

const withData = graphql(usersQuery, {
  props: ({ data: { loading, error, users } }) => ({
      loading, error, users
  })
});
  
export default withData(Users);
