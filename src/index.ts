import {createServer} from 'http';
import { ApolloServer, PubSub } from 'apollo-server-express'
import * as express from 'express'
import { ISchemaContext, schema } from './schema'
import {interval} from 'rxjs'
import { map } from 'rxjs/operators'
import { IBook } from './IBook'

const pubSub = new PubSub()

interval(1500).pipe(
	map(i => <IBook>{
		author: `Author ${i}`,
		title: `Title ${i}`,
		releaseYear: 1978 + i,
	})
).subscribe(book => pubSub.publish("BOOK_ADDED", {bookAdded: book}))

const app = express()

const books: IBook[] = [
	{
	  title: 'Harry Potter and the Chamber of Secrets',
	  author: 'J.K. Rowling',
	  releaseYear: 1927,
	},
	{
	  title: 'Jurassic Park',
	  author: 'Michael Crichton',
	  releaseYear: 1993,
	},
  ];

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ schema,
	context: async (req) => <ISchemaContext>{
		books,
		getBookStream: () => pubSub.asyncIterator(["BOOK_ADDED"])
	},
	subscriptions: {
		onConnect: (params, webSocket) => {
			console.log(`Connection client connected, ${webSocket ? "with" : "without"} webSocket`)
		}
	}
});

server.applyMiddleware({app})
// Not quite sure why we had to switch to using createServer here, perhaps because the subscription logic is handled outside express?
const httpServer = createServer(app);
server.installSubscriptionHandlers(httpServer);

const port = 4000

// The `listen` method launches a web server.
httpServer.listen(port, () => {
  console.log(`🚀  Server ready at http://localhost:${port}${server.graphqlPath}`);
  console.log(`🚀  Subscriptions ready at ws://localhost:${port}${server.subscriptionsPath}`);
});