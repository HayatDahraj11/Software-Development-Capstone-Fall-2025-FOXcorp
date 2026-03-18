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
    incidents {
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
    attendances {
      nextToken
      __typename
    }
    incidents {
      nextToken
      __typename
    }
    schedules {
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
export const getSchedule = /* GraphQL */ `query GetSchedule($id: ID!) {
  getSchedule(id: $id) {
    id
    classId
    class {
      id
      name
      teacherId
      schoolId
      createdAt
      updatedAt
      __typename
    }
    dayOfWeek
    startTime
    endTime
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetScheduleQueryVariables,
  APITypes.GetScheduleQuery
>;
export const listSchedules = /* GraphQL */ `query ListSchedules(
  $filter: ModelScheduleFilterInput
  $limit: Int
  $nextToken: String
) {
  listSchedules(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      classId
      dayOfWeek
      startTime
      endTime
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListSchedulesQueryVariables,
  APITypes.ListSchedulesQuery
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
export const getAttendance = /* GraphQL */ `query GetAttendance($id: ID!) {
  getAttendance(id: $id) {
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
    checkInTime
    updatedAt
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
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetAttendanceQueryVariables,
  APITypes.GetAttendanceQuery
>;
export const listAttendances = /* GraphQL */ `query ListAttendances(
  $filter: ModelAttendanceFilterInput
  $limit: Int
  $nextToken: String
) {
  listAttendances(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      studentId
      classId
      date
      status
      checkInTime
      updatedAt
      createdAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListAttendancesQueryVariables,
  APITypes.ListAttendancesQuery
>;
export const getAnnouncement = /* GraphQL */ `query GetAnnouncement($id: ID!) {
  getAnnouncement(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetAnnouncementQueryVariables,
  APITypes.GetAnnouncementQuery
>;
export const listAnnouncements = /* GraphQL */ `query ListAnnouncements(
  $filter: ModelAnnouncementFilterInput
  $limit: Int
  $nextToken: String
) {
  listAnnouncements(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListAnnouncementsQueryVariables,
  APITypes.ListAnnouncementsQuery
>;
export const getMedicalRecord = /* GraphQL */ `query GetMedicalRecord($id: ID!) {
  getMedicalRecord(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetMedicalRecordQueryVariables,
  APITypes.GetMedicalRecordQuery
>;
export const listMedicalRecords = /* GraphQL */ `query ListMedicalRecords(
  $filter: ModelMedicalRecordFilterInput
  $limit: Int
  $nextToken: String
) {
  listMedicalRecords(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListMedicalRecordsQueryVariables,
  APITypes.ListMedicalRecordsQuery
>;
export const getIncident = /* GraphQL */ `query GetIncident($id: ID!) {
  getIncident(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetIncidentQueryVariables,
  APITypes.GetIncidentQuery
>;
export const listIncidents = /* GraphQL */ `query ListIncidents(
  $filter: ModelIncidentFilterInput
  $limit: Int
  $nextToken: String
) {
  listIncidents(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      description
      severity
      date
      teacherId
      studentId
      classId
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
  APITypes.ListIncidentsQueryVariables,
  APITypes.ListIncidentsQuery
>;
export const getConversation = /* GraphQL */ `query GetConversation($id: ID!) {
  getConversation(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetConversationQueryVariables,
  APITypes.GetConversationQuery
>;
export const listConversations = /* GraphQL */ `query ListConversations(
  $filter: ModelConversationFilterInput
  $limit: Int
  $nextToken: String
) {
  listConversations(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListConversationsQueryVariables,
  APITypes.ListConversationsQuery
>;
export const getMessage = /* GraphQL */ `query GetMessage($id: ID!) {
  getMessage(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetMessageQueryVariables,
  APITypes.GetMessageQuery
>;
export const listMessages = /* GraphQL */ `query ListMessages(
  $filter: ModelMessageFilterInput
  $limit: Int
  $nextToken: String
) {
  listMessages(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      conversationId
      senderId
      senderType
      senderName
      body
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListMessagesQueryVariables,
  APITypes.ListMessagesQuery
>;
export const getPushToken = /* GraphQL */ `query GetPushToken($id: ID!) {
  getPushToken(id: $id) {
    id
    userId
    userType
    token
    platform
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetPushTokenQueryVariables,
  APITypes.GetPushTokenQuery
>;
export const listPushTokens = /* GraphQL */ `query ListPushTokens(
  $filter: ModelPushTokenFilterInput
  $limit: Int
  $nextToken: String
) {
  listPushTokens(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      userId
      userType
      token
      platform
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPushTokensQueryVariables,
  APITypes.ListPushTokensQuery
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
export const schedulesByClassId = /* GraphQL */ `query SchedulesByClassId(
  $classId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelScheduleFilterInput
  $limit: Int
  $nextToken: String
) {
  schedulesByClassId(
    classId: $classId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      classId
      dayOfWeek
      startTime
      endTime
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SchedulesByClassIdQueryVariables,
  APITypes.SchedulesByClassIdQuery
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
export const attendancesByStudentId = /* GraphQL */ `query AttendancesByStudentId(
  $studentId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelAttendanceFilterInput
  $limit: Int
  $nextToken: String
) {
  attendancesByStudentId(
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
      date
      status
      checkInTime
      updatedAt
      createdAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.AttendancesByStudentIdQueryVariables,
  APITypes.AttendancesByStudentIdQuery
>;
export const attendancesByClassId = /* GraphQL */ `query AttendancesByClassId(
  $classId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelAttendanceFilterInput
  $limit: Int
  $nextToken: String
) {
  attendancesByClassId(
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
      date
      status
      checkInTime
      updatedAt
      createdAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.AttendancesByClassIdQueryVariables,
  APITypes.AttendancesByClassIdQuery
>;
export const announcementsBySchoolId = /* GraphQL */ `query AnnouncementsBySchoolId(
  $schoolId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelAnnouncementFilterInput
  $limit: Int
  $nextToken: String
) {
  announcementsBySchoolId(
    schoolId: $schoolId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.AnnouncementsBySchoolIdQueryVariables,
  APITypes.AnnouncementsBySchoolIdQuery
>;
export const announcementsByClassId = /* GraphQL */ `query AnnouncementsByClassId(
  $classId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelAnnouncementFilterInput
  $limit: Int
  $nextToken: String
) {
  announcementsByClassId(
    classId: $classId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.AnnouncementsByClassIdQueryVariables,
  APITypes.AnnouncementsByClassIdQuery
>;
export const medicalRecordsByStudentId = /* GraphQL */ `query MedicalRecordsByStudentId(
  $studentId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelMedicalRecordFilterInput
  $limit: Int
  $nextToken: String
) {
  medicalRecordsByStudentId(
    studentId: $studentId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.MedicalRecordsByStudentIdQueryVariables,
  APITypes.MedicalRecordsByStudentIdQuery
>;
export const incidentsByTeacherId = /* GraphQL */ `query IncidentsByTeacherId(
  $teacherId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelIncidentFilterInput
  $limit: Int
  $nextToken: String
) {
  incidentsByTeacherId(
    teacherId: $teacherId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      description
      severity
      date
      teacherId
      studentId
      classId
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
  APITypes.IncidentsByTeacherIdQueryVariables,
  APITypes.IncidentsByTeacherIdQuery
>;
export const incidentsByStudentId = /* GraphQL */ `query IncidentsByStudentId(
  $studentId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelIncidentFilterInput
  $limit: Int
  $nextToken: String
) {
  incidentsByStudentId(
    studentId: $studentId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      description
      severity
      date
      teacherId
      studentId
      classId
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
  APITypes.IncidentsByStudentIdQueryVariables,
  APITypes.IncidentsByStudentIdQuery
>;
export const incidentsByClassId = /* GraphQL */ `query IncidentsByClassId(
  $classId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelIncidentFilterInput
  $limit: Int
  $nextToken: String
) {
  incidentsByClassId(
    classId: $classId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      description
      severity
      date
      teacherId
      studentId
      classId
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
  APITypes.IncidentsByClassIdQueryVariables,
  APITypes.IncidentsByClassIdQuery
>;
export const incidentsBySchoolId = /* GraphQL */ `query IncidentsBySchoolId(
  $schoolId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelIncidentFilterInput
  $limit: Int
  $nextToken: String
) {
  incidentsBySchoolId(
    schoolId: $schoolId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      description
      severity
      date
      teacherId
      studentId
      classId
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
  APITypes.IncidentsBySchoolIdQueryVariables,
  APITypes.IncidentsBySchoolIdQuery
>;
export const conversationsByParentId = /* GraphQL */ `query ConversationsByParentId(
  $parentId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelConversationFilterInput
  $limit: Int
  $nextToken: String
) {
  conversationsByParentId(
    parentId: $parentId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ConversationsByParentIdQueryVariables,
  APITypes.ConversationsByParentIdQuery
>;
export const conversationsByTeacherId = /* GraphQL */ `query ConversationsByTeacherId(
  $teacherId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelConversationFilterInput
  $limit: Int
  $nextToken: String
) {
  conversationsByTeacherId(
    teacherId: $teacherId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ConversationsByTeacherIdQueryVariables,
  APITypes.ConversationsByTeacherIdQuery
>;
export const conversationsByStudentId = /* GraphQL */ `query ConversationsByStudentId(
  $studentId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelConversationFilterInput
  $limit: Int
  $nextToken: String
) {
  conversationsByStudentId(
    studentId: $studentId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ConversationsByStudentIdQueryVariables,
  APITypes.ConversationsByStudentIdQuery
>;
export const conversationsByClassId = /* GraphQL */ `query ConversationsByClassId(
  $classId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelConversationFilterInput
  $limit: Int
  $nextToken: String
) {
  conversationsByClassId(
    classId: $classId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ConversationsByClassIdQueryVariables,
  APITypes.ConversationsByClassIdQuery
>;
export const messagesByConversationIdAndCreatedAt = /* GraphQL */ `query MessagesByConversationIdAndCreatedAt(
  $conversationId: ID!
  $createdAt: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelMessageFilterInput
  $limit: Int
  $nextToken: String
) {
  messagesByConversationIdAndCreatedAt(
    conversationId: $conversationId
    createdAt: $createdAt
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      conversationId
      senderId
      senderType
      senderName
      body
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.MessagesByConversationIdAndCreatedAtQueryVariables,
  APITypes.MessagesByConversationIdAndCreatedAtQuery
>;
export const pushTokensByUserId = /* GraphQL */ `query PushTokensByUserId(
  $userId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelPushTokenFilterInput
  $limit: Int
  $nextToken: String
) {
  pushTokensByUserId(
    userId: $userId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      userId
      userType
      token
      platform
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.PushTokensByUserIdQueryVariables,
  APITypes.PushTokensByUserIdQuery
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
    incidents {
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
      studentMedicalRecordId
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
      studentMedicalRecordId
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
