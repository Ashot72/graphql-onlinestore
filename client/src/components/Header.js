import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { Link, withRouter } from 'react-router-dom';
import { MenuItem, Nav, Navbar, NavItem, NavDropdown } from 'react-bootstrap';
import Loading from './Loading';
import Error from './Error';
import query from '../queries/FetchCurrentUser';
import logoutMutation from '../mutations/Logout';

const Header = ({ location: { pathname }, loading, error, user, onLogout, history }) => {
    if (loading) return <Loading message='current user' />;
    if (error) return <Error message={error.message} />;

    const navigate = (path) => history.push(path);

    const renderButtons = () => 
         <div>
            { user == null 
                ? <div style={{ textAlign: 'center' }}>               
                    { pathname === '/signup' && 
                       <Link to="/signin" className="title">Sign In</Link> 
                    }            
                    { pathname === '/signin' && 
                       <Link to="/signup" className="title">Sign Up</Link> 
                    }                                             
                  </div> 
                : null        
            }
       </div>;   

   const renderNavBar = () =>      
    <Navbar inverse fixedTop fluid>
        <Navbar.Header>
            <Navbar.Brand>
                <a href="/">Online Store</a>
            </Navbar.Brand>
            <Navbar.Toggle />
        </Navbar.Header>
            { user && 
            <Navbar.Collapse>                    
              <Nav>
                <NavItem eventKey={1} onClick={() => navigate('/categories')}>Categories</NavItem>
                <NavItem eventKey={2} onClick={() => navigate('/orders')}>Orders</NavItem>
                <NavItem eventKey={3} onClick={() => navigate('/users')}>Users</NavItem>
              </Nav>               
              <Nav pullRight>
                <NavDropdown eventKey={1} title={user.email} id="basic-nav-dropdown">
                   <MenuItem eventKey={1.1} onClick={() => onLogout()}>Logout</MenuItem> 
                </NavDropdown>
              </Nav>                                   
            </Navbar.Collapse>
            }
            { !user && 
              <Navbar.Collapse>                      
                <Nav pullRight>
                    <NavItem eventKey={1} onClick={() => navigate('/signin')}>Sign In</NavItem>
                </Nav>                                   
            </Navbar.Collapse>
            } 
    </Navbar>;

    return (
        <div>
            { renderNavBar() } 
            { renderButtons() }
        </div>       
    );
};

Header.propTypes = {
    loading: PropTypes.bool.isRequired,
    error: PropTypes.object,
     user: PropTypes.shape({
         id: PropTypes.string.isRequired,       
         email: PropTypes.string.isRequired
    }),
    onLogout: PropTypes.func.isRequired
};

const withMutations = graphql(logoutMutation, {
    props: ({ mutate }) => ({
        onLogout: () => mutate({
           refetchQueries: [{ query }]
        })             
    }),
});

const withData = graphql(query, {
  props: ({ data: { loading, error, user } }) => ({
      loading, error, user
  })
});

export default withRouter(
               withMutations(
               withData(Header)));
