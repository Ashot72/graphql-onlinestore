
import express from 'express';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { execute, subscribe } from 'graphql';
import connectMongo from 'connect-mongo';
import { createServer } from 'http';
import passport from 'passport';
import session from 'express-session';
import { apolloUploadExpress } from 'apollo-upload-server';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { schema } from './src/schema';
import { User, Category, Product, Order } from './src/models';
import { MONGO_URI } from './db';
import { userLoader, productLoader, categoryLoader } from './dataloaders';
import AuthService from './services/auth';

const MongoStore = connectMongo(session);

const run = () => {      
    const PORT = 4000;
    const app = express();
    const wsGqlURL = '/subscriptions';

    app.use(session({
      resave: true,
      saveUninitialized: true,
      secret: 'abcdefgh',
      store: new MongoStore({
        url: MONGO_URI,
        autoReconnect: true
      })
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    const corsOptions = {
      origin: 'http://localhost:3000',
      credentials: true
    };

    app.use('*', cors(corsOptions));

    app.use('/graphql',  
     apolloUploadExpress({   
          uploadDir: __dirname
      }),
      graphqlExpress(req => ({ 
        schema,
        context: {
            dataloaders: { 
              dataUserLoader: userLoader(User), 
              dataProductLoader: productLoader(Product),
              dataCategoryLoader: categoryLoader(Category) 
            },
            User,
            Category,
            Product,
            Order,
            AuthService,
            req
          },    
    })));

    app.use('/graphiql', graphiqlExpress({
      endpointURL: '/graphql',
      subscriptionsEndpoint: `ws://localhost:${PORT}${wsGqlURL}`
    }));

    const server = createServer(app);
    server.listen(PORT, () => {
      SubscriptionServer.create({
        execute,
        subscribe,
        schema
      },
      {
        server,
        path: wsGqlURL
      });
      console.log(`GraphQL Server is now running on http://localhost:${PORT}/graphiql`);
    });

    return server;
};

run();
