import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import md5 from 'md5';

import { store } from './store';
import { client } from './apolloClient';

// tslint:disable-next-line: variable-name
export const WriteRiteMark = () => (
  <span className="wr-mark-style">WriteRite</span>
);

export const emailToGravatarLink = (email: string) => {
  return `https://www.gravatar.com/avatar/${md5(email.toLowerCase())}`;
};

export const printApolloError = (error: Error) => {
  // tslint:disable-next-line: no-console
  console.error(`Error communicating with server: ${error.message}`);
};

// tslint:disable-next-line: variable-name
export const withProviders = (App: JSX.Element) => {
  return (
    <Provider store={store}>
      <ApolloProvider client={client}>
        <BrowserRouter>
          {App}
        </BrowserRouter>
      </ApolloProvider>
    </Provider>
  );
};
