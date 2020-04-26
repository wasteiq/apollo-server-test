import { ApolloServer, gql } from 'apollo-server-express'
import * as express from 'express'
import {GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList} from 'graphql'
import { TypedFieldConfigMap } from './ITypedFieldConfigMap'
import { IBook } from './IBook'

const app = express()


const bookType = new GraphQLObjectType({
	name: "Book",
	fields: <TypedFieldConfigMap<IBook>>{
		author: {type: GraphQLString},
		title: {type: GraphQLString},
	}
})

const queryType = new GraphQLObjectType({
	name: "Query",
	fields: {
		books: {
			type: new GraphQLList(bookType),
			// external resolver
		}
	}
})

const schema = new GraphQLSchema({
	query: queryType,
})

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

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
	Query: {
	  books: () => books,
	},
  };

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ schema, resolvers });

server.applyMiddleware({app})


const port = 4000

// The `listen` method launches a web server.
app.listen({port}, () => {
  console.log(`🚀  Server ready at http://localhost:${port}${server.graphqlPath}`);
});