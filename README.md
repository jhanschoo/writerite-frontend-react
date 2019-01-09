# frontend-react

This project contains the source for building a frontend to the
WriteRite service.

## State stores

* Transient state is managed in the respective components.
* Per-session state is managed in Redux.
* State persisting across sessions should be managed in Apollo Cache

## Setting up development

1. `git clone` this repository
2. Ensure that the following envvars are set (`.env` files are supported)
   * `REACT_APP_GOOGLE_OAUTH2_CLIENT_ID` Client ID to the OAuth2 service of a GCS project.
   * `REACT_APP_FB_APP_ID` ID of a FB app.
   * `REACT_APP_GRAPHQL_HTTP` HTTP GraphQL endpoint of the backend.
   * `REACT_APP_GRAPHQL_WS` WebSocket GraphQL endpoint of the backend.
3. The following dev server options may also be set
   * `HTTPS_CERT_FILE` and `HTTPS_KEY_FILE` for paths to the respective files to use a specific certificate and key under https. The implementation (and hence file format) is by the `webpack-dev-server`.
4. The project was generated by `create-react-app` with `react-scripts` replaced by `rescripts`. Hence refer to them for further customization.
5. `npm run start:dev` to launch the development server.

## Setting up production

The app is hosted by Netlify. Netlify's zero-config deployment for create-react-app should do the job. You may need to change the constants in `.env.production`.

## TODO

* Handle unexpected `null` GQL responses as errors requiring a `resetCache`.