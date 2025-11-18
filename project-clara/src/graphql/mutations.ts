/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createSchool = /* GraphQL */ `mutation CreateSchool(
  $input: CreateSchoolInput!
  $condition: ModelSchoolConditionInput
) {
  createSchool(input: $input, condition: $condition) {
    id
    name
    address
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateSchoolMutationVariables,
  APITypes.CreateSchoolMutation
>;
export const updateSchool = /* GraphQL */ `mutation UpdateSchool(
  $input: UpdateSchoolInput!
  $condition: ModelSchoolConditionInput
) {
  updateSchool(input: $input, condition: $condition) {
    id
    name
    address
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateSchoolMutationVariables,
  APITypes.UpdateSchoolMutation
>;
export const deleteSchool = /* GraphQL */ `mutation DeleteSchool(
  $input: DeleteSchoolInput!
  $condition: ModelSchoolConditionInput
) {
  deleteSchool(input: $input, condition: $condition) {
    id
    name
    address
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteSchoolMutationVariables,
  APITypes.DeleteSchoolMutation
>;
