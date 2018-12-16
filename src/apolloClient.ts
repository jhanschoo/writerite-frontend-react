import { ApolloClient } from 'apollo-client';
import { createUploadLink } from 'apollo-upload-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { createPersistedQueryLink } from 'apollo-link-persisted-queries';
import { WebSocketLink } from 'apollo-link-ws';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import { OperationDefinitionNode } from 'graphql';
import { withClientState } from 'apollo-link-state';

// c.f. https://github.com/Akryum/vue-cli-plugin-apollo/blob/master/graphql-client/src/index.js

const getAuth = () => {
  const token = window && window.localStorage.getItem('apollo-token');
  return token ? `Bearer ${token}` : '';
};

const cache = new InMemoryCache();

const httpLink = createUploadLink({
  uri: process.env.REACT_APP_GRAPHQL_HTTP,
  credentials: 'same-origin',
});

let link = httpLink;

const authLink = setContext((_, { headers }) => {
  const authorization = getAuth();
  const authorizationHeader = authorization ? { authorization } : {};
  return {
    headers: {
      ...headers,
      ...authorizationHeader,
    },
  };
});

link = authLink.concat(link);

// to disable if SSR

// recover injected state

// @ts-ignore
const state = window.__APOLLO_STATE__;

if (state) {
  cache.restore(state.defaultClient);
}

// persistence

link = createPersistedQueryLink().concat(link);

// ws

if (!process.env.REACT_APP_GRAPHQL_WS) {
  throw new Error('REACT_APP_GRAPHQL_WS envvar is missing');
}

const wsClient = new SubscriptionClient(
  process.env.REACT_APP_GRAPHQL_WS, {
    reconnect: true,
    connectionParams: () => {
      const authorization = getAuth();
      return authorization ? { authorization } : {};
    },
  },
);

const wsLink = new WebSocketLink(wsClient);

link = split(({ query }) => {
  const { kind, operation } = getMainDefinition(query) as OperationDefinitionNode;
  return kind === 'OperationDefinition' &&
    operation === 'subscription';
}, wsLink, link);

const stateLink = withClientState({
  cache,
  resolvers: {},
});

// end to disable if SSR

const client = new ApolloClient({
  link,
  cache,
  ssrForceFetchDelay: 100,
  connectToDevTools: process.env.NODE_ENV !== 'production',
});

client.onResetStore(() => Promise.resolve(stateLink.writeDefaults()));

export { client, wsClient };
