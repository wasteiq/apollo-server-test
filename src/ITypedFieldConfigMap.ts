import { GraphQLFieldConfig } from "graphql";

export type TypedFieldConfigMap<T, TContext = any, S = T> = {
	[P in keyof T]: GraphQLFieldConfig<S, TContext>
}
