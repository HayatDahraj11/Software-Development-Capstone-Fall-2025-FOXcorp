/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateSchool = /* GraphQL */ `subscription OnCreateSchool($filter: ModelSubscriptionSchoolFilterInput) {
  onCreateSchool(filter: $filter) {
    id
    name
    address
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateSchoolSubscriptionVariables,
  APITypes.OnCreateSchoolSubscription
>;
export const onUpdateSchool = /* GraphQL */ `subscription OnUpdateSchool($filter: ModelSubscriptionSchoolFilterInput) {
  onUpdateSchool(filter: $filter) {
    id
    name
    address
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateSchoolSubscriptionVariables,
  APITypes.OnUpdateSchoolSubscription
>;
export const onDeleteSchool = /* GraphQL */ `subscription OnDeleteSchool($filter: ModelSubscriptionSchoolFilterInput) {
  onDeleteSchool(filter: $filter) {
    id
    name
    address
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteSchoolSubscriptionVariables,
  APITypes.OnDeleteSchoolSubscription
>;
