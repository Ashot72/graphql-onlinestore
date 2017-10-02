import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, withApollo } from 'react-apollo';
import { Link, withRouter } from 'react-router-dom';
import { Thumbnail, Button, Alert } from 'react-bootstrap';
import { isNil, assign } from 'lodash';
import Loading from './Loading';
import Error from './Error';
import productsQuery from '../queries/FetchProducts';
import query from '../queries/FetchFile';
import currentUserQuery from '../queries/FetchCurrentUser';
import addOrderMutation from '../mutations/AddOrder';
import productAddedSubscription from '../subscriptions/ProductAdded';
import { toLocalTime, b64DecodeUnicode } from './functions';

class Products extends Component {

    constructor(props) {
        super(props);
        this.state = { errors: [] };
        this.subscriptions = [];      
    }

     componentWillReceiveProps(nextProps) {      
        const { match: { params: { id } } } = this.props;

        if (!this.subscriptions.includes(id) && !nextProps.loading && id) {
            this.subscriptions.push(id);

            this.subscription = this.props.subscribeToMore({
                document: productAddedSubscription,
                variables: {
                    categoryId: id
                },
                updateQuery: (prev, { subscriptionData }) => {
                    if (!subscriptionData.data) {
                        return prev;
                    }
                 
                    const newProduct = subscriptionData.data.productAdded;                
                    const { picture } = newProduct;

                    if (picture.image) {
                       picture.image = b64DecodeUnicode(picture.image);
                    }
      
                    // don't double add the product                 
                    if (!prev.products.find(product => product.id === newProduct.id)) {
                        return assign({}, prev, {
                            products: [...prev.products, newProduct]
                        });
                    }
                    return prev;                
                }
            });
        }
    }

    loggedOnUserQuery = () => 
        this.props.client.readQuery({
            query: currentUserQuery        
        });    

    order = (evt, productId) => {
        evt.preventDefault();
        
        const userQuery = this.loggedOnUserQuery();

        if (userQuery.user == null) this.props.history.push('/signin');        
        const quantity = this.refs[productId].value;

        this.props.submitOrder(
            { user: userQuery.user.id, product: productId, quantity }, (errors) => {            
            this.setState({ errors });
        });
    }

    createSelectItem = () => {
        const items = [];         
        for (let i = 1; i <= 3; i++) {             
            items.push(<option key={i} value={i}>{i}</option>);              
        }
        return items;
    }

    download = (productId, picture) => {  
        const { client, downloadFile } = this.props;

            downloadFile(client, productId, (file) => {                    
            const downloadFileRef = this.refs.downloadFile;      
            downloadFileRef.href = `data:${picture.type};base64,${file}`;
            downloadFileRef.download = picture.name;
            downloadFileRef.click();
            });
    }

