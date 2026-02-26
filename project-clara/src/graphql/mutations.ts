/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createStudent = /* GraphQL */ `mutation CreateStudent(
  $input: CreateStudentInput!
  $condition: ModelStudentConditionInput
) {
  createStudent(input: $input, condition: $condition) {
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
    attendances {
      nextToken
      __typename
    }
    incidents {
      nextToken
      __typename
    }
    medicalRecord {
      id
      studentId
      allergies
      medications
      conditions
      emergencyNotes
      createdAt
      updatedAt
      __typename
    }
    createdAt
    updatedAt
    schoolStudentsId
    studentMedicalRecordId
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateStudentMutationVariables,
  APITypes.CreateStudentMutation
>;
export const deleteStudent = /* GraphQL */ `mutation DeleteStudent(
  $input: DeleteStudentInput!
  $condition: ModelStudentConditionInput
) {
  deleteStudent(input: $input, condition: $condition) {
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
    attendances {
      nextToken
      __typename
    }
    incidents {
      nextToken
      __typename
    }
    medicalRecord {
      id
      studentId
      allergies
      medications
      conditions
      emergencyNotes
      createdAt
      updatedAt
      __typename
    }
    createdAt
    updatedAt
    schoolStudentsId
    studentMedicalRecordId
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteStudentMutationVariables,
  APITypes.DeleteStudentMutation
>;
export const createTeacher = /* GraphQL */ `mutation CreateTeacher(
  $input: CreateTeacherInput!
  $condition: ModelTeacherConditionInput
) {
  createTeacher(input: $input, condition: $condition) {
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
    incidents {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateTeacherMutationVariables,
  APITypes.CreateTeacherMutation
>;
export const updateTeacher = /* GraphQL */ `mutation UpdateTeacher(
  $input: UpdateTeacherInput!
  $condition: ModelTeacherConditionInput
) {
  updateTeacher(input: $input, condition: $condition) {
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
    incidents {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateTeacherMutationVariables,
  APITypes.UpdateTeacherMutation
>;
export const deleteTeacher = /* GraphQL */ `mutation DeleteTeacher(
  $input: DeleteTeacherInput!
  $condition: ModelTeacherConditionInput
) {
  deleteTeacher(input: $input, condition: $condition) {
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
    incidents {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteTeacherMutationVariables,
  APITypes.DeleteTeacherMutation
>;
export const createClass = /* GraphQL */ `mutation CreateClass(
  $input: CreateClassInput!
  $condition: ModelClassConditionInput
) {
  createClass(input: $input, condition: $condition) {
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
    attendances {
      nextToken
      __typename
    }
    incidents {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateClassMutationVariables,
  APITypes.CreateClassMutation
>;
export const updateClass = /* GraphQL */ `mutation UpdateClass(
  $input: UpdateClassInput!
  $condition: ModelClassConditionInput
) {
  updateClass(input: $input, condition: $condition) {
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
    attendances {
      nextToken
      __typename
    }
    incidents {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateClassMutationVariables,
  APITypes.UpdateClassMutation
>;
export const deleteClass = /* GraphQL */ `mutation DeleteClass(
  $input: DeleteClassInput!
  $condition: ModelClassConditionInput
) {
  deleteClass(input: $input, condition: $condition) {
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
    attendances {
      nextToken
      __typename
    }
    incidents {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteClassMutationVariables,
  APITypes.DeleteClassMutation
>;
export const createEnrollment = /* GraphQL */ `mutation CreateEnrollment(
  $input: CreateEnrollmentInput!
  $condition: ModelEnrollmentConditionInput
) {
  createEnrollment(input: $input, condition: $condition) {
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
      studentMedicalRecordId
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
` as GeneratedMutation<
  APITypes.CreateEnrollmentMutationVariables,
  APITypes.CreateEnrollmentMutation
>;
export const updateEnrollment = /* GraphQL */ `mutation UpdateEnrollment(
  $input: UpdateEnrollmentInput!
  $condition: ModelEnrollmentConditionInput
) {
  updateEnrollment(input: $input, condition: $condition) {
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
      studentMedicalRecordId
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
` as GeneratedMutation<
  APITypes.UpdateEnrollmentMutationVariables,
  APITypes.UpdateEnrollmentMutation
>;
export const deleteEnrollment = /* GraphQL */ `mutation DeleteEnrollment(
  $input: DeleteEnrollmentInput!
  $condition: ModelEnrollmentConditionInput
) {
  deleteEnrollment(input: $input, condition: $condition) {
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
      studentMedicalRecordId
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
` as GeneratedMutation<
  APITypes.DeleteEnrollmentMutationVariables,
  APITypes.DeleteEnrollmentMutation
>;
export const createAttendance = /* GraphQL */ `mutation CreateAttendance(
  $input: CreateAttendanceInput!
  $condition: ModelAttendanceConditionInput
) {
  createAttendance(input: $input, condition: $condition) {
    id
    studentId
    classId
    date
    status
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
      studentMedicalRecordId
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
` as GeneratedMutation<
  APITypes.CreateAttendanceMutationVariables,
  APITypes.CreateAttendanceMutation
>;
export const updateAttendance = /* GraphQL */ `mutation UpdateAttendance(
  $input: UpdateAttendanceInput!
  $condition: ModelAttendanceConditionInput
) {
  updateAttendance(input: $input, condition: $condition) {
    id
    studentId
    classId
    date
    status
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
      studentMedicalRecordId
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
` as GeneratedMutation<
  APITypes.UpdateAttendanceMutationVariables,
  APITypes.UpdateAttendanceMutation
>;
export const deleteAttendance = /* GraphQL */ `mutation DeleteAttendance(
  $input: DeleteAttendanceInput!
  $condition: ModelAttendanceConditionInput
) {
  deleteAttendance(input: $input, condition: $condition) {
    id
    studentId
    classId
    date
    status
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
      studentMedicalRecordId
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
` as GeneratedMutation<
  APITypes.DeleteAttendanceMutationVariables,
  APITypes.DeleteAttendanceMutation
>;
export const createAnnouncement = /* GraphQL */ `mutation CreateAnnouncement(
  $input: CreateAnnouncementInput!
  $condition: ModelAnnouncementConditionInput
) {
  createAnnouncement(input: $input, condition: $condition) {
    id
    title
    body
    createdAt
    createdBy
    schoolId
    classId
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateAnnouncementMutationVariables,
  APITypes.CreateAnnouncementMutation
>;
export const updateAnnouncement = /* GraphQL */ `mutation UpdateAnnouncement(
  $input: UpdateAnnouncementInput!
  $condition: ModelAnnouncementConditionInput
) {
  updateAnnouncement(input: $input, condition: $condition) {
    id
    title
    body
    createdAt
    createdBy
    schoolId
    classId
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateAnnouncementMutationVariables,
  APITypes.UpdateAnnouncementMutation
>;
export const deleteAnnouncement = /* GraphQL */ `mutation DeleteAnnouncement(
  $input: DeleteAnnouncementInput!
  $condition: ModelAnnouncementConditionInput
) {
  deleteAnnouncement(input: $input, condition: $condition) {
    id
    title
    body
    createdAt
    createdBy
    schoolId
    classId
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteAnnouncementMutationVariables,
  APITypes.DeleteAnnouncementMutation
>;
export const createMedicalRecord = /* GraphQL */ `mutation CreateMedicalRecord(
  $input: CreateMedicalRecordInput!
  $condition: ModelMedicalRecordConditionInput
) {
  createMedicalRecord(input: $input, condition: $condition) {
    id
    studentId
    allergies
    medications
    conditions
    emergencyNotes
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
      studentMedicalRecordId
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateMedicalRecordMutationVariables,
  APITypes.CreateMedicalRecordMutation
>;
export const updateMedicalRecord = /* GraphQL */ `mutation UpdateMedicalRecord(
  $input: UpdateMedicalRecordInput!
  $condition: ModelMedicalRecordConditionInput
) {
  updateMedicalRecord(input: $input, condition: $condition) {
    id
    studentId
    allergies
    medications
    conditions
    emergencyNotes
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
      studentMedicalRecordId
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateMedicalRecordMutationVariables,
  APITypes.UpdateMedicalRecordMutation
>;
export const deleteMedicalRecord = /* GraphQL */ `mutation DeleteMedicalRecord(
  $input: DeleteMedicalRecordInput!
  $condition: ModelMedicalRecordConditionInput
) {
  deleteMedicalRecord(input: $input, condition: $condition) {
    id
    studentId
    allergies
    medications
    conditions
    emergencyNotes
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
      studentMedicalRecordId
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteMedicalRecordMutationVariables,
  APITypes.DeleteMedicalRecordMutation
>;
export const createIncident = /* GraphQL */ `mutation CreateIncident(
  $input: CreateIncidentInput!
  $condition: ModelIncidentConditionInput
) {
  createIncident(input: $input, condition: $condition) {
    id
    description
    severity
    date
    teacherId
    studentId
    classId
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
      studentMedicalRecordId
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
    school {
      id
      name
      address
      createdAt
      updatedAt
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateIncidentMutationVariables,
  APITypes.CreateIncidentMutation
>;
export const updateIncident = /* GraphQL */ `mutation UpdateIncident(
  $input: UpdateIncidentInput!
  $condition: ModelIncidentConditionInput
) {
  updateIncident(input: $input, condition: $condition) {
    id
    description
    severity
    date
    teacherId
    studentId
    classId
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
      studentMedicalRecordId
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
    school {
      id
      name
      address
      createdAt
      updatedAt
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateIncidentMutationVariables,
  APITypes.UpdateIncidentMutation
>;
export const deleteIncident = /* GraphQL */ `mutation DeleteIncident(
  $input: DeleteIncidentInput!
  $condition: ModelIncidentConditionInput
) {
  deleteIncident(input: $input, condition: $condition) {
    id
    description
    severity
    date
    teacherId
    studentId
    classId
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
      studentMedicalRecordId
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
    school {
      id
      name
      address
      createdAt
      updatedAt
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteIncidentMutationVariables,
  APITypes.DeleteIncidentMutation
>;
export const createConversation = /* GraphQL */ `mutation CreateConversation(
  $input: CreateConversationInput!
  $condition: ModelConversationConditionInput
) {
  createConversation(input: $input, condition: $condition) {
    id
    type
    parentId
    teacherId
    studentId
    classId
    parentName
    teacherName
    studentName
    className
    lastMessageText
    lastMessageAt
    messages {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateConversationMutationVariables,
  APITypes.CreateConversationMutation
>;
export const updateConversation = /* GraphQL */ `mutation UpdateConversation(
  $input: UpdateConversationInput!
  $condition: ModelConversationConditionInput
) {
  updateConversation(input: $input, condition: $condition) {
    id
    type
    parentId
    teacherId
    studentId
    classId
    parentName
    teacherName
    studentName
    className
    lastMessageText
    lastMessageAt
    messages {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateConversationMutationVariables,
  APITypes.UpdateConversationMutation
>;
export const deleteConversation = /* GraphQL */ `mutation DeleteConversation(
  $input: DeleteConversationInput!
  $condition: ModelConversationConditionInput
) {
  deleteConversation(input: $input, condition: $condition) {
    id
    type
    parentId
    teacherId
    studentId
    classId
    parentName
    teacherName
    studentName
    className
    lastMessageText
    lastMessageAt
    messages {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteConversationMutationVariables,
  APITypes.DeleteConversationMutation
>;
export const createMessage = /* GraphQL */ `mutation CreateMessage(
  $input: CreateMessageInput!
  $condition: ModelMessageConditionInput
) {
  createMessage(input: $input, condition: $condition) {
    id
    conversationId
    senderId
    senderType
    senderName
    body
    createdAt
    conversation {
      id
      type
      parentId
      teacherId
      studentId
      classId
      parentName
      teacherName
      studentName
      className
      lastMessageText
      lastMessageAt
      createdAt
      updatedAt
      __typename
    }
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateMessageMutationVariables,
  APITypes.CreateMessageMutation
>;
export const updateMessage = /* GraphQL */ `mutation UpdateMessage(
  $input: UpdateMessageInput!
  $condition: ModelMessageConditionInput
) {
  updateMessage(input: $input, condition: $condition) {
    id
    conversationId
    senderId
    senderType
    senderName
    body
    createdAt
    conversation {
      id
      type
      parentId
      teacherId
      studentId
      classId
      parentName
      teacherName
      studentName
      className
      lastMessageText
      lastMessageAt
      createdAt
      updatedAt
      __typename
    }
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateMessageMutationVariables,
  APITypes.UpdateMessageMutation
>;
export const deleteMessage = /* GraphQL */ `mutation DeleteMessage(
  $input: DeleteMessageInput!
  $condition: ModelMessageConditionInput
) {
  deleteMessage(input: $input, condition: $condition) {
    id
    conversationId
    senderId
    senderType
    senderName
    body
    createdAt
    conversation {
      id
      type
      parentId
      teacherId
      studentId
      classId
      parentName
      teacherName
      studentName
      className
      lastMessageText
      lastMessageAt
      createdAt
      updatedAt
      __typename
    }
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteMessageMutationVariables,
  APITypes.DeleteMessageMutation
>;
export const createSchool = /* GraphQL */ `mutation CreateSchool(
  $input: CreateSchoolInput!
  $condition: ModelSchoolConditionInput
) {
  createSchool(input: $input, condition: $condition) {
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
    incidents {
      nextToken
      __typename
    }
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
    incidents {
      nextToken
      __typename
    }
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
    incidents {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteSchoolMutationVariables,
  APITypes.DeleteSchoolMutation
>;
export const createParent = /* GraphQL */ `mutation CreateParent(
  $input: CreateParentInput!
  $condition: ModelParentConditionInput
) {
  createParent(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateParentMutationVariables,
  APITypes.CreateParentMutation
>;
export const updateParent = /* GraphQL */ `mutation UpdateParent(
  $input: UpdateParentInput!
  $condition: ModelParentConditionInput
) {
  updateParent(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateParentMutationVariables,
  APITypes.UpdateParentMutation
>;
export const deleteParent = /* GraphQL */ `mutation DeleteParent(
  $input: DeleteParentInput!
  $condition: ModelParentConditionInput
) {
  deleteParent(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteParentMutationVariables,
  APITypes.DeleteParentMutation
>;
export const updateStudent = /* GraphQL */ `mutation UpdateStudent(
  $input: UpdateStudentInput!
  $condition: ModelStudentConditionInput
) {
  updateStudent(input: $input, condition: $condition) {
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
    attendances {
      nextToken
      __typename
    }
    incidents {
      nextToken
      __typename
    }
    medicalRecord {
      id
      studentId
      allergies
      medications
      conditions
      emergencyNotes
      createdAt
      updatedAt
      __typename
    }
    createdAt
    updatedAt
    schoolStudentsId
    studentMedicalRecordId
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateStudentMutationVariables,
  APITypes.UpdateStudentMutation
>;
export const createParentStudents = /* GraphQL */ `mutation CreateParentStudents(
  $input: CreateParentStudentsInput!
  $condition: ModelParentStudentsConditionInput
) {
  createParentStudents(input: $input, condition: $condition) {
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
      studentMedicalRecordId
      __typename
    }
    createdAt
    updatedAt
    owner
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateParentStudentsMutationVariables,
  APITypes.CreateParentStudentsMutation
>;
export const updateParentStudents = /* GraphQL */ `mutation UpdateParentStudents(
  $input: UpdateParentStudentsInput!
  $condition: ModelParentStudentsConditionInput
) {
  updateParentStudents(input: $input, condition: $condition) {
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
      studentMedicalRecordId
      __typename
    }
    createdAt
    updatedAt
    owner
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateParentStudentsMutationVariables,
  APITypes.UpdateParentStudentsMutation
>;
export const deleteParentStudents = /* GraphQL */ `mutation DeleteParentStudents(
  $input: DeleteParentStudentsInput!
  $condition: ModelParentStudentsConditionInput
) {
  deleteParentStudents(input: $input, condition: $condition) {
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
      studentMedicalRecordId
      __typename
    }
    createdAt
    updatedAt
    owner
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteParentStudentsMutationVariables,
  APITypes.DeleteParentStudentsMutation
>;
