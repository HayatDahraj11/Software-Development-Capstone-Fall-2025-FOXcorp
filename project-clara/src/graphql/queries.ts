/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getSchool = /* GraphQL */ `query GetSchool($id: ID!) {
  getSchool(id: $id) {
    id
    name
    address
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.GetSchoolQueryVariables, APITypes.GetSchoolQuery>;
export const listSchools = /* GraphQL */ `query ListSchools(
  $filter: ModelSchoolFilterInput
  $limit: Int
  $nextToken: String
) {
  listSchools(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      address
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListSchoolsQueryVariables,
  APITypes.ListSchoolsQuery
>;
