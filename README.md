
# Jok CLI 
[![engine: jokio](https://img.shields.io/badge/engine-%F0%9F%83%8F%20jok-44cc11.svg)](https://github.com/jokio/jok-cli)


Bundle of utility functions for code generation, related to nodejs and graphql

## API

### `init`
The easiest way to create new project on nodejs

Those features are out of the box in default template :

* Configured dev environement ([nodemon](https://github.com/remy/nodemon))
* Configured test environement ([jest](https://github.com/facebook/jest))
* Configured [EditorConfig](https://github.com/editorconfig/editorconfig)
* Configured CI/CD ([travis](http://travis-ci.org))
* Configured Linting ([TSLint](https://github.com/palantir/tslint))
* Last but not least: 100% type safety! ([TypeScript](https://github.com/Microsoft/TypeScript))



### `graphql-client`
Generate sdk for graphql remote endpoint.

Features:
* Generates types (interfaces) based on remote graphql server
* Generates Queries, Mutations & Subscriptions api on top of [Apollo Client](https://github.com/apollographql/apollo-client)
