import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLSchema, GraphQLInt, GraphQLBoolean } from "graphql"
import { TypedFieldConfigMap } from "./ITypedFieldConfigMap"
import { IBook } from "./IBook"
import { withFilter } from "apollo-server-express"

const bookType = new GraphQLObjectType({
	name: "Book",
	fields: <TypedFieldConfigMap<IBook>>{
		author: {type: GraphQLString},
		title: {type: GraphQLString},
		releaseYear: {type: GraphQLInt},
	}
})

export interface ISchemaContext {
	getBookStream(): AsyncIterator<{bookAdded: IBook}>
	books: IBook[]
}

const queryType = new GraphQLObjectType({
	name: "Query",
	fields: {
		books: {
			type: new GraphQLList(bookType),
			resolve: (_1, _2, context: ISchemaContext) => context.books
		}
	}
})

const subscriptionType = new GraphQLObjectType({
	name: "Subscription",
	fields: {
		bookAdded: {
			args: {
				onlyEven: {
					type: GraphQLBoolean,
				}
			},
			type: bookType,
			subscribe: withFilter(
				(_1, _2, context: ISchemaContext) => context.getBookStream(),
				({bookAdded}: {bookAdded: IBook}, {onlyEven}) => (bookAdded.releaseYear % (onlyEven ? 2 : 1)) === 0)
		} 
	}
})

export const schema = new GraphQLSchema({
	query: queryType,
	subscription: subscriptionType
})
