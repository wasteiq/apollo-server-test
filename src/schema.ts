import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLSchema } from "graphql"
import { TypedFieldConfigMap } from "./ITypedFieldConfigMap"
import { IBook } from "./IBook"

const bookType = new GraphQLObjectType({
	name: "Book",
	fields: <TypedFieldConfigMap<IBook>>{
		author: {type: GraphQLString},
		title: {type: GraphQLString},
	}
})

export interface ISchemaContext {
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

export const schema = new GraphQLSchema({
	query: queryType,
})
