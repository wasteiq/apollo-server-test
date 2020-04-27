import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLSchema, GraphQLIncludeDirective, GraphQLInt } from "graphql"
import { TypedFieldConfigMap } from "./ITypedFieldConfigMap"
import { IBook } from "./IBook"

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
			type: bookType,
			subscribe: (_1, _2, context: ISchemaContext) => context.getBookStream()
		} 
	}

})

export const schema = new GraphQLSchema({
	query: queryType,
	subscription: subscriptionType
})
