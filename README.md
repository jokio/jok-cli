
# Jok CLI 
[![platform: jokio](https://img.shields.io/badge/platform-%F0%9F%83%8F%20jok-44cc11.svg)](https://github.com/jokio/jok-cli)
[![npm version](https://badge.fury.io/js/jok.svg)](https://badge.fury.io/js/jok)
[![codecov](https://codecov.io/gh/jokio/jok-cli/branch/master/graph/badge.svg)](https://codecov.io/gh/jokio/jok-cli) [![Greenkeeper badge](https://badges.greenkeeper.io/jokio/jok-cli.svg)](https://greenkeeper.io/)

Bundle of utility functions for code generation, related to nodejs and graphql

## API

### `init`
The easiest way to create new project on nodejs

Those features are out of the box in default template :

✅ Configured dev environement ([nodemon](https://github.com/remy/nodemon))

✅ Configured test environement ([jest](https://github.com/facebook/jest))

✅ Configured [EditorConfig](https://github.com/editorconfig/editorconfig)

✅ Configured CI/CD ([travis](http://travis-ci.org))

✅ Configured Linting ([TSLint](https://github.com/palantir/tslint))

✅ Last but not least: 100% type safety! ([TypeScript](https://github.com/Microsoft/TypeScript))


_Note: `jok init` command is next version of [create-jokio-app](https://github.com/jokio/create-jokio-app)_
<br/>
<br/>

### `graphql-client`
Generate sdk for graphql remote endpoint in front-end projects.

Features:

✅ Generates types (interfaces) based on remote graphql server

✅ Generates Queries, Mutations & Subscriptions api on top of [Apollo Client](https://github.com/apollographql/apollo-client)

<br/>
<br/>

## How to use
Recommended way to use `jok-cli` is to have [npx](https://github.com/zkat/npx) package installed globally on your computer and use following commands:

_Note: npx will take care to use latest version of `jok cli` every time you run the command, thats why its recommended way_

### init
```bash
npx jok init testapp # initialize empty pre-configured project

npx jok init testapp --graphql # initialize graphql project

npx jok init testapp --nextjs # initialize nextjs project
```

### graphql-client
for generating graphql client in front-end projects (Angular, React, etc.) `graphql-client` has dependencies on apollo client
```bash
npx jok graphql-client -e https://server.jok.io -o src/generated/jokio.ts # generate proxy client for remote url
```
```ts
import getClient, { Client } from './generated/jokio';
import { ApolloClient } from 'apollo-client';

const apolloClient: ApolloClient = /* TODO: Set apollo client */

const graphql = getClient(apolloClient, {
  query: {
    fetchPolicy: 'network-only'
  }
});


// example query call
graphql.query.me()
  .then(x => console.log(x))
  .catch(err => console.warn(err))

// example mutation call
graphql.mutation.login({ username: 'example@email.com',	password: 'Qwer!234' })
  .then(x => console.log(x))
  .catch(err => console.warn(err))

// example subscription call
graphql.subscription.musicChannelUpdated({}).subscribe(x => {
  console.log('musicChannelUpdated', x);
});

```
_Note: You will need to have [apollo client](https://github.com/apollographql/apollo-client) already configured in your project_

<br/>

## Alternative way to use
if you prefer using [yarn](https://github.com/yarnpkg/yarn), please install jok-cli globally first
```bash
yarn add global jok
```
and next you will be able to call `jok commands` directly:
```bash
jok init testapp # initialize empty pre-configured project

jok init testapp --graphql # initialize graphql project

jok init testapp --nextjs # initialize nextjs project
```

```bash
jok graphql-client -e https://server.jok.io -o src/generated/jokio.ts # generate proxy client for remote url
```
