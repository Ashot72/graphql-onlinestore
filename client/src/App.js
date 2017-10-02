import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient, toIdValue } from 'apollo-client';
import { createNetworkInterface } from 'apollo-upload-client';
import { addGraphQLSubscriptions } from 'add-graphql-subscriptions';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import router from './router';
import './App.css';

const networkInterface = createNetworkInterface({ 
  uri: 'http://localhost:4000/graphql',
  opts: {
    credentials: 'include'
  }
 });
 
networkInterface.use([{
  applyMiddleware(req, next) {
    setTimeout(next, 500);
  },
}]);

const wsClient = new SubscriptionClient('ws://localhost:4000/subscriptions', {
  reconnect: true
});

const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  networkInterface, 
  wsClient
);

const dataIdFromObject = (result) => {
  /* eslint no-underscore-dangle: 0 */
  if (result.__typename) { 
    if (result.id !== undefined) {    
      return `${result.__typename}:${result.id}`;
    }
  }
  return null;
};

const client = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions,
   customResolvers: {
     Query: {
       category: (_, args) =>          
         toIdValue(dataIdFromObject({ __typename: 'Category', id: args.id })),       
        product: (_, args) => 
         toIdValue(dataIdFromObject({ __typename: 'Product', id: args.id })),       
        user: (_, args) =>  
         toIdValue(dataIdFromObject({ __typename: 'User', id: args.id }))       
     }
  },
 dataIdFromObject
});

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>       
        <Router>        
          { router }       
        </Router>        
      </ApolloProvider>
    );
  }
}

export default App;
