const express = require('express'); 
const http = require("http");
const { schema } = require('./schema'); 
const mongoose = require("mongoose");
const { ApolloServer } = require("apollo-server-express");
require('dotenv').config();


// const { graphqlExpress, graphiqlExpress } = require("graphql-server-express");
// const { SubscriptionServer } = require("subscriptions-transport-ws");
// const { execute, subscribe } = require("graphql"); 



// DB Setup
const mongoUri = process.env.MONGODB_URL || "mongodb://localhost/doub";

mongoose.Promise = require('bluebird');
mongoose.connect(mongoUri, function(err) {
  if(err) {
    console.log("connection error", err +" on "+mongoUri);
  } else {
    console.log("connection to "+mongoUri+" successful")
  }
});





const PORT = 4000;
const app = express();
const server = new ApolloServer(schema);

server.applyMiddleware({ app });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);
// ⚠️ Pay attention to the fact that we are calling `listen` on the http server variable, and not on `app`.
httpServer.listen(PORT, () => {
  console.log(
    `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
  );
  console.log(
    `🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`
  );
});