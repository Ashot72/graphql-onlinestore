import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isNil } from 'lodash';
import { Form, 
        FormGroup,
        FormControl, 
        ControlLabel, 
        Col, 
        Button,
        Alert,
        Thumbnail
         } from 'react-bootstrap';
import { toLocalTime } from '../../functions';

class ProductForm extends Component {

    constructor(props) {
        super(props);
  
        const { id, name, unitPrice, totalInStock } = props.product || {};   
        this.state = { id, 
                     name: name || '', 
                     unitPrice: unitPrice || '', 
                     totalInStock: totalInStock || '', 
                     noImage: false
                };          
    } 

    onDeletePicture(evt, id) {    
        this.setState({ noImage: true });  
        this.props.onDeletePicture(evt, id);
    }

    onSubmit(evt) {
        evt.preventDefault();   

        const { id, name, unitPrice, totalInStock, picture } = this.state; 
        this.props.onSubmit(evt, { id, name, unitPrice, totalInStock, picture });
    }

    onCancel(evt) {
        this.props.onCancel(evt);
    }

      renderForm() {
        const { product, errors } = this.props;
        const { noImage } = this.state;

      return (         
        <Form horizontal onSubmit={this.onSubmit.bind(this)}>
            <FormGroup controlId="name">
                <Col componentClass={ControlLabel} sm={2}>
                    Name
                </Col>
                <Col sm={10}>
                    <FormControl 
                        className="large-input"
                        placeholder="Name" 
                        value={this.state.name}
                        onChange={e => this.setState({ name: e.target.value })}
                    /> 
                </Col>
            </FormGroup>
            <FormGroup controlId="untiprice">
                <Col componentClass={ControlLabel} sm={2}>
                    Unit Price ($)
                </Col>
                <Col sm={10}>
                    <FormControl 
                        className="small-input"
                        placeholder="Unit Price" 
                        value={this.state.unitPrice}
                        onChange={e => this.setState({ unitPrice: e.target.value })}
                    /> 
                </Col>
            </FormGroup>
                <FormGroup controlId="totalinstock">
                <Col componentClass={ControlLabel} sm={2}>
                    Total In Stock
                </Col>
                <Col sm={10}>
                    <FormControl
                        className="small-input"
                        placeholder="Total In Stock" 
                        value={this.state.totalInStock}
                        onChange={e => this.setState({ totalInStock: e.target.value })}
                    /> 
                </Col>
            </FormGroup>                                                               
            { product && !isNil(product.picture.name) && !noImage && 
                    <FormGroup controlId="name">
                        <Col componentClass={ControlLabel} sm={2}>
                            Picture
                        </Col>
                        <Col sm={2}>
                            <div>                          
                            <Thumbnail                              
                               href="#" 
                               src={`data:${product.picture.type};base64,${product.picture.image}`} 
                               alt='Picture'                                   
                            />                                                  
                            <div>  
                                <a 
                                style={{ cursor: 'pointer' }} 
                                onClick={(e) => this.onDeletePicture(e, product.id)}
                                >Delete Picture</a>                             
                            </div>                                                    
                         </div>  
                        </Col>
                    </FormGroup>
                }
                { product && 
                    <div>
                    <FormGroup controlId="createdat">
                            <Col componentClass={ControlLabel} sm={2}>
                                Created
                            </Col>
                            <Col sm={10} style={{ marginTop: '6px' }}>
                                { toLocalTime(product.createdAt) }
                            </Col>
                        </FormGroup>
                        <FormGroup controlId="updatedat">
                            <Col componentClass={ControlLabel} sm={2}>
                                Updated
                            </Col>
                            <Col sm={10} style={{ marginTop: '6px' }}>
                                { toLocalTime(product.updatedAt) }
                            </Col>
                        </FormGroup>
                    </div>
                }                 
                <FormGroup controlId="file">
                <Col componentClass={ControlLabel} sm={2}>
                    File
                </Col>
                <Col sm={10} style={{ marginTop: '5px' }}>
                        <input 
                        type="file"
                        accept={'image/jpeg,image/png'}
                        onChange={e => this.setState({ picture: e.target.files[0] })}
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
                 <Button onClick={this.onCancel.bind(this)}>Cancel</Button>&nbsp;
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

ProductForm.propTypes = {  
    errors: PropTypes.arrayOf(PropTypes.string).isRequired, 
     product: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        category: PropTypes.string,
        unitPrice: PropTypes.number.isRequired,
        totalInStock: PropTypes.number.isRequired,
        picture: PropTypes.shape({
            name: PropTypes.string,
            size: PropTypes.number,
            type: PropTypes.string,
            image: PropTypes.string
        })
    }),
    onSubmit: PropTypes.func.isRequired,
    onDeletePicture: PropTypes.func
};

export default ProductForm;
