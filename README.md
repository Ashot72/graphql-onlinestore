This is a GraphQL Online Store implementation. It is not an end to end solution. With this functionality, you can create a real GraphQL application; both the server and client.

To get started.
```
       Clone the repository
   
       git clone https://github.com/Ashot72/graphql-onlinestore.git
       cd onlinestore
       cd server && npm install OR yarn install
       cd ../client && npm install OR yarn install
       
       Run server and client, each in a separate terminal:

       cd server
       npm start OR yarn start

       In another terminal:

       cd client
       npm start OR yarn start
```     
Navigate to localhost:3000 to explore the current state of the online store. The server is running on localhost:4000. You can navigate to localhost:4000/graphiql which will load a graphical _/ˈɡrafək(ə)l/,_ 
interactive in-browser GraphQL IDE. With graphical you can test write, validate and test GraphQL queries_

Server

- _Express_, a web framework for Node.js (Node.js 8.0 ++ as async/await is used).

- _graphql-server-express_ - the Express and Connect integration of GraphQL Server.

- _MongoDB_ - an open source, document-oriented database.

- Mongoose, MongoDB ODM/ORM, - straight-forward, schema-based solution to model our application.

Client

- _apollo\_client_ - a fully-features, production ready caching GraphQL client.

- _react\_apollo -_ React component for Apollo client.

-  _apollo\_upload\_client -_ file upload via GraphQL mutations.

-  _react\_bootstrap -_ bootstrap framework rebuilt for React.

Go to [Online Store description]( https://ashot72.github.io/graphql-onlinestore/) page

