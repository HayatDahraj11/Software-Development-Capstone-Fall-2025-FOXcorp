/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateStudentInput = {
  id?: string | null,
  firstName: string,
  lastName: string,
  dateOfBirth?: string | null,
  gradeLevel?: number | null,
  attendanceRate?: number | null,
  currentStatus?: string | null,
  schoolStudentsId?: string | null,
};

export type ModelStudentConditionInput = {
  firstName?: ModelStringInput | null,
  lastName?: ModelStringInput | null,
  dateOfBirth?: ModelStringInput | null,
  gradeLevel?: ModelIntInput | null,
  attendanceRate?: ModelFloatInput | null,
  currentStatus?: ModelStringInput | null,
  and?: Array< ModelStudentConditionInput | null > | null,
  or?: Array< ModelStudentConditionInput | null > | null,
  not?: ModelStudentConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  schoolStudentsId?: ModelIDInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type ModelIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type ModelFloatInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type Student = {
  __typename: "Student",
  id: string,
  firstName: string,
  lastName: string,
  dateOfBirth?: string | null,
  gradeLevel?: number | null,
  attendanceRate?: number | null,
  currentStatus?: string | null,
  school?: School | null,
  parents?: ModelParentStudentsConnection | null,
  enrollments?: ModelEnrollmentConnection | null,
  createdAt: string,
  updatedAt: string,
  schoolStudentsId?: string | null,
};

export type School = {
  __typename: "School",
  id: string,
  name: string,
  address?: string | null,
  students?: ModelStudentConnection | null,
  teachers?: ModelTeacherConnection | null,
  classes?: ModelClassConnection | null,
  createdAt: string,
  updatedAt: string,
};

export type ModelStudentConnection = {
  __typename: "ModelStudentConnection",
  items:  Array<Student | null >,
  nextToken?: string | null,
};

export type ModelTeacherConnection = {
  __typename: "ModelTeacherConnection",
  items:  Array<Teacher | null >,
  nextToken?: string | null,
};

export type Teacher = {
  __typename: "Teacher",
  id: string,
  name: string,
  cognitoUserId?: string | null,
  schoolId: string,
  school?: School | null,
  classes?: ModelClassConnection | null,
  createdAt: string,
  updatedAt: string,
};

export type ModelClassConnection = {
  __typename: "ModelClassConnection",
  items:  Array<Class | null >,
  nextToken?: string | null,
};

export type Class = {
  __typename: "Class",
  id: string,
  name: string,
  teacherId: string,
  schoolId: string,
  teacher?: Teacher | null,
  school?: School | null,
  enrollments?: ModelEnrollmentConnection | null,
  createdAt: string,
  updatedAt: string,
};

export type ModelEnrollmentConnection = {
  __typename: "ModelEnrollmentConnection",
  items:  Array<Enrollment | null >,
  nextToken?: string | null,
};

export type Enrollment = {
  __typename: "Enrollment",
  id: string,
  studentId: string,
  classId: string,
  currentGrade?: number | null,
  student?: Student | null,
  class?: Class | null,
  createdAt: string,
  updatedAt: string,
};

export type ModelParentStudentsConnection = {
  __typename: "ModelParentStudentsConnection",
  items:  Array<ParentStudents | null >,
  nextToken?: string | null,
};

export type ParentStudents = {
  __typename: "ParentStudents",
  id: string,
  parentId: string,
  studentId: string,
  parent: Parent,
  student: Student,
  createdAt: string,
  updatedAt: string,
  owner?: string | null,
};

export type Parent = {
  __typename: "Parent",
  id: string,
  cognitoUserId?: string | null,
  firstName: string,
  lastName: string,
  phoneNumber?: string | null,
  canEditRecords?: boolean | null,
  students?: ModelParentStudentsConnection | null,
  createdAt: string,
  updatedAt: string,
  owner?: string | null,
};

export type DeleteStudentInput = {
  id: string,
};

export type CreateTeacherInput = {
  id?: string | null,
  name: string,
  cognitoUserId?: string | null,
  schoolId: string,
};

export type ModelTeacherConditionInput = {
  name?: ModelStringInput | null,
  cognitoUserId?: ModelStringInput | null,
  schoolId?: ModelIDInput | null,
  and?: Array< ModelTeacherConditionInput | null > | null,
  or?: Array< ModelTeacherConditionInput | null > | null,
  not?: ModelTeacherConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type UpdateTeacherInput = {
  id: string,
  name?: string | null,
  cognitoUserId?: string | null,
  schoolId?: string | null,
};

export type DeleteTeacherInput = {
  id: string,
};

export type CreateClassInput = {
  id?: string | null,
  name: string,
  teacherId: string,
  schoolId: string,
};

export type ModelClassConditionInput = {
  name?: ModelStringInput | null,
  teacherId?: ModelIDInput | null,
  schoolId?: ModelIDInput | null,
  and?: Array< ModelClassConditionInput | null > | null,
  or?: Array< ModelClassConditionInput | null > | null,
  not?: ModelClassConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type UpdateClassInput = {
  id: string,
  name?: string | null,
  teacherId?: string | null,
  schoolId?: string | null,
};

export type DeleteClassInput = {
  id: string,
};

export type CreateEnrollmentInput = {
  id?: string | null,
  studentId: string,
  classId: string,
  currentGrade?: number | null,
};

export type ModelEnrollmentConditionInput = {
  studentId?: ModelIDInput | null,
  classId?: ModelIDInput | null,
  currentGrade?: ModelFloatInput | null,
  and?: Array< ModelEnrollmentConditionInput | null > | null,
  or?: Array< ModelEnrollmentConditionInput | null > | null,
  not?: ModelEnrollmentConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type UpdateEnrollmentInput = {
  id: string,
  studentId?: string | null,
  classId?: string | null,
  currentGrade?: number | null,
};

export type DeleteEnrollmentInput = {
  id: string,
};

export type CreateSchoolInput = {
  id?: string | null,
  name: string,
  address?: string | null,
};

export type ModelSchoolConditionInput = {
  name?: ModelStringInput | null,
  address?: ModelStringInput | null,
  and?: Array< ModelSchoolConditionInput | null > | null,
  or?: Array< ModelSchoolConditionInput | null > | null,
  not?: ModelSchoolConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type UpdateSchoolInput = {
  id: string,
  name?: string | null,
  address?: string | null,
};

export type DeleteSchoolInput = {
  id: string,
};

export type CreateParentInput = {
  id?: string | null,
  cognitoUserId?: string | null,
  firstName: string,
  lastName: string,
  phoneNumber?: string | null,
  canEditRecords?: boolean | null,
};

export type ModelParentConditionInput = {
  cognitoUserId?: ModelStringInput | null,
  firstName?: ModelStringInput | null,
  lastName?: ModelStringInput | null,
  phoneNumber?: ModelStringInput | null,
  canEditRecords?: ModelBooleanInput | null,
  and?: Array< ModelParentConditionInput | null > | null,
  or?: Array< ModelParentConditionInput | null > | null,
  not?: ModelParentConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  owner?: ModelStringInput | null,
};

export type ModelBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type UpdateParentInput = {
  id: string,
  cognitoUserId?: string | null,
  firstName?: string | null,
  lastName?: string | null,
  phoneNumber?: string | null,
  canEditRecords?: boolean | null,
};

export type DeleteParentInput = {
  id: string,
};

export type UpdateStudentInput = {
  id: string,
  firstName?: string | null,
  lastName?: string | null,
  dateOfBirth?: string | null,
  gradeLevel?: number | null,
  attendanceRate?: number | null,
  currentStatus?: string | null,
  schoolStudentsId?: string | null,
};

export type CreateParentStudentsInput = {
  id?: string | null,
  parentId: string,
  studentId: string,
};

export type ModelParentStudentsConditionInput = {
  parentId?: ModelIDInput | null,
  studentId?: ModelIDInput | null,
  and?: Array< ModelParentStudentsConditionInput | null > | null,
  or?: Array< ModelParentStudentsConditionInput | null > | null,
  not?: ModelParentStudentsConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  owner?: ModelStringInput | null,
};

export type UpdateParentStudentsInput = {
  id: string,
  parentId?: string | null,
  studentId?: string | null,
};

export type DeleteParentStudentsInput = {
  id: string,
};

export type ModelTeacherFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  cognitoUserId?: ModelStringInput | null,
  schoolId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelTeacherFilterInput | null > | null,
  or?: Array< ModelTeacherFilterInput | null > | null,
  not?: ModelTeacherFilterInput | null,
};

export type ModelClassFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  teacherId?: ModelIDInput | null,
  schoolId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelClassFilterInput | null > | null,
  or?: Array< ModelClassFilterInput | null > | null,
  not?: ModelClassFilterInput | null,
};

export type ModelEnrollmentFilterInput = {
  id?: ModelIDInput | null,
  studentId?: ModelIDInput | null,
  classId?: ModelIDInput | null,
  currentGrade?: ModelFloatInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelEnrollmentFilterInput | null > | null,
  or?: Array< ModelEnrollmentFilterInput | null > | null,
  not?: ModelEnrollmentFilterInput | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type ModelSchoolFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  address?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelSchoolFilterInput | null > | null,
  or?: Array< ModelSchoolFilterInput | null > | null,
  not?: ModelSchoolFilterInput | null,
};

export type ModelSchoolConnection = {
  __typename: "ModelSchoolConnection",
  items:  Array<School | null >,
  nextToken?: string | null,
};

export type ModelParentFilterInput = {
  id?: ModelIDInput | null,
  cognitoUserId?: ModelStringInput | null,
  firstName?: ModelStringInput | null,
  lastName?: ModelStringInput | null,
  phoneNumber?: ModelStringInput | null,
  canEditRecords?: ModelBooleanInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelParentFilterInput | null > | null,
  or?: Array< ModelParentFilterInput | null > | null,
  not?: ModelParentFilterInput | null,
  owner?: ModelStringInput | null,
};

export type ModelParentConnection = {
  __typename: "ModelParentConnection",
  items:  Array<Parent | null >,
  nextToken?: string | null,
};

export type ModelStudentFilterInput = {
  id?: ModelIDInput | null,
  firstName?: ModelStringInput | null,
  lastName?: ModelStringInput | null,
  dateOfBirth?: ModelStringInput | null,
  gradeLevel?: ModelIntInput | null,
  attendanceRate?: ModelFloatInput | null,
  currentStatus?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelStudentFilterInput | null > | null,
  or?: Array< ModelStudentFilterInput | null > | null,
  not?: ModelStudentFilterInput | null,
  schoolStudentsId?: ModelIDInput | null,
};

export type ModelParentStudentsFilterInput = {
  id?: ModelIDInput | null,
  parentId?: ModelIDInput | null,
  studentId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelParentStudentsFilterInput | null > | null,
  or?: Array< ModelParentStudentsFilterInput | null > | null,
  not?: ModelParentStudentsFilterInput | null,
  owner?: ModelStringInput | null,
};

export type ModelSubscriptionTeacherFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  cognitoUserId?: ModelSubscriptionStringInput | null,
  schoolId?: ModelSubscriptionIDInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionTeacherFilterInput | null > | null,
  or?: Array< ModelSubscriptionTeacherFilterInput | null > | null,
};

export type ModelSubscriptionIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionClassFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  teacherId?: ModelSubscriptionIDInput | null,
  schoolId?: ModelSubscriptionIDInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionClassFilterInput | null > | null,
  or?: Array< ModelSubscriptionClassFilterInput | null > | null,
};

export type ModelSubscriptionEnrollmentFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  studentId?: ModelSubscriptionIDInput | null,
  classId?: ModelSubscriptionIDInput | null,
  currentGrade?: ModelSubscriptionFloatInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionEnrollmentFilterInput | null > | null,
  or?: Array< ModelSubscriptionEnrollmentFilterInput | null > | null,
};

export type ModelSubscriptionFloatInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  in?: Array< number | null > | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionSchoolFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  address?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionSchoolFilterInput | null > | null,
  or?: Array< ModelSubscriptionSchoolFilterInput | null > | null,
  schoolStudentsId?: ModelSubscriptionIDInput | null,
};

export type ModelSubscriptionParentFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  cognitoUserId?: ModelSubscriptionStringInput | null,
  firstName?: ModelSubscriptionStringInput | null,
  lastName?: ModelSubscriptionStringInput | null,
  phoneNumber?: ModelSubscriptionStringInput | null,
  canEditRecords?: ModelSubscriptionBooleanInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionParentFilterInput | null > | null,
  or?: Array< ModelSubscriptionParentFilterInput | null > | null,
  owner?: ModelStringInput | null,
};

export type ModelSubscriptionBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
};

export type ModelSubscriptionStudentFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  firstName?: ModelSubscriptionStringInput | null,
  lastName?: ModelSubscriptionStringInput | null,
  dateOfBirth?: ModelSubscriptionStringInput | null,
  gradeLevel?: ModelSubscriptionIntInput | null,
  attendanceRate?: ModelSubscriptionFloatInput | null,
  currentStatus?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionStudentFilterInput | null > | null,
  or?: Array< ModelSubscriptionStudentFilterInput | null > | null,
};

