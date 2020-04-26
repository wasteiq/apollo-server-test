import { ApolloServer } from 'apollo-server-express'
import * as express from 'express'
import { ISchemaContext, schema } from './schema'

const app = express()

const books = [
	{
	  title: 'Harry Potter and the Chamber of Secrets',
	  author: 'J.K. Rowling',
	},
	{
	  title: 'Jurassic Park',
	  author: 'Michael Crichton',
	},
  ];

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ schema, context: async (req) => (<ISchemaContext>{
	books,
})});

server.applyMiddleware({app})

const port = 4000

// The `listen` method launches a web server.
app.listen({port}, () => {
  console.log(`🚀  Server ready at http://localhost:${port}${server.graphqlPath}`);
});