const GRAPHQL_URL = "http://localhost:4000/graphql";
const WS_URL = "ws://localhost:4000/subscriptions";
import {
  ApolloProvider,
  ApolloClient,
  ApolloLink,
  HttpLink,
  split,
} from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { InMemoryCache } from "@apollo/client/cache";
import { WebSocketLink } from "@apollo/link-ws";

const wsUrl = "ws://localhost:4000/graphql";

const httpUrl = "http://localhost:4000/graphql";
if (!httpUrl) {
  throw new Error(
    "either url or httpUrl must be provided to make an apollo connection"
  );
}

const ssrMode = !process.browser;

const httpLink = new HttpLink({
  uri: httpUrl,
  credentials: "same-origin",
  fetch,
});
let link = httpLink;
if (!ssrMode && wsUrl) {
  const wsLink = new WebSocketLink({
    uri: wsUrl,
    options: {
      reconnect: true,
    },
    webSocketImpl: WebSocket,
  });
  link = split(
    ({ query }) => {
      const def = getMainDefinition(query);
      return (
        def.kind === "OperationDefinition" && def.operation === "subscription"
      );
    },
    wsLink,
    httpLink
  );
}

export default new ApolloClient({
  link,
  ssrMode,
  connectToDevTools: !ssrMode,
  cache: new InMemoryCache().restore({}),
});