export type ModelSubscriptionIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  in?: Array< number | null > | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionParentStudentsFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  parentId?: ModelSubscriptionIDInput | null,
  studentId?: ModelSubscriptionIDInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionParentStudentsFilterInput | null > | null,
  or?: Array< ModelSubscriptionParentStudentsFilterInput | null > | null,
  owner?: ModelStringInput | null,
};

export type CreateStudentMutationVariables = {
  input: CreateStudentInput,
  condition?: ModelStudentConditionInput | null,
};

export type CreateStudentMutation = {
  createStudent?:  {
    __typename: "Student",
    id: string,
    firstName: string,
    lastName: string,
    dateOfBirth?: string | null,
    gradeLevel?: number | null,
    attendanceRate?: number | null,
    currentStatus?: string | null,
    school?:  {
      __typename: "School",
      id: string,
      name: string,
      address?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    parents?:  {
      __typename: "ModelParentStudentsConnection",
      nextToken?: string | null,
    } | null,
    enrollments?:  {
      __typename: "ModelEnrollmentConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    schoolStudentsId?: string | null,
  } | null,
};

export type DeleteStudentMutationVariables = {
  input: DeleteStudentInput,
  condition?: ModelStudentConditionInput | null,
};

export type DeleteStudentMutation = {
  deleteStudent?:  {
    __typename: "Student",
    id: string,
    firstName: string,
    lastName: string,
    dateOfBirth?: string | null,
    gradeLevel?: number | null,
    attendanceRate?: number | null,
    currentStatus?: string | null,
    school?:  {
      __typename: "School",
      id: string,
      name: string,
      address?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    parents?:  {
      __typename: "ModelParentStudentsConnection",
      nextToken?: string | null,
    } | null,
    enrollments?:  {
      __typename: "ModelEnrollmentConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    schoolStudentsId?: string | null,
  } | null,
};

export type CreateTeacherMutationVariables = {
  input: CreateTeacherInput,
  condition?: ModelTeacherConditionInput | null,
};

export type CreateTeacherMutation = {
  createTeacher?:  {
    __typename: "Teacher",
    id: string,
    name: string,
    cognitoUserId?: string | null,
    schoolId: string,
    school?:  {
      __typename: "School",
      id: string,
      name: string,
      address?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    classes?:  {
      __typename: "ModelClassConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateTeacherMutationVariables = {
  input: UpdateTeacherInput,
  condition?: ModelTeacherConditionInput | null,
};

export type UpdateTeacherMutation = {
  updateTeacher?:  {
    __typename: "Teacher",
    id: string,
    name: string,
    cognitoUserId?: string | null,
    schoolId: string,
    school?:  {
      __typename: "School",
      id: string,
      name: string,
      address?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    classes?:  {
      __typename: "ModelClassConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteTeacherMutationVariables = {
  input: DeleteTeacherInput,
  condition?: ModelTeacherConditionInput | null,
};

export type DeleteTeacherMutation = {
  deleteTeacher?:  {
    __typename: "Teacher",
    id: string,
    name: string,
    cognitoUserId?: string | null,
    schoolId: string,
    school?:  {
      __typename: "School",
      id: string,
      name: string,
      address?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    classes?:  {
      __typename: "ModelClassConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateClassMutationVariables = {
  input: CreateClassInput,
  condition?: ModelClassConditionInput | null,
};

export type CreateClassMutation = {
  createClass?:  {
    __typename: "Class",
    id: string,
    name: string,
    teacherId: string,
    schoolId: string,
    teacher?:  {
      __typename: "Teacher",
      id: string,
      name: string,
      cognitoUserId?: string | null,
      schoolId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    school?:  {
      __typename: "School",
      id: string,
      name: string,
      address?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    enrollments?:  {
      __typename: "ModelEnrollmentConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateClassMutationVariables = {
  input: UpdateClassInput,
  condition?: ModelClassConditionInput | null,
};

export type UpdateClassMutation = {
  updateClass?:  {
    __typename: "Class",
    id: string,
    name: string,
    teacherId: string,
    schoolId: string,
    teacher?:  {
      __typename: "Teacher",
      id: string,
      name: string,
      cognitoUserId?: string | null,
      schoolId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    school?:  {
      __typename: "School",
      id: string,
      name: string,
      address?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    enrollments?:  {
      __typename: "ModelEnrollmentConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteClassMutationVariables = {
  input: DeleteClassInput,
  condition?: ModelClassConditionInput | null,
};

export type DeleteClassMutation = {
  deleteClass?:  {
    __typename: "Class",
    id: string,
    name: string,
    teacherId: string,
    schoolId: string,
    teacher?:  {
      __typename: "Teacher",
      id: string,
      name: string,
      cognitoUserId?: string | null,
      schoolId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    school?:  {
      __typename: "School",
      id: string,
      name: string,
      address?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    enrollments?:  {
      __typename: "ModelEnrollmentConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateEnrollmentMutationVariables = {
  input: CreateEnrollmentInput,
  condition?: ModelEnrollmentConditionInput | null,
};

export type CreateEnrollmentMutation = {
  createEnrollment?:  {
    __typename: "Enrollment",
    id: string,
    studentId: string,
    classId: string,
    currentGrade?: number | null,
    student?:  {
      __typename: "Student",
      id: string,
      firstName: string,
      lastName: string,
      dateOfBirth?: string | null,
      gradeLevel?: number | null,
      attendanceRate?: number | null,
      currentStatus?: string | null,
      createdAt: string,
      updatedAt: string,
      schoolStudentsId?: string | null,
    } | null,
    class?:  {
      __typename: "Class",
      id: string,
      name: string,
      teacherId: string,
      schoolId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateEnrollmentMutationVariables = {
  input: UpdateEnrollmentInput,
  condition?: ModelEnrollmentConditionInput | null,
};

export type UpdateEnrollmentMutation = {
  updateEnrollment?:  {
    __typename: "Enrollment",
    id: string,
    studentId: string,
    classId: string,
    currentGrade?: number | null,
    student?:  {
      __typename: "Student",
      id: string,
      firstName: string,
      lastName: string,
      dateOfBirth?: string | null,
      gradeLevel?: number | null,
      attendanceRate?: number | null,
      currentStatus?: string | null,
      createdAt: string,
      updatedAt: string,
      schoolStudentsId?: string | null,
    } | null,
    class?:  {
      __typename: "Class",
      id: string,
      name: string,
      teacherId: string,
      schoolId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteEnrollmentMutationVariables = {
  input: DeleteEnrollmentInput,
  condition?: ModelEnrollmentConditionInput | null,
};

export type DeleteEnrollmentMutation = {
  deleteEnrollment?:  {
    __typename: "Enrollment",
    id: string,
    studentId: string,
    classId: string,
    currentGrade?: number | null,
    student?:  {
      __typename: "Student",
      id: string,
      firstName: string,
      lastName: string,
      dateOfBirth?: string | null,
      gradeLevel?: number | null,
      attendanceRate?: number | null,
      currentStatus?: string | null,
      createdAt: string,
      updatedAt: string,
      schoolStudentsId?: string | null,
    } | null,
    class?:  {
      __typename: "Class",
      id: string,
      name: string,
      teacherId: string,
      schoolId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateSchoolMutationVariables = {
  input: CreateSchoolInput,
  condition?: ModelSchoolConditionInput | null,
};

export type CreateSchoolMutation = {
  createSchool?:  {
    __typename: "School",
    id: string,
    name: string,
    address?: string | null,
    students?:  {
      __typename: "ModelStudentConnection",
      nextToken?: string | null,
    } | null,
    teachers?:  {
      __typename: "ModelTeacherConnection",
      nextToken?: string | null,
    } | null,
    classes?:  {
      __typename: "ModelClassConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateSchoolMutationVariables = {
  input: UpdateSchoolInput,
  condition?: ModelSchoolConditionInput | null,
};

export type UpdateSchoolMutation = {
  updateSchool?:  {
    __typename: "School",
    id: string,
    name: string,
    address?: string | null,
    students?:  {
      __typename: "ModelStudentConnection",
      nextToken?: string | null,
    } | null,
    teachers?:  {
      __typename: "ModelTeacherConnection",
      nextToken?: string | null,
    } | null,
    classes?:  {
      __typename: "ModelClassConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteSchoolMutationVariables = {
  input: DeleteSchoolInput,
  condition?: ModelSchoolConditionInput | null,
};

export type DeleteSchoolMutation = {
  deleteSchool?:  {
    __typename: "School",
    id: string,
    name: string,
    address?: string | null,
    students?:  {
      __typename: "ModelStudentConnection",
      nextToken?: string | null,
    } | null,
    teachers?:  {
      __typename: "ModelTeacherConnection",
      nextToken?: string | null,
    } | null,
    classes?:  {
      __typename: "ModelClassConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateParentMutationVariables = {
  input: CreateParentInput,
  condition?: ModelParentConditionInput | null,
};

export type CreateParentMutation = {
  createParent?:  {
    __typename: "Parent",
    id: string,
    cognitoUserId?: string | null,
    firstName: string,
    lastName: string,
    phoneNumber?: string | null,
    canEditRecords?: boolean | null,
    students?:  {
      __typename: "ModelParentStudentsConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type UpdateParentMutationVariables = {
  input: UpdateParentInput,
  condition?: ModelParentConditionInput | null,
};

export type UpdateParentMutation = {
  updateParent?:  {
    __typename: "Parent",
    id: string,
    cognitoUserId?: string | null,
    firstName: string,
    lastName: string,
    phoneNumber?: string | null,
    canEditRecords?: boolean | null,
    students?:  {
      __typename: "ModelParentStudentsConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type DeleteParentMutationVariables = {
  input: DeleteParentInput,
  condition?: ModelParentConditionInput | null,
};

export type DeleteParentMutation = {
  deleteParent?:  {
    __typename: "Parent",
    id: string,
    cognitoUserId?: string | null,
    firstName: string,
    lastName: string,
    phoneNumber?: string | null,
    canEditRecords?: boolean | null,
    students?:  {
      __typename: "ModelParentStudentsConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type UpdateStudentMutationVariables = {
  input: UpdateStudentInput,
  condition?: ModelStudentConditionInput | null,
};

export type UpdateStudentMutation = {
  updateStudent?:  {
    __typename: "Student",
    id: string,
    firstName: string,
    lastName: string,
    dateOfBirth?: string | null,
    gradeLevel?: number | null,
    attendanceRate?: number | null,
    currentStatus?: string | null,
    school?:  {
      __typename: "School",
      id: string,
      name: string,
      address?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    parents?:  {
      __typename: "ModelParentStudentsConnection",
      nextToken?: string | null,
    } | null,
    enrollments?:  {
      __typename: "ModelEnrollmentConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    schoolStudentsId?: string | null,
  } | null,
};

export type CreateParentStudentsMutationVariables = {
  input: CreateParentStudentsInput,
  condition?: ModelParentStudentsConditionInput | null,
};

export type CreateParentStudentsMutation = {
  createParentStudents?:  {
    __typename: "ParentStudents",
    id: string,
    parentId: string,
    studentId: string,
    parent:  {
      __typename: "Parent",
      id: string,
      cognitoUserId?: string | null,
      firstName: string,
      lastName: string,
      phoneNumber?: string | null,
      canEditRecords?: boolean | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    },
    student:  {
      __typename: "Student",
      id: string,
      firstName: string,
      lastName: string,
      dateOfBirth?: string | null,
      gradeLevel?: number | null,
      attendanceRate?: number | null,
      currentStatus?: string | null,
      createdAt: string,
      updatedAt: string,
      schoolStudentsId?: string | null,
    },
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type UpdateParentStudentsMutationVariables = {
  input: UpdateParentStudentsInput,
  condition?: ModelParentStudentsConditionInput | null,
};

export type UpdateParentStudentsMutation = {
  updateParentStudents?:  {
    __typename: "ParentStudents",
    id: string,
    parentId: string,
    studentId: string,
    parent:  {
      __typename: "Parent",
      id: string,
      cognitoUserId?: string | null,
      firstName: string,
      lastName: string,
      phoneNumber?: string | null,
      canEditRecords?: boolean | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    },
    student:  {
      __typename: "Student",
      id: string,
      firstName: string,
      lastName: string,
      dateOfBirth?: string | null,
      gradeLevel?: number | null,
      attendanceRate?: number | null,
      currentStatus?: string | null,
      createdAt: string,
      updatedAt: string,
      schoolStudentsId?: string | null,
    },
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type DeleteParentStudentsMutationVariables = {
  input: DeleteParentStudentsInput,
  condition?: ModelParentStudentsConditionInput | null,
};

export type DeleteParentStudentsMutation = {
  deleteParentStudents?:  {
    __typename: "ParentStudents",
    id: string,
    parentId: string,
    studentId: string,
    parent:  {
      __typename: "Parent",
      id: string,
      cognitoUserId?: string | null,
      firstName: string,
      lastName: string,
      phoneNumber?: string | null,
      canEditRecords?: boolean | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    },
    student:  {
      __typename: "Student",
      id: string,
      firstName: string,
      lastName: string,
      dateOfBirth?: string | null,
      gradeLevel?: number | null,
      attendanceRate?: number | null,
      currentStatus?: string | null,
      createdAt: string,
      updatedAt: string,
      schoolStudentsId?: string | null,
    },
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type GetTeacherQueryVariables = {
  id: string,
};

export type GetTeacherQuery = {
  getTeacher?:  {
    __typename: "Teacher",
    id: string,
    name: string,
    cognitoUserId?: string | null,
    schoolId: string,
    school?:  {
      __typename: "School",
      id: string,
      name: string,
      address?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    classes?:  {
      __typename: "ModelClassConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListTeachersQueryVariables = {
  filter?: ModelTeacherFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListTeachersQuery = {
  listTeachers?:  {
    __typename: "ModelTeacherConnection",
    items:  Array< {
      __typename: "Teacher",
      id: string,
      name: string,
      cognitoUserId?: string | null,
      schoolId: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetClassQueryVariables = {
  id: string,
};

export type GetClassQuery = {
  getClass?:  {
    __typename: "Class",
    id: string,
    name: string,
    teacherId: string,
    schoolId: string,
    teacher?:  {
      __typename: "Teacher",
      id: string,
      name: string,
      cognitoUserId?: string | null,
      schoolId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    school?:  {
      __typename: "School",
      id: string,
      name: string,
      address?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    enrollments?:  {
      __typename: "ModelEnrollmentConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListClassesQueryVariables = {
  filter?: ModelClassFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListClassesQuery = {
  listClasses?:  {
    __typename: "ModelClassConnection",
    items:  Array< {
      __typename: "Class",
      id: string,
      name: string,
      teacherId: string,
      schoolId: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetEnrollmentQueryVariables = {
  id: string,
};

export type GetEnrollmentQuery = {
  getEnrollment?:  {
    __typename: "Enrollment",
    id: string,
    studentId: string,
    classId: string,
    currentGrade?: number | null,
    student?:  {
      __typename: "Student",
      id: string,
      firstName: string,
      lastName: string,
      dateOfBirth?: string | null,
      gradeLevel?: number | null,
      attendanceRate?: number | null,
      currentStatus?: string | null,
      createdAt: string,
      updatedAt: string,
      schoolStudentsId?: string | null,
    } | null,
    class?:  {
      __typename: "Class",
      id: string,
      name: string,
      teacherId: string,
      schoolId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListEnrollmentsQueryVariables = {
  filter?: ModelEnrollmentFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListEnrollmentsQuery = {
  listEnrollments?:  {
    __typename: "ModelEnrollmentConnection",
    items:  Array< {
      __typename: "Enrollment",
      id: string,
      studentId: string,
      classId: string,
      currentGrade?: number | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type TeachersByCognitoUserIdQueryVariables = {
  cognitoUserId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelTeacherFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type TeachersByCognitoUserIdQuery = {
  teachersByCognitoUserId?:  {
    __typename: "ModelTeacherConnection",
    items:  Array< {
      __typename: "Teacher",
      id: string,
      name: string,
      cognitoUserId?: string | null,
      schoolId: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type TeachersBySchoolIdQueryVariables = {
  schoolId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelTeacherFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type TeachersBySchoolIdQuery = {
  teachersBySchoolId?:  {
    __typename: "ModelTeacherConnection",
    items:  Array< {
      __typename: "Teacher",
      id: string,
      name: string,
      cognitoUserId?: string | null,
      schoolId: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ClassesByTeacherIdQueryVariables = {
  teacherId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelClassFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ClassesByTeacherIdQuery = {
  classesByTeacherId?:  {
    __typename: "ModelClassConnection",
    items:  Array< {
      __typename: "Class",
      id: string,
      name: string,
      teacherId: string,
      schoolId: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ClassesBySchoolIdQueryVariables = {
  schoolId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelClassFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ClassesBySchoolIdQuery = {
  classesBySchoolId?:  {
    __typename: "ModelClassConnection",
    items:  Array< {
      __typename: "Class",
      id: string,
      name: string,
      teacherId: string,
      schoolId: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type EnrollmentsByStudentIdQueryVariables = {
  studentId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelEnrollmentFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type EnrollmentsByStudentIdQuery = {
  enrollmentsByStudentId?:  {
    __typename: "ModelEnrollmentConnection",
    items:  Array< {
      __typename: "Enrollment",
      id: string,
      studentId: string,
      classId: string,
      currentGrade?: number | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type EnrollmentsByClassIdQueryVariables = {
  classId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelEnrollmentFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type EnrollmentsByClassIdQuery = {
  enrollmentsByClassId?:  {
    __typename: "ModelEnrollmentConnection",
    items:  Array< {
      __typename: "Enrollment",
      id: string,
      studentId: string,
      classId: string,
      currentGrade?: number | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetSchoolQueryVariables = {
  id: string,
};

export type GetSchoolQuery = {
  getSchool?:  {
    __typename: "School",
    id: string,
    name: string,
    address?: string | null,
    students?:  {
      __typename: "ModelStudentConnection",
      nextToken?: string | null,
    } | null,
    teachers?:  {
      __typename: "ModelTeacherConnection",
      nextToken?: string | null,
    } | null,
    classes?:  {
      __typename: "ModelClassConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListSchoolsQueryVariables = {
  filter?: ModelSchoolFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListSchoolsQuery = {
  listSchools?:  {
    __typename: "ModelSchoolConnection",
    items:  Array< {
      __typename: "School",
      id: string,
      name: string,
      address?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetParentQueryVariables = {
  id: string,
};

export type GetParentQuery = {
  getParent?:  {
    __typename: "Parent",
    id: string,
    cognitoUserId?: string | null,
    firstName: string,
    lastName: string,
    phoneNumber?: string | null,
    canEditRecords?: boolean | null,
    students?:  {
      __typename: "ModelParentStudentsConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type ListParentsQueryVariables = {
  filter?: ModelParentFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListParentsQuery = {
  listParents?:  {
    __typename: "ModelParentConnection",
    items:  Array< {
      __typename: "Parent",
      id: string,
      cognitoUserId?: string | null,
      firstName: string,
      lastName: string,
      phoneNumber?: string | null,
      canEditRecords?: boolean | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ParentsByCognitoUserIdQueryVariables = {
  cognitoUserId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelParentFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ParentsByCognitoUserIdQuery = {
  parentsByCognitoUserId?:  {
    __typename: "ModelParentConnection",
    items:  Array< {
      __typename: "Parent",
      id: string,
      cognitoUserId?: string | null,
      firstName: string,
      lastName: string,
      phoneNumber?: string | null,
      canEditRecords?: boolean | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetStudentQueryVariables = {
  id: string,
};

export type GetStudentQuery = {
  getStudent?:  {
    __typename: "Student",
    id: string,
    firstName: string,
    lastName: string,
    dateOfBirth?: string | null,
    gradeLevel?: number | null,
    attendanceRate?: number | null,
    currentStatus?: string | null,
    school?:  {
      __typename: "School",
      id: string,
      name: string,
      address?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    parents?:  {
      __typename: "ModelParentStudentsConnection",
      nextToken?: string | null,
    } | null,
    enrollments?:  {
      __typename: "ModelEnrollmentConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    schoolStudentsId?: string | null,
  } | null,
};

export type ListStudentsQueryVariables = {
  filter?: ModelStudentFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListStudentsQuery = {
  listStudents?:  {
    __typename: "ModelStudentConnection",
    items:  Array< {
      __typename: "Student",
      id: string,
      firstName: string,
      lastName: string,
      dateOfBirth?: string | null,
      gradeLevel?: number | null,
      attendanceRate?: number | null,
      currentStatus?: string | null,
      createdAt: string,
      updatedAt: string,
      schoolStudentsId?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetParentStudentsQueryVariables = {
  id: string,
};

export type GetParentStudentsQuery = {
  getParentStudents?:  {
    __typename: "ParentStudents",
    id: string,
    parentId: string,
    studentId: string,
    parent:  {
      __typename: "Parent",
      id: string,
      cognitoUserId?: string | null,
      firstName: string,
      lastName: string,
      phoneNumber?: string | null,
      canEditRecords?: boolean | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    },
    student:  {
      __typename: "Student",
      id: string,
      firstName: string,
      lastName: string,
      dateOfBirth?: string | null,
      gradeLevel?: number | null,
      attendanceRate?: number | null,
      currentStatus?: string | null,
      createdAt: string,
      updatedAt: string,
      schoolStudentsId?: string | null,
    },
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type ListParentStudentsQueryVariables = {
  filter?: ModelParentStudentsFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListParentStudentsQuery = {
  listParentStudents?:  {
    __typename: "ModelParentStudentsConnection",
    items:  Array< {
      __typename: "ParentStudents",
      id: string,
      parentId: string,
      studentId: string,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ParentStudentsByParentIdQueryVariables = {
  parentId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelParentStudentsFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ParentStudentsByParentIdQuery = {
  parentStudentsByParentId?:  {
    __typename: "ModelParentStudentsConnection",
    items:  Array< {
      __typename: "ParentStudents",
      id: string,
      parentId: string,
      studentId: string,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ParentStudentsByStudentIdQueryVariables = {
  studentId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelParentStudentsFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ParentStudentsByStudentIdQuery = {
  parentStudentsByStudentId?:  {
    __typename: "ModelParentStudentsConnection",
    items:  Array< {
      __typename: "ParentStudents",
      id: string,
      parentId: string,
      studentId: string,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type OnCreateTeacherSubscriptionVariables = {
  filter?: ModelSubscriptionTeacherFilterInput | null,
};

export type OnCreateTeacherSubscription = {
  onCreateTeacher?:  {
    __typename: "Teacher",
    id: string,
    name: string,
    cognitoUserId?: string | null,
    schoolId: string,
    school?:  {
      __typename: "School",
      id: string,
      name: string,
      address?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    classes?:  {
      __typename: "ModelClassConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateTeacherSubscriptionVariables = {
  filter?: ModelSubscriptionTeacherFilterInput | null,
};

export type OnUpdateTeacherSubscription = {
  onUpdateTeacher?:  {
    __typename: "Teacher",
    id: string,
    name: string,
    cognitoUserId?: string | null,
    schoolId: string,
    school?:  {
      __typename: "School",
      id: string,
      name: string,
      address?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    classes?:  {
      __typename: "ModelClassConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteTeacherSubscriptionVariables = {
  filter?: ModelSubscriptionTeacherFilterInput | null,
};

export type OnDeleteTeacherSubscription = {
  onDeleteTeacher?:  {
    __typename: "Teacher",
    id: string,
    name: string,
    cognitoUserId?: string | null,
    schoolId: string,
    school?:  {
      __typename: "School",
      id: string,
      name: string,
      address?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    classes?:  {
      __typename: "ModelClassConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateClassSubscriptionVariables = {
  filter?: ModelSubscriptionClassFilterInput | null,
};

export type OnCreateClassSubscription = {
  onCreateClass?:  {
    __typename: "Class",
    id: string,
    name: string,
    teacherId: string,
    schoolId: string,
    teacher?:  {
      __typename: "Teacher",
      id: string,
      name: string,
      cognitoUserId?: string | null,
      schoolId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    school?:  {
      __typename: "School",
      id: string,
      name: string,
      address?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    enrollments?:  {
      __typename: "ModelEnrollmentConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateClassSubscriptionVariables = {
  filter?: ModelSubscriptionClassFilterInput | null,
};

export type OnUpdateClassSubscription = {
  onUpdateClass?:  {
    __typename: "Class",
    id: string,
    name: string,
    teacherId: string,
    schoolId: string,
    teacher?:  {
      __typename: "Teacher",
      id: string,
      name: string,
      cognitoUserId?: string | null,
      schoolId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    school?:  {
      __typename: "School",
      id: string,
      name: string,
      address?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    enrollments?:  {
      __typename: "ModelEnrollmentConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteClassSubscriptionVariables = {
  filter?: ModelSubscriptionClassFilterInput | null,
};

export type OnDeleteClassSubscription = {
  onDeleteClass?:  {
    __typename: "Class",
    id: string,
    name: string,
    teacherId: string,
    schoolId: string,
    teacher?:  {
      __typename: "Teacher",
      id: string,
      name: string,
      cognitoUserId?: string | null,
      schoolId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    school?:  {
      __typename: "School",
      id: string,
      name: string,
      address?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    enrollments?:  {
      __typename: "ModelEnrollmentConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateEnrollmentSubscriptionVariables = {
  filter?: ModelSubscriptionEnrollmentFilterInput | null,
};

export type OnCreateEnrollmentSubscription = {
  onCreateEnrollment?:  {
    __typename: "Enrollment",
    id: string,
    studentId: string,
    classId: string,
    currentGrade?: number | null,
    student?:  {
      __typename: "Student",
      id: string,
      firstName: string,
      lastName: string,
      dateOfBirth?: string | null,
      gradeLevel?: number | null,
      attendanceRate?: number | null,
      currentStatus?: string | null,
      createdAt: string,
      updatedAt: string,
      schoolStudentsId?: string | null,
    } | null,
    class?:  {
      __typename: "Class",
      id: string,
      name: string,
      teacherId: string,
      schoolId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateEnrollmentSubscriptionVariables = {
  filter?: ModelSubscriptionEnrollmentFilterInput | null,
};

export type OnUpdateEnrollmentSubscription = {
  onUpdateEnrollment?:  {
    __typename: "Enrollment",
    id: string,
    studentId: string,
    classId: string,
    currentGrade?: number | null,
    student?:  {
      __typename: "Student",
      id: string,
      firstName: string,
      lastName: string,
      dateOfBirth?: string | null,
      gradeLevel?: number | null,
      attendanceRate?: number | null,
      currentStatus?: string | null,
      createdAt: string,
      updatedAt: string,
      schoolStudentsId?: string | null,
    } | null,
    class?:  {
      __typename: "Class",
      id: string,
      name: string,
      teacherId: string,
      schoolId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteEnrollmentSubscriptionVariables = {
  filter?: ModelSubscriptionEnrollmentFilterInput | null,
};

export type OnDeleteEnrollmentSubscription = {
  onDeleteEnrollment?:  {
    __typename: "Enrollment",
    id: string,
    studentId: string,
    classId: string,
    currentGrade?: number | null,
    student?:  {
      __typename: "Student",
      id: string,
      firstName: string,
      lastName: string,
      dateOfBirth?: string | null,
      gradeLevel?: number | null,
      attendanceRate?: number | null,
      currentStatus?: string | null,
      createdAt: string,
      updatedAt: string,
      schoolStudentsId?: string | null,
    } | null,
    class?:  {
      __typename: "Class",
      id: string,
      name: string,
      teacherId: string,
      schoolId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateSchoolSubscriptionVariables = {
  filter?: ModelSubscriptionSchoolFilterInput | null,
};

export type OnCreateSchoolSubscription = {
  onCreateSchool?:  {
    __typename: "School",
    id: string,
    name: string,
    address?: string | null,
    students?:  {
      __typename: "ModelStudentConnection",
      nextToken?: string | null,
    } | null,
    teachers?:  {
      __typename: "ModelTeacherConnection",
      nextToken?: string | null,
    } | null,
    classes?:  {
      __typename: "ModelClassConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateSchoolSubscriptionVariables = {
  filter?: ModelSubscriptionSchoolFilterInput | null,
};

export type OnUpdateSchoolSubscription = {
  onUpdateSchool?:  {
    __typename: "School",
    id: string,
    name: string,
    address?: string | null,
    students?:  {
      __typename: "ModelStudentConnection",
      nextToken?: string | null,
    } | null,
    teachers?:  {
      __typename: "ModelTeacherConnection",
      nextToken?: string | null,
    } | null,
    classes?:  {
      __typename: "ModelClassConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteSchoolSubscriptionVariables = {
  filter?: ModelSubscriptionSchoolFilterInput | null,
};

export type OnDeleteSchoolSubscription = {
  onDeleteSchool?:  {
    __typename: "School",
    id: string,
    name: string,
    address?: string | null,
    students?:  {
      __typename: "ModelStudentConnection",
      nextToken?: string | null,
    } | null,
    teachers?:  {
      __typename: "ModelTeacherConnection",
      nextToken?: string | null,
    } | null,
    classes?:  {
      __typename: "ModelClassConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateParentSubscriptionVariables = {
  filter?: ModelSubscriptionParentFilterInput | null,
  owner?: string | null,
};

export type OnCreateParentSubscription = {
  onCreateParent?:  {
    __typename: "Parent",
    id: string,
    cognitoUserId?: string | null,
    firstName: string,
    lastName: string,
    phoneNumber?: string | null,
    canEditRecords?: boolean | null,
    students?:  {
      __typename: "ModelParentStudentsConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnUpdateParentSubscriptionVariables = {
  filter?: ModelSubscriptionParentFilterInput | null,
  owner?: string | null,
};

export type OnUpdateParentSubscription = {
  onUpdateParent?:  {
    __typename: "Parent",
    id: string,
    cognitoUserId?: string | null,
    firstName: string,
    lastName: string,
    phoneNumber?: string | null,
    canEditRecords?: boolean | null,
    students?:  {
      __typename: "ModelParentStudentsConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnDeleteParentSubscriptionVariables = {
  filter?: ModelSubscriptionParentFilterInput | null,
  owner?: string | null,
};

export type OnDeleteParentSubscription = {
  onDeleteParent?:  {
    __typename: "Parent",
    id: string,
    cognitoUserId?: string | null,
    firstName: string,
    lastName: string,
    phoneNumber?: string | null,
    canEditRecords?: boolean | null,
    students?:  {
      __typename: "ModelParentStudentsConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnCreateStudentSubscriptionVariables = {
  filter?: ModelSubscriptionStudentFilterInput | null,
};

export type OnCreateStudentSubscription = {
  onCreateStudent?:  {
    __typename: "Student",
    id: string,
    firstName: string,
    lastName: string,
    dateOfBirth?: string | null,
    gradeLevel?: number | null,
    attendanceRate?: number | null,
    currentStatus?: string | null,
    school?:  {
      __typename: "School",
      id: string,
      name: string,
      address?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    parents?:  {
      __typename: "ModelParentStudentsConnection",
      nextToken?: string | null,
    } | null,
    enrollments?:  {
      __typename: "ModelEnrollmentConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    schoolStudentsId?: string | null,
  } | null,
};

export type OnUpdateStudentSubscriptionVariables = {
  filter?: ModelSubscriptionStudentFilterInput | null,
};

export type OnUpdateStudentSubscription = {
  onUpdateStudent?:  {
    __typename: "Student",
    id: string,
    firstName: string,
    lastName: string,
    dateOfBirth?: string | null,
    gradeLevel?: number | null,
    attendanceRate?: number | null,
    currentStatus?: string | null,
    school?:  {
      __typename: "School",
      id: string,
      name: string,
      address?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    parents?:  {
      __typename: "ModelParentStudentsConnection",
      nextToken?: string | null,
    } | null,
    enrollments?:  {
      __typename: "ModelEnrollmentConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    schoolStudentsId?: string | null,
  } | null,
};

export type OnDeleteStudentSubscriptionVariables = {
  filter?: ModelSubscriptionStudentFilterInput | null,
};

export type OnDeleteStudentSubscription = {
  onDeleteStudent?:  {
    __typename: "Student",
    id: string,
    firstName: string,
    lastName: string,
    dateOfBirth?: string | null,
    gradeLevel?: number | null,
    attendanceRate?: number | null,
    currentStatus?: string | null,
    school?:  {
      __typename: "School",
      id: string,
      name: string,
      address?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    parents?:  {
      __typename: "ModelParentStudentsConnection",
      nextToken?: string | null,
    } | null,
    enrollments?:  {
      __typename: "ModelEnrollmentConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    schoolStudentsId?: string | null,
  } | null,
};

export type OnCreateParentStudentsSubscriptionVariables = {
  filter?: ModelSubscriptionParentStudentsFilterInput | null,
  owner?: string | null,
};

export type OnCreateParentStudentsSubscription = {
  onCreateParentStudents?:  {
    __typename: "ParentStudents",
    id: string,
    parentId: string,
    studentId: string,
    parent:  {
      __typename: "Parent",
      id: string,
      cognitoUserId?: string | null,
      firstName: string,
      lastName: string,
      phoneNumber?: string | null,
      canEditRecords?: boolean | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    },
    student:  {
      __typename: "Student",
      id: string,
      firstName: string,
      lastName: string,
      dateOfBirth?: string | null,
      gradeLevel?: number | null,
      attendanceRate?: number | null,
      currentStatus?: string | null,
      createdAt: string,
      updatedAt: string,
      schoolStudentsId?: string | null,
    },
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnUpdateParentStudentsSubscriptionVariables = {
  filter?: ModelSubscriptionParentStudentsFilterInput | null,
  owner?: string | null,
};

export type OnUpdateParentStudentsSubscription = {
  onUpdateParentStudents?:  {
    __typename: "ParentStudents",
    id: string,
    parentId: string,
    studentId: string,
    parent:  {
      __typename: "Parent",
      id: string,
      cognitoUserId?: string | null,
      firstName: string,
      lastName: string,
      phoneNumber?: string | null,
      canEditRecords?: boolean | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    },
    student:  {
      __typename: "Student",
      id: string,
      firstName: string,
      lastName: string,
      dateOfBirth?: string | null,
      gradeLevel?: number | null,
      attendanceRate?: number | null,
      currentStatus?: string | null,
      createdAt: string,
      updatedAt: string,
      schoolStudentsId?: string | null,
    },
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnDeleteParentStudentsSubscriptionVariables = {
  filter?: ModelSubscriptionParentStudentsFilterInput | null,
  owner?: string | null,
};

export type OnDeleteParentStudentsSubscription = {
  onDeleteParentStudents?:  {
    __typename: "ParentStudents",
    id: string,
    parentId: string,
    studentId: string,
    parent:  {
      __typename: "Parent",
      id: string,
      cognitoUserId?: string | null,
      firstName: string,
      lastName: string,
      phoneNumber?: string | null,
      canEditRecords?: boolean | null,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    },
    student:  {
      __typename: "Student",
      id: string,
      firstName: string,
      lastName: string,
      dateOfBirth?: string | null,
      gradeLevel?: number | null,
      attendanceRate?: number | null,
      currentStatus?: string | null,
      createdAt: string,
      updatedAt: string,
      schoolStudentsId?: string | null,
    },
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};
