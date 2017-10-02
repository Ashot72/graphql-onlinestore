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

class CategoryForm extends Component {

    constructor(props) {
        super(props);
   
        const { id, name, description } = props.Category || {};
        this.state = { id, name: name || '', description: description || '' };
    } 

    onSubmit(evt) {
        evt.preventDefault();    
        this.props.onSubmit(evt, this.state);
    }

    onCancel(evt) {
        this.props.onCancel(evt);
    }

    renderForm() {       
      const { Category, errors } = this.props;

      return (      
            <Form horizontal onSubmit={this.onSubmit.bind(this)}>
                <FormGroup controlId="name">
                    <Col componentClass={ControlLabel} sm={2}>
                        Name
                    </Col>
                    <Col sm={10}>
                        <FormControl
                            className="large-input"
                            name="name"
                            placeholder="Name" 
                            value={this.state.name}
                            onChange={e => this.setState({ name: e.target.value })}
                        /> 
                    </Col>
                </FormGroup>
                <FormGroup controlId="description">
                    <Col componentClass={ControlLabel} sm={2}>
                        Descriptioon
                    </Col>
                    <Col sm={10}>
                        <FormControl 
                            className="large-input"
                            name="description" 
                            placeholder="Descriptioon" 
                            value={this.state.description}
                            onChange={e => this.setState({ description: e.target.value })}
                        /> 
                    </Col>
                </FormGroup>
                 <FormGroup>                     
                    <Col smOffset={2} sm={10}>  
                       { errors.length > 0 && 
                                <Alert bsStyle="danger">
                                    { errors.map(error => <div key={error}>{error}</div>) }
                                </Alert>           
                        }         
                        { Category && 
                            <span>
                               <Button onClick={this.onCancel.bind(this)}>Cancel</Button>&nbsp;
                            </span> }                           
                        <Button type="submit" bsStyle="primary">Save</Button>
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

CategoryForm.propTypes = {  
    errors: PropTypes.arrayOf(PropTypes.string).isRequired,
    category: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired
    }),
    onSubmit: PropTypes.func.isRequired
};

export default CategoryForm;
