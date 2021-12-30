/* eslint-disable */

import { Zeus, GraphQLTypes, InputType, ValueTypes, $ } from './index';
import { gql, useMutation, useQuery, useLazyQuery, useSubscription, QueryOptions, MutationOptions } from '@apollo/client';
import type { MutationHookOptions, QueryHookOptions, LazyQueryHookOptions, SubscriptionHookOptions } from '@apollo/client';
import { initializeApollo } from 'utils/apollo';

export { $ as $ }

const client = initializeApollo(undefined, undefined)

export function useTypedMutation<Z>(
  mutation: Z | ValueTypes['mutation_root'],
  options?: MutationHookOptions<InputType<GraphQLTypes['mutation_root'], Z>>,
) {
  return useMutation<InputType<GraphQLTypes['mutation_root'], Z>>(gql(Zeus.mutation(mutation)), options);
}
export function useTypedQuery<Z>(
  query: Z | ValueTypes['query_root'],
  options?: QueryHookOptions<InputType<GraphQLTypes['query_root'], Z>>,
) {
  return useQuery<InputType<GraphQLTypes['query_root'], Z>>(gql(Zeus.query(query)), options);
}
export function useTypedLazyQuery<Z>(
  LazyQuery: Z | ValueTypes['query_root'],
  options?: LazyQueryHookOptions<InputType<GraphQLTypes['query_root'], Z>>,
) {
  return useLazyQuery<InputType<GraphQLTypes['query_root'], Z>>(gql(Zeus.query(LazyQuery)), options);
}
export function useTypedSubscription<Z>(
  subscription: Z | ValueTypes['subscription_root'],
  options?: SubscriptionHookOptions<InputType<GraphQLTypes['subscription_root'], Z>>,
) {
  return useSubscription<InputType<GraphQLTypes['subscription_root'], Z>>(gql(Zeus.subscription(subscription)), options);
}

export function useTypedClientMutation<Q extends ValueTypes["mutation_root"]>(
  mutation: Q,
  variables?: any,
  options?: MutationOptions<InputType<GraphQLTypes['mutation_root'], Q>, Record<string, any>>
) {
  return client.mutate<InputType<GraphQLTypes['mutation_root'], Q>>({
    mutation: gql(Zeus.mutation(mutation)),
    variables:{
      ...variables
    },
    ...options,
  });
}

export function useTypedClientQuery<Q extends ValueTypes["query_root"]>(
  query: Q,
  variables?: any,
  options?: QueryOptions<InputType<GraphQLTypes['query_root'], Q>, Record<string, any>>
) {
  return client.query<InputType<GraphQLTypes['query_root'], Q>>({
    query: gql(Zeus.query(query)),
    variables:{
      ...variables
    },
    fetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,
    ...options,
  });
}