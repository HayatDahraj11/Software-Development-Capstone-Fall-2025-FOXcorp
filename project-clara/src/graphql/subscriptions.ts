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
    students {
      nextToken
      __typename
    }
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
    students {
      nextToken
      __typename
    }
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
    students {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteSchoolSubscriptionVariables,
  APITypes.OnDeleteSchoolSubscription
>;
export const onCreateParent = /* GraphQL */ `subscription OnCreateParent(
  $filter: ModelSubscriptionParentFilterInput
  $owner: String
) {
  onCreateParent(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreateParentSubscriptionVariables,
  APITypes.OnCreateParentSubscription
>;
export const onUpdateParent = /* GraphQL */ `subscription OnUpdateParent(
  $filter: ModelSubscriptionParentFilterInput
  $owner: String
) {
  onUpdateParent(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateParentSubscriptionVariables,
  APITypes.OnUpdateParentSubscription
>;
export const onDeleteParent = /* GraphQL */ `subscription OnDeleteParent(
  $filter: ModelSubscriptionParentFilterInput
  $owner: String
) {
  onDeleteParent(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteParentSubscriptionVariables,
  APITypes.OnDeleteParentSubscription
>;
export const onCreateStudent = /* GraphQL */ `subscription OnCreateStudent($filter: ModelSubscriptionStudentFilterInput) {
  onCreateStudent(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateStudentSubscriptionVariables,
  APITypes.OnCreateStudentSubscription
>;
export const onUpdateStudent = /* GraphQL */ `subscription OnUpdateStudent($filter: ModelSubscriptionStudentFilterInput) {
  onUpdateStudent(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateStudentSubscriptionVariables,
  APITypes.OnUpdateStudentSubscription
>;
export const onDeleteStudent = /* GraphQL */ `subscription OnDeleteStudent($filter: ModelSubscriptionStudentFilterInput) {
  onDeleteStudent(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteStudentSubscriptionVariables,
  APITypes.OnDeleteStudentSubscription
>;
export const onCreateParentStudents = /* GraphQL */ `subscription OnCreateParentStudents(
  $filter: ModelSubscriptionParentStudentsFilterInput
  $owner: String
) {
  onCreateParentStudents(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreateParentStudentsSubscriptionVariables,
  APITypes.OnCreateParentStudentsSubscription
>;
export const onUpdateParentStudents = /* GraphQL */ `subscription OnUpdateParentStudents(
  $filter: ModelSubscriptionParentStudentsFilterInput
  $owner: String
) {
  onUpdateParentStudents(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateParentStudentsSubscriptionVariables,
  APITypes.OnUpdateParentStudentsSubscription
>;
export const onDeleteParentStudents = /* GraphQL */ `subscription OnDeleteParentStudents(
  $filter: ModelSubscriptionParentStudentsFilterInput
  $owner: String
) {
  onDeleteParentStudents(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteParentStudentsSubscriptionVariables,
  APITypes.OnDeleteParentStudentsSubscription
>;
