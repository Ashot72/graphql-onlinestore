import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, 
         FormGroup,
          FormControl, 
          ControlLabel, 
          Col, 
          Button,
          Alert
         } from 'react-bootstrap';

class UserForm extends Component {

   constructor(props) {
        super(props);   
        
        this.state = { name: '', surname: '', email: '', password: '', age: '' };
    } 

    onSubmit(evt) {
        evt.preventDefault();    
        this.props.onSubmit(evt, this.state);
    }

    renderForm() {       
        const { signup, errors } = this.props;

        return (                  
                <Form horizontal onSubmit={this.onSubmit.bind(this)}>
                    <FormGroup controlId="email">
                        <Col componentClass={ControlLabel} sm={2}>
                            Email
                        </Col>
                        <Col sm={10}>
                            <FormControl 
                                placeholder="Email" 
                                onChange={e => this.setState({ email: e.target.value })}
                            /> 
                        </Col>
                    </FormGroup>                    
                    <FormGroup controlId="password">
                        <Col componentClass={ControlLabel} sm={2}>
                          Password
                        </Col>
                        <Col sm={10}>
                          <FormControl 
                              type="password" placeholder="Password" 
                              onChange={e => this.setState({ password: e.target.value })}
                          /> 
                        </Col>
                    </FormGroup>
                    { signup &&
                        <FormGroup controlId="name">
                            <Col componentClass={ControlLabel} sm={2}>
                                Name
                            </Col>
                            <Col sm={10}>
                                <FormControl 
                                   placeholder="Name" 
                                   onChange={e => this.setState({ name: e.target.value })}
                                /> 
                            </Col>
                        </FormGroup>
                    }
                    { signup &&
                        <FormGroup controlId="surname">
                            <Col componentClass={ControlLabel} sm={2}>
                                Surname
                            </Col>
                            <Col sm={10}>
                                <FormControl 
                                   placeholder="Surname" 
                                   onChange={e => this.setState({ surname: e.target.value })}
                                /> 
                            </Col>
                        </FormGroup>
                     }
                     { signup &&
                        <FormGroup controlId="age">
                            <Col componentClass={ControlLabel} sm={2}>
                                Age
                            </Col>
                            <Col sm={10}>
                                <FormControl 
                                    placeholder="Age" 
                                    onChange={e => this.setState({ age: e.target.value })}
                                /> 
                            </Col>
                        </FormGroup>
                    }                                   
                        <FormGroup>                     
                            <Col smOffset={2} sm={10}>
                                { errors.length > 0 && 
                                    <Alert bsStyle="danger">
                                        { errors.map(error => <div key={error}>{error}</div>) }
                                    </Alert>           
                                }           
                                <Button 
                                   type="submit" 
                                   bsStyle="primary"
                                >
                                    {signup ? 'Sign Up' : 'Sign In'}
                                </Button>
                            </Col>
                        </FormGroup>
                </Form>        
        );
    }

    render() {    
        return (
            <div>        
              { this.renderForm() }             
            </div>
        );
    }
}

UserForm.propTypes = {  
    errors: PropTypes.arrayOf(PropTypes.string).isRequired,
    user: PropTypes.shape({
         id: PropTypes.string.isRequired,
         name: PropTypes.string.isRequired,
         surname: PropTypes.string.isRequired,
         email: PropTypes.string.isRequired,
         age: PropTypes.number
    }),
    onSubmit: PropTypes.func.isRequired
};

export default UserForm;
