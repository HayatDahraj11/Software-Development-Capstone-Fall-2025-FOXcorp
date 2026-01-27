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
    students {
      nextToken
      __typename
    }
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
export const getParent = /* GraphQL */ `query GetParent($id: ID!) {
  getParent(id: $id) {
    id
    cognitoUserId
    firstName
    lastName
    phoneNumber
    canEditRecords
    students {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    owner
    __typename
  }
}
` as GeneratedQuery<APITypes.GetParentQueryVariables, APITypes.GetParentQuery>;
export const listParents = /* GraphQL */ `query ListParents(
  $filter: ModelParentFilterInput
  $limit: Int
  $nextToken: String
) {
  listParents(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      cognitoUserId
      firstName
      lastName
      phoneNumber
      canEditRecords
      createdAt
      updatedAt
      owner
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListParentsQueryVariables,
  APITypes.ListParentsQuery
>;
export const parentsByCognitoUserId = /* GraphQL */ `query ParentsByCognitoUserId(
  $cognitoUserId: String!
  $sortDirection: ModelSortDirection
  $filter: ModelParentFilterInput
  $limit: Int
  $nextToken: String
) {
  parentsByCognitoUserId(
    cognitoUserId: $cognitoUserId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      cognitoUserId
      firstName
      lastName
      phoneNumber
      canEditRecords
      createdAt
      updatedAt
      owner
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ParentsByCognitoUserIdQueryVariables,
  APITypes.ParentsByCognitoUserIdQuery
>;
export const getStudent = /* GraphQL */ `query GetStudent($id: ID!) {
  getStudent(id: $id) {
    id
    firstName
    lastName
    dateOfBirth
    gradeLevel
    attendanceRate
    currentStatus
    school {
      id
      name
      address
      createdAt
      updatedAt
      __typename
    }
    parents {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    schoolStudentsId
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetStudentQueryVariables,
  APITypes.GetStudentQuery
>;
export const listStudents = /* GraphQL */ `query ListStudents(
  $filter: ModelStudentFilterInput
  $limit: Int
  $nextToken: String
) {
  listStudents(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      firstName
      lastName
      dateOfBirth
      gradeLevel
      attendanceRate
      currentStatus
      createdAt
      updatedAt
      schoolStudentsId
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListStudentsQueryVariables,
  APITypes.ListStudentsQuery
>;
export const getParentStudents = /* GraphQL */ `query GetParentStudents($id: ID!) {
  getParentStudents(id: $id) {
    id
    parentId
    studentId
    parent {
      id
      cognitoUserId
      firstName
      lastName
      phoneNumber
      canEditRecords
      createdAt
      updatedAt
      owner
      __typename
    }
    student {
      id
      firstName
      lastName
      dateOfBirth
      gradeLevel
      attendanceRate
      currentStatus
      createdAt
      updatedAt
      schoolStudentsId
      __typename
    }
    createdAt
    updatedAt
    owner
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetParentStudentsQueryVariables,
  APITypes.GetParentStudentsQuery
>;
export const listParentStudents = /* GraphQL */ `query ListParentStudents(
  $filter: ModelParentStudentsFilterInput
  $limit: Int
  $nextToken: String
) {
  listParentStudents(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      parentId
      studentId
      createdAt
      updatedAt
      owner
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListParentStudentsQueryVariables,
  APITypes.ListParentStudentsQuery
>;
export const parentStudentsByParentId = /* GraphQL */ `query ParentStudentsByParentId(
  $parentId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelParentStudentsFilterInput
  $limit: Int
  $nextToken: String
) {
  parentStudentsByParentId(
    parentId: $parentId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      parentId
      studentId
      createdAt
      updatedAt
      owner
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ParentStudentsByParentIdQueryVariables,
  APITypes.ParentStudentsByParentIdQuery
>;
export const parentStudentsByStudentId = /* GraphQL */ `query ParentStudentsByStudentId(
  $studentId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelParentStudentsFilterInput
  $limit: Int
  $nextToken: String
) {
  parentStudentsByStudentId(
    studentId: $studentId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      parentId
      studentId
      createdAt
      updatedAt
      owner
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ParentStudentsByStudentIdQueryVariables,
  APITypes.ParentStudentsByStudentIdQuery
>;
