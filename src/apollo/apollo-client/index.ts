import { ApolloClient, InMemoryCache } from '@apollo/client';

const Url = 'https://rickandmortyapi.com/graphql';

const client = new ApolloClient({
  uri: Url,
  cache: new InMemoryCache()
});

export default client;