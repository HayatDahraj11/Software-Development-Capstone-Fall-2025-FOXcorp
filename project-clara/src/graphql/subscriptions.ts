/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateTeacher = /* GraphQL */ `subscription OnCreateTeacher($filter: ModelSubscriptionTeacherFilterInput) {
  onCreateTeacher(filter: $filter) {
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
    teacherNotes {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateTeacherSubscriptionVariables,
  APITypes.OnCreateTeacherSubscription
>;
export const onUpdateTeacher = /* GraphQL */ `subscription OnUpdateTeacher($filter: ModelSubscriptionTeacherFilterInput) {
  onUpdateTeacher(filter: $filter) {
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
    teacherNotes {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateTeacherSubscriptionVariables,
  APITypes.OnUpdateTeacherSubscription
>;
export const onDeleteTeacher = /* GraphQL */ `subscription OnDeleteTeacher($filter: ModelSubscriptionTeacherFilterInput) {
  onDeleteTeacher(filter: $filter) {
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
    teacherNotes {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteTeacherSubscriptionVariables,
  APITypes.OnDeleteTeacherSubscription
>;
export const onCreateClass = /* GraphQL */ `subscription OnCreateClass($filter: ModelSubscriptionClassFilterInput) {
  onCreateClass(filter: $filter) {
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
    teacherNotes {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateClassSubscriptionVariables,
  APITypes.OnCreateClassSubscription
>;
export const onUpdateClass = /* GraphQL */ `subscription OnUpdateClass($filter: ModelSubscriptionClassFilterInput) {
  onUpdateClass(filter: $filter) {
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
    teacherNotes {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateClassSubscriptionVariables,
  APITypes.OnUpdateClassSubscription
>;
export const onDeleteClass = /* GraphQL */ `subscription OnDeleteClass($filter: ModelSubscriptionClassFilterInput) {
  onDeleteClass(filter: $filter) {
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
    teacherNotes {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteClassSubscriptionVariables,
  APITypes.OnDeleteClassSubscription
>;
export const onCreateSchedule = /* GraphQL */ `subscription OnCreateSchedule($filter: ModelSubscriptionScheduleFilterInput) {
  onCreateSchedule(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateScheduleSubscriptionVariables,
  APITypes.OnCreateScheduleSubscription
>;
export const onUpdateSchedule = /* GraphQL */ `subscription OnUpdateSchedule($filter: ModelSubscriptionScheduleFilterInput) {
  onUpdateSchedule(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateScheduleSubscriptionVariables,
  APITypes.OnUpdateScheduleSubscription
>;
export const onDeleteSchedule = /* GraphQL */ `subscription OnDeleteSchedule($filter: ModelSubscriptionScheduleFilterInput) {
  onDeleteSchedule(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteScheduleSubscriptionVariables,
  APITypes.OnDeleteScheduleSubscription
>;
export const onCreateEnrollment = /* GraphQL */ `subscription OnCreateEnrollment(
  $filter: ModelSubscriptionEnrollmentFilterInput
) {
  onCreateEnrollment(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateEnrollmentSubscriptionVariables,
  APITypes.OnCreateEnrollmentSubscription
>;
export const onUpdateEnrollment = /* GraphQL */ `subscription OnUpdateEnrollment(
  $filter: ModelSubscriptionEnrollmentFilterInput
) {
  onUpdateEnrollment(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateEnrollmentSubscriptionVariables,
  APITypes.OnUpdateEnrollmentSubscription
>;
export const onDeleteEnrollment = /* GraphQL */ `subscription OnDeleteEnrollment(
  $filter: ModelSubscriptionEnrollmentFilterInput
) {
  onDeleteEnrollment(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteEnrollmentSubscriptionVariables,
  APITypes.OnDeleteEnrollmentSubscription
>;
export const onCreateAttendance = /* GraphQL */ `subscription OnCreateAttendance(
  $filter: ModelSubscriptionAttendanceFilterInput
) {
  onCreateAttendance(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateAttendanceSubscriptionVariables,
  APITypes.OnCreateAttendanceSubscription
>;
export const onUpdateAttendance = /* GraphQL */ `subscription OnUpdateAttendance(
  $filter: ModelSubscriptionAttendanceFilterInput
) {
  onUpdateAttendance(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateAttendanceSubscriptionVariables,
  APITypes.OnUpdateAttendanceSubscription
>;
export const onDeleteAttendance = /* GraphQL */ `subscription OnDeleteAttendance(
  $filter: ModelSubscriptionAttendanceFilterInput
) {
  onDeleteAttendance(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteAttendanceSubscriptionVariables,
  APITypes.OnDeleteAttendanceSubscription
>;
export const onCreateAnnouncement = /* GraphQL */ `subscription OnCreateAnnouncement(
  $filter: ModelSubscriptionAnnouncementFilterInput
) {
  onCreateAnnouncement(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateAnnouncementSubscriptionVariables,
  APITypes.OnCreateAnnouncementSubscription
>;
export const onUpdateAnnouncement = /* GraphQL */ `subscription OnUpdateAnnouncement(
  $filter: ModelSubscriptionAnnouncementFilterInput
) {
  onUpdateAnnouncement(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateAnnouncementSubscriptionVariables,
  APITypes.OnUpdateAnnouncementSubscription
>;
export const onDeleteAnnouncement = /* GraphQL */ `subscription OnDeleteAnnouncement(
  $filter: ModelSubscriptionAnnouncementFilterInput
) {
  onDeleteAnnouncement(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteAnnouncementSubscriptionVariables,
  APITypes.OnDeleteAnnouncementSubscription
>;
export const onCreateEmergencyNotification = /* GraphQL */ `subscription OnCreateEmergencyNotification(
  $filter: ModelSubscriptionEmergencyNotificationFilterInput
) {
  onCreateEmergencyNotification(filter: $filter) {
    id
    title
    message
    type
    schoolId
    classId
    status
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateEmergencyNotificationSubscriptionVariables,
  APITypes.OnCreateEmergencyNotificationSubscription
>;
export const onUpdateEmergencyNotification = /* GraphQL */ `subscription OnUpdateEmergencyNotification(
  $filter: ModelSubscriptionEmergencyNotificationFilterInput
) {
  onUpdateEmergencyNotification(filter: $filter) {
    id
    title
    message
    type
    schoolId
    classId
    status
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateEmergencyNotificationSubscriptionVariables,
  APITypes.OnUpdateEmergencyNotificationSubscription
>;
export const onDeleteEmergencyNotification = /* GraphQL */ `subscription OnDeleteEmergencyNotification(
  $filter: ModelSubscriptionEmergencyNotificationFilterInput
) {
  onDeleteEmergencyNotification(filter: $filter) {
    id
    title
    message
    type
    schoolId
    classId
    status
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteEmergencyNotificationSubscriptionVariables,
  APITypes.OnDeleteEmergencyNotificationSubscription
>;
export const onCreateMedicalRecord = /* GraphQL */ `subscription OnCreateMedicalRecord(
  $filter: ModelSubscriptionMedicalRecordFilterInput
) {
  onCreateMedicalRecord(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateMedicalRecordSubscriptionVariables,
  APITypes.OnCreateMedicalRecordSubscription
>;
export const onUpdateMedicalRecord = /* GraphQL */ `subscription OnUpdateMedicalRecord(
  $filter: ModelSubscriptionMedicalRecordFilterInput
) {
  onUpdateMedicalRecord(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateMedicalRecordSubscriptionVariables,
  APITypes.OnUpdateMedicalRecordSubscription
>;
export const onDeleteMedicalRecord = /* GraphQL */ `subscription OnDeleteMedicalRecord(
  $filter: ModelSubscriptionMedicalRecordFilterInput
) {
  onDeleteMedicalRecord(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteMedicalRecordSubscriptionVariables,
  APITypes.OnDeleteMedicalRecordSubscription
>;
export const onCreateTeacherNote = /* GraphQL */ `subscription OnCreateTeacherNote(
  $filter: ModelSubscriptionTeacherNoteFilterInput
) {
  onCreateTeacherNote(filter: $filter) {
    id
    teacherId
    studentId
    classId
    title
    body
    category
    createdAt
    updatedAt
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
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateTeacherNoteSubscriptionVariables,
  APITypes.OnCreateTeacherNoteSubscription
>;
export const onUpdateTeacherNote = /* GraphQL */ `subscription OnUpdateTeacherNote(
  $filter: ModelSubscriptionTeacherNoteFilterInput
) {
  onUpdateTeacherNote(filter: $filter) {
    id
    teacherId
    studentId
    classId
    title
    body
    category
    createdAt
    updatedAt
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
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateTeacherNoteSubscriptionVariables,
  APITypes.OnUpdateTeacherNoteSubscription
>;
export const onDeleteTeacherNote = /* GraphQL */ `subscription OnDeleteTeacherNote(
  $filter: ModelSubscriptionTeacherNoteFilterInput
) {
  onDeleteTeacherNote(filter: $filter) {
    id
    teacherId
    studentId
    classId
    title
    body
    category
    createdAt
    updatedAt
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
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteTeacherNoteSubscriptionVariables,
  APITypes.OnDeleteTeacherNoteSubscription
>;
export const onCreateIncident = /* GraphQL */ `subscription OnCreateIncident($filter: ModelSubscriptionIncidentFilterInput) {
  onCreateIncident(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateIncidentSubscriptionVariables,
  APITypes.OnCreateIncidentSubscription
>;
export const onUpdateIncident = /* GraphQL */ `subscription OnUpdateIncident($filter: ModelSubscriptionIncidentFilterInput) {
  onUpdateIncident(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateIncidentSubscriptionVariables,
  APITypes.OnUpdateIncidentSubscription
>;
export const onDeleteIncident = /* GraphQL */ `subscription OnDeleteIncident($filter: ModelSubscriptionIncidentFilterInput) {
  onDeleteIncident(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteIncidentSubscriptionVariables,
  APITypes.OnDeleteIncidentSubscription
>;
export const onCreateConversation = /* GraphQL */ `subscription OnCreateConversation(
  $filter: ModelSubscriptionConversationFilterInput
) {
  onCreateConversation(filter: $filter) {
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
    parentLastReadAt
    teacherLastReadAt
    messages {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateConversationSubscriptionVariables,
  APITypes.OnCreateConversationSubscription
>;
export const onUpdateConversation = /* GraphQL */ `subscription OnUpdateConversation(
  $filter: ModelSubscriptionConversationFilterInput
) {
  onUpdateConversation(filter: $filter) {
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
    parentLastReadAt
    teacherLastReadAt
    messages {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateConversationSubscriptionVariables,
  APITypes.OnUpdateConversationSubscription
>;
export const onDeleteConversation = /* GraphQL */ `subscription OnDeleteConversation(
  $filter: ModelSubscriptionConversationFilterInput
) {
  onDeleteConversation(filter: $filter) {
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
    parentLastReadAt
    teacherLastReadAt
    messages {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteConversationSubscriptionVariables,
  APITypes.OnDeleteConversationSubscription
>;
export const onCreateMessage = /* GraphQL */ `subscription OnCreateMessage($filter: ModelSubscriptionMessageFilterInput) {
  onCreateMessage(filter: $filter) {
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
      parentLastReadAt
      teacherLastReadAt
      createdAt
      updatedAt
      __typename
    }
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateMessageSubscriptionVariables,
  APITypes.OnCreateMessageSubscription
>;
export const onUpdateMessage = /* GraphQL */ `subscription OnUpdateMessage($filter: ModelSubscriptionMessageFilterInput) {
  onUpdateMessage(filter: $filter) {
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
      parentLastReadAt
      teacherLastReadAt
      createdAt
      updatedAt
      __typename
    }
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateMessageSubscriptionVariables,
  APITypes.OnUpdateMessageSubscription
>;
export const onDeleteMessage = /* GraphQL */ `subscription OnDeleteMessage($filter: ModelSubscriptionMessageFilterInput) {
  onDeleteMessage(filter: $filter) {
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
      parentLastReadAt
      teacherLastReadAt
      createdAt
      updatedAt
      __typename
    }
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteMessageSubscriptionVariables,
  APITypes.OnDeleteMessageSubscription
>;
export const onCreatePushToken = /* GraphQL */ `subscription OnCreatePushToken($filter: ModelSubscriptionPushTokenFilterInput) {
  onCreatePushToken(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreatePushTokenSubscriptionVariables,
  APITypes.OnCreatePushTokenSubscription
>;
export const onUpdatePushToken = /* GraphQL */ `subscription OnUpdatePushToken($filter: ModelSubscriptionPushTokenFilterInput) {
  onUpdatePushToken(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdatePushTokenSubscriptionVariables,
  APITypes.OnUpdatePushTokenSubscription
>;
export const onDeletePushToken = /* GraphQL */ `subscription OnDeletePushToken($filter: ModelSubscriptionPushTokenFilterInput) {
  onDeletePushToken(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeletePushTokenSubscriptionVariables,
  APITypes.OnDeletePushTokenSubscription
>;
export const onCreateSchool = /* GraphQL */ `subscription OnCreateSchool($filter: ModelSubscriptionSchoolFilterInput) {
  onCreateSchool(filter: $filter) {
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
    teacherNotes {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    schoolStudentsId
    studentMedicalRecordId
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
    teacherNotes {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    schoolStudentsId
    studentMedicalRecordId
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
    teacherNotes {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    schoolStudentsId
    studentMedicalRecordId
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
      studentMedicalRecordId
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
      studentMedicalRecordId
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
      studentMedicalRecordId
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