    renderProducts() {
        const { loading, error, products, fetchMore } = this.props;

        if (loading) return <Loading message='products' />;
        if (error) return <Error message={error.message} />;

       const userQuery = this.loggedOnUserQuery();

        return products && products.length > 0
        ? <div className="row">
            <a ref='downloadFile' />   
            <div className="title">Products</div>                      
            {    
                products.map(
                ({ id, name, unitPrice, totalInStock, createdAt, updatedAt, picture }, index) => {
                    const row = index % 2 === 0; 

                    return (
                    <div className="row" key={id}>    
                        <div className={'col-xs-12 col-sm-2'}>
                                { !isNil(picture.name) ?
                                    <Thumbnail
                                        href="#" 
                                        src={`data:${picture.type};base64,${picture.image}`} 
                                        alt={name} 
                                        title={name} 
                                    /> :
                                    <Thumbnail href="#" src="./nopicture.jpg" /> 
                                }
                        </div>
                        <div className="row col-xs-12 col-sm-10">
                          <div className={`col-xs-12 " ${row ? 'odd' : 'even'}`}>
                                <div className="column"><strong>{ name}</strong>
                             </div>                           
                          </div>
                          <div className={'col-xs-12'} style={{ paddingTop: '2px' }}>
                                <div>{`Unit Price: $${unitPrice}`}</div>
                          </div>
                          <div className={'col-xs-12'}>
                            <div>{`Total In Stock: ${totalInStock}`}</div>       
                           </div>   
                           <div className={'col-xs-12'}>
                            <div>
                                {
                                    userQuery.user == null 
                                    ? 
                                    <Link to="/signin">Sign In to order</Link>
                                    : <div className="column">
                                        <select ref={id} style={{ height: '30px' }}>
                                            { this.createSelectItem() }
                                        </select>&nbsp;
                                        <Button
                                            bsStyle="primary" 
                                            onClick={e => this.order(e, id)}
                                        >Order now
                                        </Button>
                                      </div>                                    
                                }
                            </div>
                            <div style={{ fontSize: '12px' }}>
                                <a 
                                    style={{ cursor: 'pointer' }} 
                                    onClick={() => this.download(id, picture)}
                                >Download Specification
                                </a>
                            </div>


                            </div>                             
                            <div className={'col-xs-12'}>
                        <div>{`Updated: ${toLocalTime(updatedAt)}`}</div>
                            </div>
                        </div>                                                                  
                    </div>
                    );
                    }
                  )      
                }               
                <div className='center'><br />
                    <Button bsStyle="primary" onClick={fetchMore}>Load more products</Button>
                </div>                  
            </div>
        : <div className='center'> 
                <Alert bsStyle="info">Select a category to load products</Alert>
            </div>;     
    }

    render() {
        return (
        <div>
            { this.renderProducts() }   
            <div>
                {this.state.errors.map(error => <div key={error}>{error}</div>)}
            </div>    
        </div>
        );
}
  }

Products.propTypes = {
    loading: PropTypes.bool.isRequired,
    error: PropTypes.object,  
    products: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        category: PropTypes.object,
        unitPrice: PropTypes.number.isRequired,
        totalInStock: PropTypes.number.isRequired,
        createdAt: PropTypes.number.isRequired,
        updatedAt: PropTypes.number.isRequired,
        picture: PropTypes.shape({
            name: PropTypes.string,
            size: PropTypes.number,
            type: PropTypes.string,
            image: PropTypes.string
        }) 
    })),
    submitOrder: PropTypes.func.isRequired,
    fetchMore: PropTypes.func.isRequired,
    subscribeToMore: PropTypes.func.isRequired,
    downloadFile: PropTypes.func.isRequired,
    client: PropTypes.object.isRequired
};

const withMutations = graphql(addOrderMutation, {
    props: ({ ownProps: { history }, mutate }) => ({
        submitOrder: ({ user, product, quantity }, cb) => mutate({
           variables: { order: { /*id: '59cb834e71d91518cc36b306',*/ user, product, quantity } }
        })    
        .then(() => history.push('/orders'))   
        .catch(res => {
           const errors = res.graphQLErrors.map(error => error.message);
           cb(errors);
        }),
        downloadFile: (client, productId, cb) => {
            client.query({
                query, 
                variables: { productId }
            }).then(res => {
                const fileBase64 = res.data.fileBase64;
                cb(fileBase64 ? fileBase64.file : null);
            });
        }
    }),
});

const ITEMS_PER_PAGE = 5;
const withData = graphql(productsQuery, {
  options: ({ match }) => ({    
     variables: { 
         category: match.params.id === 'products' ? null : match.params.id,
         offset: 0,
         limit: ITEMS_PER_PAGE
     }     
  }),
  props: ({ data: { loading, error, products, fetchMore, subscribeToMore } }) => ({
      loading, 
      error, 
      products,
      fetchMore: () => fetchMore({
          variables: {
              offset: products.length
          },
          updateQuery: (prev, { fetchMoreResult }) => {         
              if (!fetchMoreResult) { return prev; }
              return assign({}, prev, {
                  products: [...prev.products, ...fetchMoreResult.products]
              });
          }
      }),
      subscribeToMore
  })
});

export default withRouter(
               withApollo(
               withMutations(
               withData(Products))));
