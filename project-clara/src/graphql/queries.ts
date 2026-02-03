/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getTeacher = /* GraphQL */ `query GetTeacher($id: ID!) {
  getTeacher(id: $id) {
    id
    name
    cognitoUserId
    schoolId
    school {
      id
      name
      address
      createdAt
      updatedAt
      __typename
    }
    classes {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetTeacherQueryVariables,
  APITypes.GetTeacherQuery
>;
export const listTeachers = /* GraphQL */ `query ListTeachers(
  $filter: ModelTeacherFilterInput
  $limit: Int
  $nextToken: String
) {
  listTeachers(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      cognitoUserId
      schoolId
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListTeachersQueryVariables,
  APITypes.ListTeachersQuery
>;
export const getClass = /* GraphQL */ `query GetClass($id: ID!) {
  getClass(id: $id) {
    id
    name
    teacherId
    schoolId
    teacher {
      id
      name
      cognitoUserId
      schoolId
      createdAt
      updatedAt
      __typename
    }
    school {
      id
      name
      address
      createdAt
      updatedAt
      __typename
    }
    enrollments {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.GetClassQueryVariables, APITypes.GetClassQuery>;
export const listClasses = /* GraphQL */ `query ListClasses(
  $filter: ModelClassFilterInput
  $limit: Int
  $nextToken: String
) {
  listClasses(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      teacherId
      schoolId
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListClassesQueryVariables,
  APITypes.ListClassesQuery
>;
export const getEnrollment = /* GraphQL */ `query GetEnrollment($id: ID!) {
  getEnrollment(id: $id) {
    id
    studentId
    classId
    currentGrade
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
    class {
      id
      name
      teacherId
      schoolId
      createdAt
      updatedAt
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetEnrollmentQueryVariables,
  APITypes.GetEnrollmentQuery
>;
export const listEnrollments = /* GraphQL */ `query ListEnrollments(
  $filter: ModelEnrollmentFilterInput
  $limit: Int
  $nextToken: String
) {
  listEnrollments(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      studentId
      classId
      currentGrade
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListEnrollmentsQueryVariables,
  APITypes.ListEnrollmentsQuery
>;
export const teachersByCognitoUserId = /* GraphQL */ `query TeachersByCognitoUserId(
  $cognitoUserId: String!
  $sortDirection: ModelSortDirection
  $filter: ModelTeacherFilterInput
  $limit: Int
  $nextToken: String
) {
  teachersByCognitoUserId(
    cognitoUserId: $cognitoUserId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      name
      cognitoUserId
      schoolId
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.TeachersByCognitoUserIdQueryVariables,
  APITypes.TeachersByCognitoUserIdQuery
>;
export const teachersBySchoolId = /* GraphQL */ `query TeachersBySchoolId(
  $schoolId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelTeacherFilterInput
  $limit: Int
  $nextToken: String
) {
  teachersBySchoolId(
    schoolId: $schoolId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      name
      cognitoUserId
      schoolId
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.TeachersBySchoolIdQueryVariables,
  APITypes.TeachersBySchoolIdQuery
>;
export const classesByTeacherId = /* GraphQL */ `query ClassesByTeacherId(
  $teacherId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelClassFilterInput
  $limit: Int
  $nextToken: String
) {
  classesByTeacherId(
    teacherId: $teacherId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      name
      teacherId
      schoolId
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ClassesByTeacherIdQueryVariables,
  APITypes.ClassesByTeacherIdQuery
>;
export const classesBySchoolId = /* GraphQL */ `query ClassesBySchoolId(
  $schoolId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelClassFilterInput
  $limit: Int
  $nextToken: String
) {
  classesBySchoolId(
    schoolId: $schoolId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      name
      teacherId
      schoolId
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ClassesBySchoolIdQueryVariables,
  APITypes.ClassesBySchoolIdQuery
>;
export const enrollmentsByStudentId = /* GraphQL */ `query EnrollmentsByStudentId(
  $studentId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelEnrollmentFilterInput
  $limit: Int
  $nextToken: String
) {
  enrollmentsByStudentId(
    studentId: $studentId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      studentId
      classId
      currentGrade
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.EnrollmentsByStudentIdQueryVariables,
  APITypes.EnrollmentsByStudentIdQuery
>;
export const enrollmentsByClassId = /* GraphQL */ `query EnrollmentsByClassId(
  $classId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelEnrollmentFilterInput
  $limit: Int
  $nextToken: String
) {
  enrollmentsByClassId(
    classId: $classId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      studentId
      classId
      currentGrade
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.EnrollmentsByClassIdQueryVariables,
  APITypes.EnrollmentsByClassIdQuery
>;
export const getSchool = /* GraphQL */ `query GetSchool($id: ID!) {
  getSchool(id: $id) {
    id
    name
    address
    students {
      nextToken
      __typename
    }
    teachers {
      nextToken
      __typename
    }
    classes {
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
    enrollments {
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
