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
  studentMedicalRecordId?: string | null,
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
  studentMedicalRecordId?: ModelIDInput | null,
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
  attendances?: ModelAttendanceConnection | null,
  incidents?: ModelIncidentConnection | null,
  medicalRecord?: MedicalRecord | null,
  teacherNotes?: ModelTeacherNoteConnection | null,
  createdAt: string,
  updatedAt: string,
  schoolStudentsId?: string | null,
  studentMedicalRecordId?: string | null,
};

export type School = {
  __typename: "School",
  id: string,
  name: string,
  address?: string | null,
  students?: ModelStudentConnection | null,
  teachers?: ModelTeacherConnection | null,
  classes?: ModelClassConnection | null,
  incidents?: ModelIncidentConnection | null,
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
  incidents?: ModelIncidentConnection | null,
  teacherNotes?: ModelTeacherNoteConnection | null,
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
  attendances?: ModelAttendanceConnection | null,
  incidents?: ModelIncidentConnection | null,
  schedules?: ModelScheduleConnection | null,
  teacherNotes?: ModelTeacherNoteConnection | null,
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

export type ModelAttendanceConnection = {
  __typename: "ModelAttendanceConnection",
  items:  Array<Attendance | null >,
  nextToken?: string | null,
};

export type Attendance = {
  __typename: "Attendance",
  id: string,
  studentId: string,
  classId: string,
  date: string,
  status: AttendanceStatus,
  student?: Student | null,
  checkInTime?: string | null,
  updatedAt?: string | null,
  class?: Class | null,
  createdAt: string,
};

export enum AttendanceStatus {
  PRESENT = "PRESENT",
  ABSENT = "ABSENT",
  LATE = "LATE",
}


export type ModelIncidentConnection = {
  __typename: "ModelIncidentConnection",
  items:  Array<Incident | null >,
  nextToken?: string | null,
};

export type Incident = {
  __typename: "Incident",
  id: string,
  description: string,
  severity?: string | null,
  date?: string | null,
  teacherId: string,
  studentId: string,
  classId?: string | null,
  schoolId: string,
  teacher?: Teacher | null,
  student?: Student | null,
  class?: Class | null,
  school?: School | null,
  createdAt: string,
  updatedAt: string,
};

export type ModelScheduleConnection = {
  __typename: "ModelScheduleConnection",
  items:  Array<Schedule | null >,
  nextToken?: string | null,
};

export type Schedule = {
  __typename: "Schedule",
  id: string,
  classId: string,
  class?: Class | null,
  dayOfWeek: DayOfWeek,
  startTime: string,
  endTime: string,
  createdAt: string,
  updatedAt: string,
};

export enum DayOfWeek {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
  SUNDAY = "SUNDAY",
}


export type ModelTeacherNoteConnection = {
  __typename: "ModelTeacherNoteConnection",
  items:  Array<TeacherNote | null >,
  nextToken?: string | null,
};

export type TeacherNote = {
  __typename: "TeacherNote",
  id: string,
  teacherId: string,
  studentId: string,
  classId?: string | null,
  title?: string | null,
  body: string,
  category?: string | null,
  createdAt: string,
  updatedAt: string,
  teacher?: Teacher | null,
  student?: Student | null,
  class?: Class | null,
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

export type MedicalRecord = {
  __typename: "MedicalRecord",
  id: string,
  studentId: string,
  allergies?: string | null,
  medications?: string | null,
  conditions?: string | null,
  emergencyNotes?: string | null,
  student?: Student | null,
  createdAt: string,
  updatedAt: string,
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

export type CreateScheduleInput = {
  id?: string | null,
  classId: string,
  dayOfWeek: DayOfWeek,
  startTime: string,
  endTime: string,
};

export type ModelScheduleConditionInput = {
  classId?: ModelIDInput | null,
  dayOfWeek?: ModelDayOfWeekInput | null,
  startTime?: ModelStringInput | null,
  endTime?: ModelStringInput | null,
  and?: Array< ModelScheduleConditionInput | null > | null,
  or?: Array< ModelScheduleConditionInput | null > | null,
  not?: ModelScheduleConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelDayOfWeekInput = {
  eq?: DayOfWeek | null,
  ne?: DayOfWeek | null,
};

export type UpdateScheduleInput = {
  id: string,
  classId?: string | null,
  dayOfWeek?: DayOfWeek | null,
  startTime?: string | null,
  endTime?: string | null,
};

export type DeleteScheduleInput = {
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

export type CreateAttendanceInput = {
  id?: string | null,
  studentId: string,
  classId: string,
  date: string,
  status: AttendanceStatus,
  checkInTime?: string | null,
  updatedAt?: string | null,
};

export type ModelAttendanceConditionInput = {
  studentId?: ModelIDInput | null,
  classId?: ModelIDInput | null,
  date?: ModelStringInput | null,
  status?: ModelAttendanceStatusInput | null,
  checkInTime?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelAttendanceConditionInput | null > | null,
  or?: Array< ModelAttendanceConditionInput | null > | null,
  not?: ModelAttendanceConditionInput | null,
  createdAt?: ModelStringInput | null,
};

export type ModelAttendanceStatusInput = {
  eq?: AttendanceStatus | null,
  ne?: AttendanceStatus | null,
};

export type UpdateAttendanceInput = {
  id: string,
  studentId?: string | null,
  classId?: string | null,
  date?: string | null,
  status?: AttendanceStatus | null,
  checkInTime?: string | null,
  updatedAt?: string | null,
};

export type DeleteAttendanceInput = {
  id: string,
};

export type CreateAnnouncementInput = {
  id?: string | null,
  title: string,
  body: string,
  createdAt?: string | null,
  createdBy: string,
  schoolId?: string | null,
  classId?: string | null,
};

export type ModelAnnouncementConditionInput = {
  title?: ModelStringInput | null,
  body?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  createdBy?: ModelIDInput | null,
  schoolId?: ModelIDInput | null,
  classId?: ModelIDInput | null,
  and?: Array< ModelAnnouncementConditionInput | null > | null,
  or?: Array< ModelAnnouncementConditionInput | null > | null,
  not?: ModelAnnouncementConditionInput | null,
  updatedAt?: ModelStringInput | null,
};

export type Announcement = {
  __typename: "Announcement",
  id: string,
  title: string,
  body: string,
  createdAt: string,
  createdBy: string,
  schoolId?: string | null,
  classId?: string | null,
  updatedAt: string,
};

export type UpdateAnnouncementInput = {
  id: string,
  title?: string | null,
  body?: string | null,
  createdAt?: string | null,
  createdBy?: string | null,
  schoolId?: string | null,
  classId?: string | null,
};

export type DeleteAnnouncementInput = {
  id: string,
};

export type CreateEmergencyNotificationInput = {
  id?: string | null,
  title: string,
  message: string,
  type: string,
  schoolId?: string | null,
  classId?: string | null,
  status?: string | null,
  createdAt?: string | null,
};

export type ModelEmergencyNotificationConditionInput = {
  title?: ModelStringInput | null,
  message?: ModelStringInput | null,
  type?: ModelStringInput | null,
  schoolId?: ModelIDInput | null,
  classId?: ModelIDInput | null,
  status?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  and?: Array< ModelEmergencyNotificationConditionInput | null > | null,
  or?: Array< ModelEmergencyNotificationConditionInput | null > | null,
  not?: ModelEmergencyNotificationConditionInput | null,
  updatedAt?: ModelStringInput | null,
};

export type EmergencyNotification = {
  __typename: "EmergencyNotification",
  id: string,
  title: string,
  message: string,
  type: string,
  schoolId?: string | null,
  classId?: string | null,
  status?: string | null,
  createdAt: string,
  updatedAt: string,
};

export type UpdateEmergencyNotificationInput = {
  id: string,
  title?: string | null,
  message?: string | null,
  type?: string | null,
  schoolId?: string | null,
  classId?: string | null,
  status?: string | null,
  createdAt?: string | null,
};

export type DeleteEmergencyNotificationInput = {
  id: string,
};

export type CreateMedicalRecordInput = {
  id?: string | null,
  studentId: string,
  allergies?: string | null,
  medications?: string | null,
  conditions?: string | null,
  emergencyNotes?: string | null,
};

export type ModelMedicalRecordConditionInput = {
  studentId?: ModelIDInput | null,
  allergies?: ModelStringInput | null,
  medications?: ModelStringInput | null,
  conditions?: ModelStringInput | null,
  emergencyNotes?: ModelStringInput | null,
  and?: Array< ModelMedicalRecordConditionInput | null > | null,
  or?: Array< ModelMedicalRecordConditionInput | null > | null,
  not?: ModelMedicalRecordConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type UpdateMedicalRecordInput = {
  id: string,
  studentId?: string | null,
  allergies?: string | null,
  medications?: string | null,
  conditions?: string | null,
  emergencyNotes?: string | null,
};

export type DeleteMedicalRecordInput = {
  id: string,
};

export type CreateTeacherNoteInput = {
  id?: string | null,
  teacherId: string,
  studentId: string,
  classId?: string | null,
  title?: string | null,
  body: string,
  category?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type ModelTeacherNoteConditionInput = {
  teacherId?: ModelIDInput | null,
  studentId?: ModelIDInput | null,
  classId?: ModelIDInput | null,
  title?: ModelStringInput | null,
  body?: ModelStringInput | null,
  category?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelTeacherNoteConditionInput | null > | null,
  or?: Array< ModelTeacherNoteConditionInput | null > | null,
  not?: ModelTeacherNoteConditionInput | null,
};

export type UpdateTeacherNoteInput = {
  id: string,
  teacherId?: string | null,
  studentId?: string | null,
  classId?: string | null,
  title?: string | null,
  body?: string | null,
  category?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type DeleteTeacherNoteInput = {
  id: string,
};

export type CreateIncidentInput = {
  id?: string | null,
  description: string,
  severity?: string | null,
  date?: string | null,
  teacherId: string,
  studentId: string,
  classId?: string | null,
  schoolId: string,
};

export type ModelIncidentConditionInput = {
  description?: ModelStringInput | null,
  severity?: ModelStringInput | null,
  date?: ModelStringInput | null,
  teacherId?: ModelIDInput | null,
  studentId?: ModelIDInput | null,
  classId?: ModelIDInput | null,
  schoolId?: ModelIDInput | null,
  and?: Array< ModelIncidentConditionInput | null > | null,
  or?: Array< ModelIncidentConditionInput | null > | null,
  not?: ModelIncidentConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type UpdateIncidentInput = {
  id: string,
  description?: string | null,
  severity?: string | null,
  date?: string | null,
  teacherId?: string | null,
  studentId?: string | null,
  classId?: string | null,
  schoolId?: string | null,
};

export type DeleteIncidentInput = {
  id: string,
};

export type CreateConversationInput = {
  id?: string | null,
  type: ConversationType,
  parentId?: string | null,
  teacherId: string,
  studentId?: string | null,
  classId?: string | null,
  parentName?: string | null,
  teacherName?: string | null,
  studentName?: string | null,
  className?: string | null,
  lastMessageText?: string | null,
  lastMessageAt?: string | null,
};

export enum ConversationType {
  DIRECT = "DIRECT",
  GROUP = "GROUP",
}


export type ModelConversationConditionInput = {
  type?: ModelConversationTypeInput | null,
  parentId?: ModelIDInput | null,
  teacherId?: ModelIDInput | null,
  studentId?: ModelIDInput | null,
  classId?: ModelIDInput | null,
  parentName?: ModelStringInput | null,
  teacherName?: ModelStringInput | null,
  studentName?: ModelStringInput | null,
  className?: ModelStringInput | null,
  lastMessageText?: ModelStringInput | null,
  lastMessageAt?: ModelStringInput | null,
  and?: Array< ModelConversationConditionInput | null > | null,
  or?: Array< ModelConversationConditionInput | null > | null,
  not?: ModelConversationConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelConversationTypeInput = {
  eq?: ConversationType | null,
  ne?: ConversationType | null,
};

export type Conversation = {
  __typename: "Conversation",
  id: string,
  type: ConversationType,
  parentId?: string | null,
  teacherId: string,
  studentId?: string | null,
  classId?: string | null,
  parentName?: string | null,
  teacherName?: string | null,
  studentName?: string | null,
  className?: string | null,
  lastMessageText?: string | null,
  lastMessageAt?: string | null,
  messages?: ModelMessageConnection | null,
  createdAt: string,
  updatedAt: string,
};

export type ModelMessageConnection = {
  __typename: "ModelMessageConnection",
  items:  Array<Message | null >,
  nextToken?: string | null,
};

export type Message = {
  __typename: "Message",
  id: string,
  conversationId: string,
  senderId: string,
  senderType: SenderType,
  senderName: string,
  body: string,
  createdAt: string,
  conversation?: Conversation | null,
  updatedAt: string,
};

export enum SenderType {
  PARENT = "PARENT",
  TEACHER = "TEACHER",
}


export type UpdateConversationInput = {
  id: string,
  type?: ConversationType | null,
  parentId?: string | null,
  teacherId?: string | null,
  studentId?: string | null,
  classId?: string | null,
  parentName?: string | null,
  teacherName?: string | null,
  studentName?: string | null,
  className?: string | null,
  lastMessageText?: string | null,
  lastMessageAt?: string | null,
};

export type DeleteConversationInput = {
  id: string,
};

export type CreateMessageInput = {
  id?: string | null,
  conversationId: string,
  senderId: string,
  senderType: SenderType,
  senderName: string,
  body: string,
  createdAt?: string | null,
};

export type ModelMessageConditionInput = {
  conversationId?: ModelIDInput | null,
  senderId?: ModelIDInput | null,
  senderType?: ModelSenderTypeInput | null,
  senderName?: ModelStringInput | null,
  body?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  and?: Array< ModelMessageConditionInput | null > | null,
  or?: Array< ModelMessageConditionInput | null > | null,
  not?: ModelMessageConditionInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelSenderTypeInput = {
  eq?: SenderType | null,
  ne?: SenderType | null,
};

export type UpdateMessageInput = {
  id: string,
  conversationId?: string | null,
  senderId?: string | null,
  senderType?: SenderType | null,
  senderName?: string | null,
  body?: string | null,
  createdAt?: string | null,
};

export type DeleteMessageInput = {
  id: string,
};

export type CreatePushTokenInput = {
  id?: string | null,
  userId: string,
  userType: SenderType,
  token: string,
  platform: string,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type ModelPushTokenConditionInput = {
  userId?: ModelIDInput | null,
  userType?: ModelSenderTypeInput | null,
  token?: ModelStringInput | null,
  platform?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelPushTokenConditionInput | null > | null,
  or?: Array< ModelPushTokenConditionInput | null > | null,
  not?: ModelPushTokenConditionInput | null,
};

export type PushToken = {
  __typename: "PushToken",
  id: string,
  userId: string,
  userType: SenderType,
  token: string,
  platform: string,
  createdAt: string,
  updatedAt: string,
};

export type UpdatePushTokenInput = {
  id: string,
  userId?: string | null,
  userType?: SenderType | null,
  token?: string | null,
  platform?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type DeletePushTokenInput = {
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
  studentMedicalRecordId?: string | null,
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

export type ModelScheduleFilterInput = {
  id?: ModelIDInput | null,
  classId?: ModelIDInput | null,
  dayOfWeek?: ModelDayOfWeekInput | null,
  startTime?: ModelStringInput | null,
  endTime?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelScheduleFilterInput | null > | null,
  or?: Array< ModelScheduleFilterInput | null > | null,
  not?: ModelScheduleFilterInput | null,
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

export type ModelAttendanceFilterInput = {
  id?: ModelIDInput | null,
  studentId?: ModelIDInput | null,
  classId?: ModelIDInput | null,
  date?: ModelStringInput | null,
  status?: ModelAttendanceStatusInput | null,
  checkInTime?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  and?: Array< ModelAttendanceFilterInput | null > | null,
  or?: Array< ModelAttendanceFilterInput | null > | null,
  not?: ModelAttendanceFilterInput | null,
};

export type ModelAnnouncementFilterInput = {
  id?: ModelIDInput | null,
  title?: ModelStringInput | null,
  body?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  createdBy?: ModelIDInput | null,
  schoolId?: ModelIDInput | null,
  classId?: ModelIDInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelAnnouncementFilterInput | null > | null,
  or?: Array< ModelAnnouncementFilterInput | null > | null,
  not?: ModelAnnouncementFilterInput | null,
};

export type ModelAnnouncementConnection = {
  __typename: "ModelAnnouncementConnection",
  items:  Array<Announcement | null >,
  nextToken?: string | null,
};

export type ModelEmergencyNotificationFilterInput = {
  id?: ModelIDInput | null,
  title?: ModelStringInput | null,
  message?: ModelStringInput | null,
  type?: ModelStringInput | null,
  schoolId?: ModelIDInput | null,
  classId?: ModelIDInput | null,
  status?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelEmergencyNotificationFilterInput | null > | null,
  or?: Array< ModelEmergencyNotificationFilterInput | null > | null,
  not?: ModelEmergencyNotificationFilterInput | null,
};

export type ModelEmergencyNotificationConnection = {
  __typename: "ModelEmergencyNotificationConnection",
  items:  Array<EmergencyNotification | null >,
  nextToken?: string | null,
};

export type ModelMedicalRecordFilterInput = {
  id?: ModelIDInput | null,
  studentId?: ModelIDInput | null,
  allergies?: ModelStringInput | null,
  medications?: ModelStringInput | null,
  conditions?: ModelStringInput | null,
  emergencyNotes?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelMedicalRecordFilterInput | null > | null,
  or?: Array< ModelMedicalRecordFilterInput | null > | null,
  not?: ModelMedicalRecordFilterInput | null,
};

export type ModelMedicalRecordConnection = {
  __typename: "ModelMedicalRecordConnection",
  items:  Array<MedicalRecord | null >,
  nextToken?: string | null,
};

export type ModelTeacherNoteFilterInput = {
  id?: ModelIDInput | null,
  teacherId?: ModelIDInput | null,
  studentId?: ModelIDInput | null,
  classId?: ModelIDInput | null,
  title?: ModelStringInput | null,
  body?: ModelStringInput | null,
  category?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelTeacherNoteFilterInput | null > | null,
  or?: Array< ModelTeacherNoteFilterInput | null > | null,
  not?: ModelTeacherNoteFilterInput | null,
};

export type ModelIncidentFilterInput = {
  id?: ModelIDInput | null,
  description?: ModelStringInput | null,
  severity?: ModelStringInput | null,
  date?: ModelStringInput | null,
  teacherId?: ModelIDInput | null,
  studentId?: ModelIDInput | null,
  classId?: ModelIDInput | null,
  schoolId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelIncidentFilterInput | null > | null,
  or?: Array< ModelIncidentFilterInput | null > | null,
  not?: ModelIncidentFilterInput | null,
};

export type ModelConversationFilterInput = {
  id?: ModelIDInput | null,
  type?: ModelConversationTypeInput | null,
  parentId?: ModelIDInput | null,
  teacherId?: ModelIDInput | null,
  studentId?: ModelIDInput | null,
  classId?: ModelIDInput | null,
  parentName?: ModelStringInput | null,
  teacherName?: ModelStringInput | null,
  studentName?: ModelStringInput | null,
  className?: ModelStringInput | null,
  lastMessageText?: ModelStringInput | null,
  lastMessageAt?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelConversationFilterInput | null > | null,
  or?: Array< ModelConversationFilterInput | null > | null,
  not?: ModelConversationFilterInput | null,
};

export type ModelConversationConnection = {
  __typename: "ModelConversationConnection",
  items:  Array<Conversation | null >,
  nextToken?: string | null,
};

export type ModelMessageFilterInput = {
  id?: ModelIDInput | null,
  conversationId?: ModelIDInput | null,
  senderId?: ModelIDInput | null,
  senderType?: ModelSenderTypeInput | null,
  senderName?: ModelStringInput | null,
  body?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelMessageFilterInput | null > | null,
  or?: Array< ModelMessageFilterInput | null > | null,
  not?: ModelMessageFilterInput | null,
};

export type ModelPushTokenFilterInput = {
  id?: ModelIDInput | null,
  userId?: ModelIDInput | null,
  userType?: ModelSenderTypeInput | null,
  token?: ModelStringInput | null,
  platform?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelPushTokenFilterInput | null > | null,
  or?: Array< ModelPushTokenFilterInput | null > | null,
  not?: ModelPushTokenFilterInput | null,
};

export type ModelPushTokenConnection = {
  __typename: "ModelPushTokenConnection",
  items:  Array<PushToken | null >,
  nextToken?: string | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type ModelStringKeyConditionInput = {
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
};

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
  studentMedicalRecordId?: ModelIDInput | null,
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

export type ModelSubscriptionScheduleFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  classId?: ModelSubscriptionIDInput | null,
  dayOfWeek?: ModelSubscriptionStringInput | null,
  startTime?: ModelSubscriptionStringInput | null,
  endTime?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionScheduleFilterInput | null > | null,
  or?: Array< ModelSubscriptionScheduleFilterInput | null > | null,
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

export type ModelSubscriptionAttendanceFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  studentId?: ModelSubscriptionIDInput | null,
  classId?: ModelSubscriptionIDInput | null,
  date?: ModelSubscriptionStringInput | null,
  status?: ModelSubscriptionStringInput | null,
  checkInTime?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionAttendanceFilterInput | null > | null,
  or?: Array< ModelSubscriptionAttendanceFilterInput | null > | null,
};

export type ModelSubscriptionAnnouncementFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  title?: ModelSubscriptionStringInput | null,
  body?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  createdBy?: ModelSubscriptionIDInput | null,
  schoolId?: ModelSubscriptionIDInput | null,
  classId?: ModelSubscriptionIDInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionAnnouncementFilterInput | null > | null,
  or?: Array< ModelSubscriptionAnnouncementFilterInput | null > | null,
};

export type ModelSubscriptionEmergencyNotificationFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  title?: ModelSubscriptionStringInput | null,
  message?: ModelSubscriptionStringInput | null,
  type?: ModelSubscriptionStringInput | null,
  schoolId?: ModelSubscriptionIDInput | null,
  classId?: ModelSubscriptionIDInput | null,
  status?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionEmergencyNotificationFilterInput | null > | null,
  or?: Array< ModelSubscriptionEmergencyNotificationFilterInput | null > | null,
};

export type ModelSubscriptionMedicalRecordFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  studentId?: ModelSubscriptionIDInput | null,
  allergies?: ModelSubscriptionStringInput | null,
  medications?: ModelSubscriptionStringInput | null,
  conditions?: ModelSubscriptionStringInput | null,
  emergencyNotes?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionMedicalRecordFilterInput | null > | null,
  or?: Array< ModelSubscriptionMedicalRecordFilterInput | null > | null,
};

export type ModelSubscriptionTeacherNoteFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  teacherId?: ModelSubscriptionIDInput | null,
  studentId?: ModelSubscriptionIDInput | null,
  classId?: ModelSubscriptionIDInput | null,
  title?: ModelSubscriptionStringInput | null,
  body?: ModelSubscriptionStringInput | null,
  category?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionTeacherNoteFilterInput | null > | null,
  or?: Array< ModelSubscriptionTeacherNoteFilterInput | null > | null,
};

export type ModelSubscriptionIncidentFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  description?: ModelSubscriptionStringInput | null,
  severity?: ModelSubscriptionStringInput | null,
  date?: ModelSubscriptionStringInput | null,
  teacherId?: ModelSubscriptionIDInput | null,
  studentId?: ModelSubscriptionIDInput | null,
  classId?: ModelSubscriptionIDInput | null,
  schoolId?: ModelSubscriptionIDInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionIncidentFilterInput | null > | null,
  or?: Array< ModelSubscriptionIncidentFilterInput | null > | null,
};

export type ModelSubscriptionConversationFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  type?: ModelSubscriptionStringInput | null,
  parentId?: ModelSubscriptionIDInput | null,
  teacherId?: ModelSubscriptionIDInput | null,
  studentId?: ModelSubscriptionIDInput | null,
  classId?: ModelSubscriptionIDInput | null,
  parentName?: ModelSubscriptionStringInput | null,
  teacherName?: ModelSubscriptionStringInput | null,
  studentName?: ModelSubscriptionStringInput | null,
  className?: ModelSubscriptionStringInput | null,
  lastMessageText?: ModelSubscriptionStringInput | null,
  lastMessageAt?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionConversationFilterInput | null > | null,
  or?: Array< ModelSubscriptionConversationFilterInput | null > | null,
};

export type ModelSubscriptionMessageFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  conversationId?: ModelSubscriptionIDInput | null,
  senderId?: ModelSubscriptionIDInput | null,
  senderType?: ModelSubscriptionStringInput | null,
  senderName?: ModelSubscriptionStringInput | null,
  body?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionMessageFilterInput | null > | null,
  or?: Array< ModelSubscriptionMessageFilterInput | null > | null,
};

export type ModelSubscriptionPushTokenFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  userId?: ModelSubscriptionIDInput | null,
  userType?: ModelSubscriptionStringInput | null,
  token?: ModelSubscriptionStringInput | null,
  platform?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionPushTokenFilterInput | null > | null,
  or?: Array< ModelSubscriptionPushTokenFilterInput | null > | null,
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
  studentMedicalRecordId?: ModelSubscriptionIDInput | null,
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
    attendances?:  {
      __typename: "ModelAttendanceConnection",
      nextToken?: string | null,
    } | null,
    incidents?:  {
      __typename: "ModelIncidentConnection",
      nextToken?: string | null,
    } | null,
    medicalRecord?:  {
      __typename: "MedicalRecord",
      id: string,
      studentId: string,
      allergies?: string | null,
      medications?: string | null,
      conditions?: string | null,
      emergencyNotes?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    teacherNotes?:  {
      __typename: "ModelTeacherNoteConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    schoolStudentsId?: string | null,
    studentMedicalRecordId?: string | null,
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
    attendances?:  {
      __typename: "ModelAttendanceConnection",
      nextToken?: string | null,
    } | null,
    incidents?:  {
      __typename: "ModelIncidentConnection",
      nextToken?: string | null,
    } | null,
    medicalRecord?:  {
      __typename: "MedicalRecord",
      id: string,
      studentId: string,
      allergies?: string | null,
      medications?: string | null,
      conditions?: string | null,
      emergencyNotes?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    teacherNotes?:  {
      __typename: "ModelTeacherNoteConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    schoolStudentsId?: string | null,
    studentMedicalRecordId?: string | null,
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
    incidents?:  {
      __typename: "ModelIncidentConnection",
      nextToken?: string | null,
    } | null,
    teacherNotes?:  {
      __typename: "ModelTeacherNoteConnection",
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
    incidents?:  {
      __typename: "ModelIncidentConnection",
      nextToken?: string | null,
    } | null,
    teacherNotes?:  {
      __typename: "ModelTeacherNoteConnection",
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
    incidents?:  {
      __typename: "ModelIncidentConnection",
      nextToken?: string | null,
    } | null,
    teacherNotes?:  {
      __typename: "ModelTeacherNoteConnection",
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
    attendances?:  {
      __typename: "ModelAttendanceConnection",
      nextToken?: string | null,
    } | null,
    incidents?:  {
      __typename: "ModelIncidentConnection",
      nextToken?: string | null,
    } | null,
    schedules?:  {
      __typename: "ModelScheduleConnection",
      nextToken?: string | null,
    } | null,
    teacherNotes?:  {
      __typename: "ModelTeacherNoteConnection",
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
    attendances?:  {
      __typename: "ModelAttendanceConnection",
      nextToken?: string | null,
    } | null,
    incidents?:  {
      __typename: "ModelIncidentConnection",
      nextToken?: string | null,
    } | null,
    schedules?:  {
      __typename: "ModelScheduleConnection",
      nextToken?: string | null,
    } | null,
    teacherNotes?:  {
      __typename: "ModelTeacherNoteConnection",
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
    attendances?:  {
      __typename: "ModelAttendanceConnection",
      nextToken?: string | null,
    } | null,
    incidents?:  {
      __typename: "ModelIncidentConnection",
      nextToken?: string | null,
    } | null,
    schedules?:  {
      __typename: "ModelScheduleConnection",
      nextToken?: string | null,
    } | null,
    teacherNotes?:  {
      __typename: "ModelTeacherNoteConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateScheduleMutationVariables = {
  input: CreateScheduleInput,
  condition?: ModelScheduleConditionInput | null,
};

export type CreateScheduleMutation = {
  createSchedule?:  {
    __typename: "Schedule",
    id: string,
    classId: string,
    class?:  {
      __typename: "Class",
      id: string,
      name: string,
      teacherId: string,
      schoolId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    dayOfWeek: DayOfWeek,
    startTime: string,
    endTime: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateScheduleMutationVariables = {
  input: UpdateScheduleInput,
  condition?: ModelScheduleConditionInput | null,
};

export type UpdateScheduleMutation = {
  updateSchedule?:  {
    __typename: "Schedule",
    id: string,
    classId: string,
    class?:  {
      __typename: "Class",
      id: string,
      name: string,
      teacherId: string,
      schoolId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    dayOfWeek: DayOfWeek,
    startTime: string,
    endTime: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteScheduleMutationVariables = {
  input: DeleteScheduleInput,
  condition?: ModelScheduleConditionInput | null,
};

export type DeleteScheduleMutation = {
  deleteSchedule?:  {
    __typename: "Schedule",
    id: string,
    classId: string,
    class?:  {
      __typename: "Class",
      id: string,
      name: string,
      teacherId: string,
      schoolId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    dayOfWeek: DayOfWeek,
    startTime: string,
    endTime: string,
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
      studentMedicalRecordId?: string | null,
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
      studentMedicalRecordId?: string | null,
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
      studentMedicalRecordId?: string | null,
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

export type CreateAttendanceMutationVariables = {
  input: CreateAttendanceInput,
  condition?: ModelAttendanceConditionInput | null,
};

export type CreateAttendanceMutation = {
  createAttendance?:  {
    __typename: "Attendance",
    id: string,
    studentId: string,
    classId: string,
    date: string,
    status: AttendanceStatus,
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
      studentMedicalRecordId?: string | null,
    } | null,
    checkInTime?: string | null,
    updatedAt?: string | null,
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
  } | null,
};

export type UpdateAttendanceMutationVariables = {
  input: UpdateAttendanceInput,
  condition?: ModelAttendanceConditionInput | null,
};

export type UpdateAttendanceMutation = {
  updateAttendance?:  {
    __typename: "Attendance",
    id: string,
    studentId: string,
    classId: string,
    date: string,
    status: AttendanceStatus,
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
      studentMedicalRecordId?: string | null,
    } | null,
    checkInTime?: string | null,
    updatedAt?: string | null,
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
  } | null,
};

export type DeleteAttendanceMutationVariables = {
  input: DeleteAttendanceInput,
  condition?: ModelAttendanceConditionInput | null,
};

export type DeleteAttendanceMutation = {
  deleteAttendance?:  {
    __typename: "Attendance",
    id: string,
    studentId: string,
    classId: string,
    date: string,
    status: AttendanceStatus,
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
      studentMedicalRecordId?: string | null,
    } | null,
    checkInTime?: string | null,
    updatedAt?: string | null,
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
  } | null,
};

export type CreateAnnouncementMutationVariables = {
  input: CreateAnnouncementInput,
  condition?: ModelAnnouncementConditionInput | null,
};

export type CreateAnnouncementMutation = {
  createAnnouncement?:  {
    __typename: "Announcement",
    id: string,
    title: string,
    body: string,
    createdAt: string,
    createdBy: string,
    schoolId?: string | null,
    classId?: string | null,
    updatedAt: string,
  } | null,
};

export type UpdateAnnouncementMutationVariables = {
  input: UpdateAnnouncementInput,
  condition?: ModelAnnouncementConditionInput | null,
};

export type UpdateAnnouncementMutation = {
  updateAnnouncement?:  {
    __typename: "Announcement",
    id: string,
    title: string,
    body: string,
    createdAt: string,
    createdBy: string,
    schoolId?: string | null,
    classId?: string | null,
    updatedAt: string,
  } | null,
};

export type DeleteAnnouncementMutationVariables = {
  input: DeleteAnnouncementInput,
  condition?: ModelAnnouncementConditionInput | null,
};

export type DeleteAnnouncementMutation = {
  deleteAnnouncement?:  {
    __typename: "Announcement",
    id: string,
    title: string,
    body: string,
    createdAt: string,
    createdBy: string,
    schoolId?: string | null,
    classId?: string | null,
    updatedAt: string,
  } | null,
};

export type CreateEmergencyNotificationMutationVariables = {
  input: CreateEmergencyNotificationInput,
  condition?: ModelEmergencyNotificationConditionInput | null,
};

export type CreateEmergencyNotificationMutation = {
  createEmergencyNotification?:  {
    __typename: "EmergencyNotification",
    id: string,
    title: string,
    message: string,
    type: string,
    schoolId?: string | null,
    classId?: string | null,
    status?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateEmergencyNotificationMutationVariables = {
  input: UpdateEmergencyNotificationInput,
  condition?: ModelEmergencyNotificationConditionInput | null,
};

export type UpdateEmergencyNotificationMutation = {
  updateEmergencyNotification?:  {
    __typename: "EmergencyNotification",
    id: string,
    title: string,
    message: string,
    type: string,
    schoolId?: string | null,
    classId?: string | null,
    status?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteEmergencyNotificationMutationVariables = {
  input: DeleteEmergencyNotificationInput,
  condition?: ModelEmergencyNotificationConditionInput | null,
};

export type DeleteEmergencyNotificationMutation = {
  deleteEmergencyNotification?:  {
    __typename: "EmergencyNotification",
    id: string,
    title: string,
    message: string,
    type: string,
    schoolId?: string | null,
    classId?: string | null,
    status?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateMedicalRecordMutationVariables = {
  input: CreateMedicalRecordInput,
  condition?: ModelMedicalRecordConditionInput | null,
};

export type CreateMedicalRecordMutation = {
  createMedicalRecord?:  {
    __typename: "MedicalRecord",
    id: string,
    studentId: string,
    allergies?: string | null,
    medications?: string | null,
    conditions?: string | null,
    emergencyNotes?: string | null,
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
      studentMedicalRecordId?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateMedicalRecordMutationVariables = {
  input: UpdateMedicalRecordInput,
  condition?: ModelMedicalRecordConditionInput | null,
};

export type UpdateMedicalRecordMutation = {
  updateMedicalRecord?:  {
    __typename: "MedicalRecord",
    id: string,
    studentId: string,
    allergies?: string | null,
    medications?: string | null,
    conditions?: string | null,
    emergencyNotes?: string | null,
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
      studentMedicalRecordId?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteMedicalRecordMutationVariables = {
  input: DeleteMedicalRecordInput,
  condition?: ModelMedicalRecordConditionInput | null,
};

export type DeleteMedicalRecordMutation = {
  deleteMedicalRecord?:  {
    __typename: "MedicalRecord",
    id: string,
    studentId: string,
    allergies?: string | null,
    medications?: string | null,
    conditions?: string | null,
    emergencyNotes?: string | null,
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
      studentMedicalRecordId?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateTeacherNoteMutationVariables = {
  input: CreateTeacherNoteInput,
  condition?: ModelTeacherNoteConditionInput | null,
};

export type CreateTeacherNoteMutation = {
  createTeacherNote?:  {
    __typename: "TeacherNote",
    id: string,
    teacherId: string,
    studentId: string,
    classId?: string | null,
    title?: string | null,
    body: string,
    category?: string | null,
    createdAt: string,
    updatedAt: string,
    teacher?:  {
      __typename: "Teacher",
      id: string,
      name: string,
      cognitoUserId?: string | null,
      schoolId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
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
      studentMedicalRecordId?: string | null,
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
  } | null,
};

export type UpdateTeacherNoteMutationVariables = {
  input: UpdateTeacherNoteInput,
  condition?: ModelTeacherNoteConditionInput | null,
};

export type UpdateTeacherNoteMutation = {
  updateTeacherNote?:  {
    __typename: "TeacherNote",
    id: string,
    teacherId: string,
    studentId: string,
    classId?: string | null,
    title?: string | null,
    body: string,
    category?: string | null,
    createdAt: string,
    updatedAt: string,
    teacher?:  {
      __typename: "Teacher",
      id: string,
      name: string,
      cognitoUserId?: string | null,
      schoolId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
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
      studentMedicalRecordId?: string | null,
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
  } | null,
};

export type DeleteTeacherNoteMutationVariables = {
  input: DeleteTeacherNoteInput,
  condition?: ModelTeacherNoteConditionInput | null,
};

export type DeleteTeacherNoteMutation = {
  deleteTeacherNote?:  {
    __typename: "TeacherNote",
    id: string,
    teacherId: string,
    studentId: string,
    classId?: string | null,
    title?: string | null,
    body: string,
    category?: string | null,
    createdAt: string,
    updatedAt: string,
    teacher?:  {
      __typename: "Teacher",
      id: string,
      name: string,
      cognitoUserId?: string | null,
      schoolId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
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
      studentMedicalRecordId?: string | null,
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
  } | null,
};

export type CreateIncidentMutationVariables = {
  input: CreateIncidentInput,
  condition?: ModelIncidentConditionInput | null,
};

export type CreateIncidentMutation = {
  createIncident?:  {
    __typename: "Incident",
    id: string,
    description: string,
    severity?: string | null,
    date?: string | null,
    teacherId: string,
    studentId: string,
    classId?: string | null,
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
      studentMedicalRecordId?: string | null,
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
    school?:  {
      __typename: "School",
      id: string,
      name: string,
      address?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateIncidentMutationVariables = {
  input: UpdateIncidentInput,
  condition?: ModelIncidentConditionInput | null,
};

export type UpdateIncidentMutation = {
  updateIncident?:  {
    __typename: "Incident",
    id: string,
    description: string,
    severity?: string | null,
    date?: string | null,
    teacherId: string,
    studentId: string,
    classId?: string | null,
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
      studentMedicalRecordId?: string | null,
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
    school?:  {
      __typename: "School",
      id: string,
      name: string,
      address?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteIncidentMutationVariables = {
  input: DeleteIncidentInput,
  condition?: ModelIncidentConditionInput | null,
};

export type DeleteIncidentMutation = {
  deleteIncident?:  {
    __typename: "Incident",
    id: string,
    description: string,
    severity?: string | null,
    date?: string | null,
    teacherId: string,
    studentId: string,
    classId?: string | null,
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
      studentMedicalRecordId?: string | null,
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
    school?:  {
      __typename: "School",
      id: string,
      name: string,
      address?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateConversationMutationVariables = {
  input: CreateConversationInput,
  condition?: ModelConversationConditionInput | null,
};

export type CreateConversationMutation = {
  createConversation?:  {
    __typename: "Conversation",
    id: string,
    type: ConversationType,
    parentId?: string | null,
    teacherId: string,
    studentId?: string | null,
    classId?: string | null,
    parentName?: string | null,
    teacherName?: string | null,
    studentName?: string | null,
    className?: string | null,
    lastMessageText?: string | null,
    lastMessageAt?: string | null,
    messages?:  {
      __typename: "ModelMessageConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateConversationMutationVariables = {
  input: UpdateConversationInput,
  condition?: ModelConversationConditionInput | null,
};

export type UpdateConversationMutation = {
  updateConversation?:  {
    __typename: "Conversation",
    id: string,
    type: ConversationType,
    parentId?: string | null,
    teacherId: string,
    studentId?: string | null,
    classId?: string | null,
    parentName?: string | null,
    teacherName?: string | null,
    studentName?: string | null,
    className?: string | null,
    lastMessageText?: string | null,
    lastMessageAt?: string | null,
    messages?:  {
      __typename: "ModelMessageConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteConversationMutationVariables = {
  input: DeleteConversationInput,
  condition?: ModelConversationConditionInput | null,
};

export type DeleteConversationMutation = {
  deleteConversation?:  {
    __typename: "Conversation",
    id: string,
    type: ConversationType,
    parentId?: string | null,
    teacherId: string,
    studentId?: string | null,
    classId?: string | null,
    parentName?: string | null,
    teacherName?: string | null,
    studentName?: string | null,
    className?: string | null,
    lastMessageText?: string | null,
    lastMessageAt?: string | null,
    messages?:  {
      __typename: "ModelMessageConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateMessageMutationVariables = {
  input: CreateMessageInput,
  condition?: ModelMessageConditionInput | null,
};

export type CreateMessageMutation = {
  createMessage?:  {
    __typename: "Message",
    id: string,
    conversationId: string,
    senderId: string,
    senderType: SenderType,
    senderName: string,
    body: string,
    createdAt: string,
    conversation?:  {
      __typename: "Conversation",
      id: string,
      type: ConversationType,
      parentId?: string | null,
      teacherId: string,
      studentId?: string | null,
      classId?: string | null,
      parentName?: string | null,
      teacherName?: string | null,
      studentName?: string | null,
      className?: string | null,
      lastMessageText?: string | null,
      lastMessageAt?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    updatedAt: string,
  } | null,
};

export type UpdateMessageMutationVariables = {
  input: UpdateMessageInput,
  condition?: ModelMessageConditionInput | null,
};

export type UpdateMessageMutation = {
  updateMessage?:  {
    __typename: "Message",
    id: string,
    conversationId: string,
    senderId: string,
    senderType: SenderType,
    senderName: string,
    body: string,
    createdAt: string,
    conversation?:  {
      __typename: "Conversation",
      id: string,
      type: ConversationType,
      parentId?: string | null,
      teacherId: string,
      studentId?: string | null,
      classId?: string | null,
      parentName?: string | null,
      teacherName?: string | null,
      studentName?: string | null,
      className?: string | null,
      lastMessageText?: string | null,
      lastMessageAt?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    updatedAt: string,
  } | null,
};

export type DeleteMessageMutationVariables = {
  input: DeleteMessageInput,
  condition?: ModelMessageConditionInput | null,
};

export type DeleteMessageMutation = {
  deleteMessage?:  {
    __typename: "Message",
    id: string,
    conversationId: string,
    senderId: string,
    senderType: SenderType,
    senderName: string,
    body: string,
    createdAt: string,
    conversation?:  {
      __typename: "Conversation",
      id: string,
      type: ConversationType,
      parentId?: string | null,
      teacherId: string,
      studentId?: string | null,
      classId?: string | null,
      parentName?: string | null,
      teacherName?: string | null,
      studentName?: string | null,
      className?: string | null,
      lastMessageText?: string | null,
      lastMessageAt?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    updatedAt: string,
  } | null,
};

export type CreatePushTokenMutationVariables = {
  input: CreatePushTokenInput,
  condition?: ModelPushTokenConditionInput | null,
};

export type CreatePushTokenMutation = {
  createPushToken?:  {
    __typename: "PushToken",
    id: string,
    userId: string,
    userType: SenderType,
    token: string,
    platform: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdatePushTokenMutationVariables = {
  input: UpdatePushTokenInput,
  condition?: ModelPushTokenConditionInput | null,
};

export type UpdatePushTokenMutation = {
  updatePushToken?:  {
    __typename: "PushToken",
    id: string,
    userId: string,
    userType: SenderType,
    token: string,
    platform: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeletePushTokenMutationVariables = {
  input: DeletePushTokenInput,
  condition?: ModelPushTokenConditionInput | null,
};

export type DeletePushTokenMutation = {
  deletePushToken?:  {
    __typename: "PushToken",
    id: string,
    userId: string,
    userType: SenderType,
    token: string,
    platform: string,
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
    incidents?:  {
      __typename: "ModelIncidentConnection",
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
    incidents?:  {
      __typename: "ModelIncidentConnection",
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
    incidents?:  {
      __typename: "ModelIncidentConnection",
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
    attendances?:  {
      __typename: "ModelAttendanceConnection",
      nextToken?: string | null,
    } | null,
    incidents?:  {
      __typename: "ModelIncidentConnection",
      nextToken?: string | null,
    } | null,
    medicalRecord?:  {
      __typename: "MedicalRecord",
      id: string,
      studentId: string,
      allergies?: string | null,
      medications?: string | null,
      conditions?: string | null,
      emergencyNotes?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    teacherNotes?:  {
      __typename: "ModelTeacherNoteConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    schoolStudentsId?: string | null,
    studentMedicalRecordId?: string | null,
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
      studentMedicalRecordId?: string | null,
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
      studentMedicalRecordId?: string | null,
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
      studentMedicalRecordId?: string | null,
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
    incidents?:  {
      __typename: "ModelIncidentConnection",
      nextToken?: string | null,
    } | null,
    teacherNotes?:  {
      __typename: "ModelTeacherNoteConnection",
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
    attendances?:  {
      __typename: "ModelAttendanceConnection",
      nextToken?: string | null,
    } | null,
    incidents?:  {
      __typename: "ModelIncidentConnection",
      nextToken?: string | null,
    } | null,
    schedules?:  {
      __typename: "ModelScheduleConnection",
      nextToken?: string | null,
    } | null,
    teacherNotes?:  {
      __typename: "ModelTeacherNoteConnection",
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

export type GetScheduleQueryVariables = {
  id: string,
};

export type GetScheduleQuery = {
  getSchedule?:  {
    __typename: "Schedule",
    id: string,
    classId: string,
    class?:  {
      __typename: "Class",
      id: string,
      name: string,
      teacherId: string,
      schoolId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    dayOfWeek: DayOfWeek,
    startTime: string,
    endTime: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListSchedulesQueryVariables = {
  filter?: ModelScheduleFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListSchedulesQuery = {
  listSchedules?:  {
    __typename: "ModelScheduleConnection",
    items:  Array< {
      __typename: "Schedule",
      id: string,
      classId: string,
      dayOfWeek: DayOfWeek,
      startTime: string,
      endTime: string,
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
      studentMedicalRecordId?: string | null,
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

export type GetAttendanceQueryVariables = {
  id: string,
};

export type GetAttendanceQuery = {
  getAttendance?:  {
    __typename: "Attendance",
    id: string,
    studentId: string,
    classId: string,
    date: string,
    status: AttendanceStatus,
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
      studentMedicalRecordId?: string | null,
    } | null,
    checkInTime?: string | null,
    updatedAt?: string | null,
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
  } | null,
};

export type ListAttendancesQueryVariables = {
  filter?: ModelAttendanceFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListAttendancesQuery = {
  listAttendances?:  {
    __typename: "ModelAttendanceConnection",
    items:  Array< {
      __typename: "Attendance",
      id: string,
      studentId: string,
      classId: string,
      date: string,
      status: AttendanceStatus,
      checkInTime?: string | null,
      updatedAt?: string | null,
      createdAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetAnnouncementQueryVariables = {
  id: string,
};

export type GetAnnouncementQuery = {
  getAnnouncement?:  {
    __typename: "Announcement",
    id: string,
    title: string,
    body: string,
    createdAt: string,
    createdBy: string,
    schoolId?: string | null,
    classId?: string | null,
    updatedAt: string,
  } | null,
};

export type ListAnnouncementsQueryVariables = {
  filter?: ModelAnnouncementFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListAnnouncementsQuery = {
  listAnnouncements?:  {
    __typename: "ModelAnnouncementConnection",
    items:  Array< {
      __typename: "Announcement",
      id: string,
      title: string,
      body: string,
      createdAt: string,
      createdBy: string,
      schoolId?: string | null,
      classId?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetEmergencyNotificationQueryVariables = {
  id: string,
};

export type GetEmergencyNotificationQuery = {
  getEmergencyNotification?:  {
    __typename: "EmergencyNotification",
    id: string,
    title: string,
    message: string,
    type: string,
    schoolId?: string | null,
    classId?: string | null,
    status?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListEmergencyNotificationsQueryVariables = {
  filter?: ModelEmergencyNotificationFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListEmergencyNotificationsQuery = {
  listEmergencyNotifications?:  {
    __typename: "ModelEmergencyNotificationConnection",
    items:  Array< {
      __typename: "EmergencyNotification",
      id: string,
      title: string,
      message: string,
      type: string,
      schoolId?: string | null,
      classId?: string | null,
      status?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetMedicalRecordQueryVariables = {
  id: string,
};

export type GetMedicalRecordQuery = {
  getMedicalRecord?:  {
    __typename: "MedicalRecord",
    id: string,
    studentId: string,
    allergies?: string | null,
    medications?: string | null,
    conditions?: string | null,
    emergencyNotes?: string | null,
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
      studentMedicalRecordId?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListMedicalRecordsQueryVariables = {
  filter?: ModelMedicalRecordFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListMedicalRecordsQuery = {
  listMedicalRecords?:  {
    __typename: "ModelMedicalRecordConnection",
    items:  Array< {
      __typename: "MedicalRecord",
      id: string,
      studentId: string,
      allergies?: string | null,
      medications?: string | null,
      conditions?: string | null,
      emergencyNotes?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetTeacherNoteQueryVariables = {
  id: string,
};

export type GetTeacherNoteQuery = {
  getTeacherNote?:  {
    __typename: "TeacherNote",
    id: string,
    teacherId: string,
    studentId: string,
    classId?: string | null,
    title?: string | null,
    body: string,
    category?: string | null,
    createdAt: string,
    updatedAt: string,
    teacher?:  {
      __typename: "Teacher",
      id: string,
      name: string,
      cognitoUserId?: string | null,
      schoolId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
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
      studentMedicalRecordId?: string | null,
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
  } | null,
};

export type ListTeacherNotesQueryVariables = {
  filter?: ModelTeacherNoteFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListTeacherNotesQuery = {
  listTeacherNotes?:  {
    __typename: "ModelTeacherNoteConnection",
    items:  Array< {
      __typename: "TeacherNote",
      id: string,
      teacherId: string,
      studentId: string,
      classId?: string | null,
      title?: string | null,
      body: string,
      category?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetIncidentQueryVariables = {
  id: string,
};

export type GetIncidentQuery = {
  getIncident?:  {
    __typename: "Incident",
    id: string,
    description: string,
    severity?: string | null,
    date?: string | null,
    teacherId: string,
    studentId: string,
    classId?: string | null,
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
      studentMedicalRecordId?: string | null,
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
    school?:  {
      __typename: "School",
      id: string,
      name: string,
      address?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListIncidentsQueryVariables = {
  filter?: ModelIncidentFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListIncidentsQuery = {
  listIncidents?:  {
    __typename: "ModelIncidentConnection",
    items:  Array< {
      __typename: "Incident",
      id: string,
      description: string,
      severity?: string | null,
      date?: string | null,
      teacherId: string,
      studentId: string,
      classId?: string | null,
      schoolId: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetConversationQueryVariables = {
  id: string,
};

export type GetConversationQuery = {
  getConversation?:  {
    __typename: "Conversation",
    id: string,
    type: ConversationType,
    parentId?: string | null,
    teacherId: string,
    studentId?: string | null,
    classId?: string | null,
    parentName?: string | null,
    teacherName?: string | null,
    studentName?: string | null,
    className?: string | null,
    lastMessageText?: string | null,
    lastMessageAt?: string | null,
    messages?:  {
      __typename: "ModelMessageConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListConversationsQueryVariables = {
  filter?: ModelConversationFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListConversationsQuery = {
  listConversations?:  {
    __typename: "ModelConversationConnection",
    items:  Array< {
      __typename: "Conversation",
      id: string,
      type: ConversationType,
      parentId?: string | null,
      teacherId: string,
      studentId?: string | null,
      classId?: string | null,
      parentName?: string | null,
      teacherName?: string | null,
      studentName?: string | null,
      className?: string | null,
      lastMessageText?: string | null,
      lastMessageAt?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetMessageQueryVariables = {
  id: string,
};

export type GetMessageQuery = {
  getMessage?:  {
    __typename: "Message",
    id: string,
    conversationId: string,
    senderId: string,
    senderType: SenderType,
    senderName: string,
    body: string,
    createdAt: string,
    conversation?:  {
      __typename: "Conversation",
      id: string,
      type: ConversationType,
      parentId?: string | null,
      teacherId: string,
      studentId?: string | null,
      classId?: string | null,
      parentName?: string | null,
      teacherName?: string | null,
      studentName?: string | null,
      className?: string | null,
      lastMessageText?: string | null,
      lastMessageAt?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    updatedAt: string,
  } | null,
};

export type ListMessagesQueryVariables = {
  filter?: ModelMessageFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListMessagesQuery = {
  listMessages?:  {
    __typename: "ModelMessageConnection",
    items:  Array< {
      __typename: "Message",
      id: string,
      conversationId: string,
      senderId: string,
      senderType: SenderType,
      senderName: string,
      body: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetPushTokenQueryVariables = {
  id: string,
};

export type GetPushTokenQuery = {
  getPushToken?:  {
    __typename: "PushToken",
    id: string,
    userId: string,
    userType: SenderType,
    token: string,
    platform: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListPushTokensQueryVariables = {
  filter?: ModelPushTokenFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListPushTokensQuery = {
  listPushTokens?:  {
    __typename: "ModelPushTokenConnection",
    items:  Array< {
      __typename: "PushToken",
      id: string,
      userId: string,
      userType: SenderType,
      token: string,
      platform: string,
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

export type SchedulesByClassIdQueryVariables = {
  classId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelScheduleFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type SchedulesByClassIdQuery = {
  schedulesByClassId?:  {
    __typename: "ModelScheduleConnection",
    items:  Array< {
      __typename: "Schedule",
      id: string,
      classId: string,
      dayOfWeek: DayOfWeek,
      startTime: string,
      endTime: string,
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

export type AttendancesByStudentIdQueryVariables = {
  studentId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelAttendanceFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type AttendancesByStudentIdQuery = {
  attendancesByStudentId?:  {
    __typename: "ModelAttendanceConnection",
    items:  Array< {
      __typename: "Attendance",
      id: string,
      studentId: string,
      classId: string,
      date: string,
      status: AttendanceStatus,
      checkInTime?: string | null,
      updatedAt?: string | null,
      createdAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type AttendancesByClassIdQueryVariables = {
  classId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelAttendanceFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type AttendancesByClassIdQuery = {
  attendancesByClassId?:  {
    __typename: "ModelAttendanceConnection",
    items:  Array< {
      __typename: "Attendance",
      id: string,
      studentId: string,
      classId: string,
      date: string,
      status: AttendanceStatus,
      checkInTime?: string | null,
      updatedAt?: string | null,
      createdAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type AnnouncementsBySchoolIdQueryVariables = {
  schoolId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelAnnouncementFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type AnnouncementsBySchoolIdQuery = {
  announcementsBySchoolId?:  {
    __typename: "ModelAnnouncementConnection",
    items:  Array< {
      __typename: "Announcement",
      id: string,
      title: string,
      body: string,
      createdAt: string,
      createdBy: string,
      schoolId?: string | null,
      classId?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type AnnouncementsByClassIdQueryVariables = {
  classId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelAnnouncementFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type AnnouncementsByClassIdQuery = {
  announcementsByClassId?:  {
    __typename: "ModelAnnouncementConnection",
    items:  Array< {
      __typename: "Announcement",
      id: string,
      title: string,
      body: string,
      createdAt: string,
      createdBy: string,
      schoolId?: string | null,
      classId?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type EmergencyNotificationsBySchoolIdQueryVariables = {
  schoolId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelEmergencyNotificationFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type EmergencyNotificationsBySchoolIdQuery = {
  emergencyNotificationsBySchoolId?:  {
    __typename: "ModelEmergencyNotificationConnection",
    items:  Array< {
      __typename: "EmergencyNotification",
      id: string,
      title: string,
      message: string,
      type: string,
      schoolId?: string | null,
      classId?: string | null,
      status?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type EmergencyNotificationsByClassIdQueryVariables = {
  classId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelEmergencyNotificationFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type EmergencyNotificationsByClassIdQuery = {
  emergencyNotificationsByClassId?:  {
    __typename: "ModelEmergencyNotificationConnection",
    items:  Array< {
      __typename: "EmergencyNotification",
      id: string,
      title: string,
      message: string,
      type: string,
      schoolId?: string | null,
      classId?: string | null,
      status?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type MedicalRecordsByStudentIdQueryVariables = {
  studentId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelMedicalRecordFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type MedicalRecordsByStudentIdQuery = {
  medicalRecordsByStudentId?:  {
    __typename: "ModelMedicalRecordConnection",
    items:  Array< {
      __typename: "MedicalRecord",
      id: string,
      studentId: string,
      allergies?: string | null,
      medications?: string | null,
      conditions?: string | null,
      emergencyNotes?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type TeacherNotesByTeacherIdQueryVariables = {
  teacherId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelTeacherNoteFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type TeacherNotesByTeacherIdQuery = {
  teacherNotesByTeacherId?:  {
    __typename: "ModelTeacherNoteConnection",
    items:  Array< {
      __typename: "TeacherNote",
      id: string,
      teacherId: string,
      studentId: string,
      classId?: string | null,
      title?: string | null,
      body: string,
      category?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type TeacherNotesByStudentIdQueryVariables = {
  studentId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelTeacherNoteFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type TeacherNotesByStudentIdQuery = {
  teacherNotesByStudentId?:  {
    __typename: "ModelTeacherNoteConnection",
    items:  Array< {
      __typename: "TeacherNote",
      id: string,
      teacherId: string,
      studentId: string,
      classId?: string | null,
      title?: string | null,
      body: string,
      category?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type TeacherNotesByClassIdQueryVariables = {
  classId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelTeacherNoteFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type TeacherNotesByClassIdQuery = {
  teacherNotesByClassId?:  {
    __typename: "ModelTeacherNoteConnection",
    items:  Array< {
      __typename: "TeacherNote",
      id: string,
      teacherId: string,
      studentId: string,
      classId?: string | null,
      title?: string | null,
      body: string,
      category?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type IncidentsByTeacherIdQueryVariables = {
  teacherId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelIncidentFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type IncidentsByTeacherIdQuery = {
  incidentsByTeacherId?:  {
    __typename: "ModelIncidentConnection",
    items:  Array< {
      __typename: "Incident",
      id: string,
      description: string,
      severity?: string | null,
      date?: string | null,
      teacherId: string,
      studentId: string,
      classId?: string | null,
      schoolId: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type IncidentsByStudentIdQueryVariables = {
  studentId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelIncidentFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type IncidentsByStudentIdQuery = {
  incidentsByStudentId?:  {
    __typename: "ModelIncidentConnection",
    items:  Array< {
      __typename: "Incident",
      id: string,
      description: string,
      severity?: string | null,
      date?: string | null,
      teacherId: string,
      studentId: string,
      classId?: string | null,
      schoolId: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type IncidentsByClassIdQueryVariables = {
  classId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelIncidentFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type IncidentsByClassIdQuery = {
  incidentsByClassId?:  {
    __typename: "ModelIncidentConnection",
    items:  Array< {
      __typename: "Incident",
      id: string,
      description: string,
      severity?: string | null,
      date?: string | null,
      teacherId: string,
      studentId: string,
      classId?: string | null,
      schoolId: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type IncidentsBySchoolIdQueryVariables = {
  schoolId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelIncidentFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type IncidentsBySchoolIdQuery = {
  incidentsBySchoolId?:  {
    __typename: "ModelIncidentConnection",
    items:  Array< {
      __typename: "Incident",
      id: string,
      description: string,
      severity?: string | null,
      date?: string | null,
      teacherId: string,
      studentId: string,
      classId?: string | null,
      schoolId: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ConversationsByParentIdQueryVariables = {
  parentId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelConversationFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ConversationsByParentIdQuery = {
  conversationsByParentId?:  {
    __typename: "ModelConversationConnection",
    items:  Array< {
      __typename: "Conversation",
      id: string,
      type: ConversationType,
      parentId?: string | null,
      teacherId: string,
      studentId?: string | null,
      classId?: string | null,
      parentName?: string | null,
      teacherName?: string | null,
      studentName?: string | null,
      className?: string | null,
      lastMessageText?: string | null,
      lastMessageAt?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ConversationsByTeacherIdQueryVariables = {
  teacherId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelConversationFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ConversationsByTeacherIdQuery = {
  conversationsByTeacherId?:  {
    __typename: "ModelConversationConnection",
    items:  Array< {
      __typename: "Conversation",
      id: string,
      type: ConversationType,
      parentId?: string | null,
      teacherId: string,
      studentId?: string | null,
      classId?: string | null,
      parentName?: string | null,
      teacherName?: string | null,
      studentName?: string | null,
      className?: string | null,
      lastMessageText?: string | null,
      lastMessageAt?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ConversationsByStudentIdQueryVariables = {
  studentId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelConversationFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ConversationsByStudentIdQuery = {
  conversationsByStudentId?:  {
    __typename: "ModelConversationConnection",
    items:  Array< {
      __typename: "Conversation",
      id: string,
      type: ConversationType,
      parentId?: string | null,
      teacherId: string,
      studentId?: string | null,
      classId?: string | null,
      parentName?: string | null,
      teacherName?: string | null,
      studentName?: string | null,
      className?: string | null,
      lastMessageText?: string | null,
      lastMessageAt?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ConversationsByClassIdQueryVariables = {
  classId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelConversationFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ConversationsByClassIdQuery = {
  conversationsByClassId?:  {
    __typename: "ModelConversationConnection",
    items:  Array< {
      __typename: "Conversation",
      id: string,
      type: ConversationType,
      parentId?: string | null,
      teacherId: string,
      studentId?: string | null,
      classId?: string | null,
      parentName?: string | null,
      teacherName?: string | null,
      studentName?: string | null,
      className?: string | null,
      lastMessageText?: string | null,
      lastMessageAt?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type MessagesByConversationIdAndCreatedAtQueryVariables = {
  conversationId: string,
  createdAt?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelMessageFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type MessagesByConversationIdAndCreatedAtQuery = {
  messagesByConversationIdAndCreatedAt?:  {
    __typename: "ModelMessageConnection",
    items:  Array< {
      __typename: "Message",
      id: string,
      conversationId: string,
      senderId: string,
      senderType: SenderType,
      senderName: string,
      body: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type PushTokensByUserIdQueryVariables = {
  userId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelPushTokenFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type PushTokensByUserIdQuery = {
  pushTokensByUserId?:  {
    __typename: "ModelPushTokenConnection",
    items:  Array< {
      __typename: "PushToken",
      id: string,
      userId: string,
      userType: SenderType,
      token: string,
      platform: string,
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
    incidents?:  {
      __typename: "ModelIncidentConnection",
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
    attendances?:  {
      __typename: "ModelAttendanceConnection",
      nextToken?: string | null,
    } | null,
    incidents?:  {
      __typename: "ModelIncidentConnection",
      nextToken?: string | null,
    } | null,
    medicalRecord?:  {
      __typename: "MedicalRecord",
      id: string,
      studentId: string,
      allergies?: string | null,
      medications?: string | null,
      conditions?: string | null,
      emergencyNotes?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    teacherNotes?:  {
      __typename: "ModelTeacherNoteConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    schoolStudentsId?: string | null,
    studentMedicalRecordId?: string | null,
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
      studentMedicalRecordId?: string | null,
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
      studentMedicalRecordId?: string | null,
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
    incidents?:  {
      __typename: "ModelIncidentConnection",
      nextToken?: string | null,
    } | null,
    teacherNotes?:  {
      __typename: "ModelTeacherNoteConnection",
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
    incidents?:  {
      __typename: "ModelIncidentConnection",
      nextToken?: string | null,
    } | null,
    teacherNotes?:  {
      __typename: "ModelTeacherNoteConnection",
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
    incidents?:  {
      __typename: "ModelIncidentConnection",
      nextToken?: string | null,
    } | null,
    teacherNotes?:  {
      __typename: "ModelTeacherNoteConnection",
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
    attendances?:  {
      __typename: "ModelAttendanceConnection",
      nextToken?: string | null,
    } | null,
    incidents?:  {
      __typename: "ModelIncidentConnection",
      nextToken?: string | null,
    } | null,
    schedules?:  {
      __typename: "ModelScheduleConnection",
      nextToken?: string | null,
    } | null,
    teacherNotes?:  {
      __typename: "ModelTeacherNoteConnection",
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
    attendances?:  {
      __typename: "ModelAttendanceConnection",
      nextToken?: string | null,
    } | null,
    incidents?:  {
      __typename: "ModelIncidentConnection",
      nextToken?: string | null,
    } | null,
    schedules?:  {
      __typename: "ModelScheduleConnection",
      nextToken?: string | null,
    } | null,
    teacherNotes?:  {
      __typename: "ModelTeacherNoteConnection",
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
    attendances?:  {
      __typename: "ModelAttendanceConnection",
      nextToken?: string | null,
    } | null,
    incidents?:  {
      __typename: "ModelIncidentConnection",
      nextToken?: string | null,
    } | null,
    schedules?:  {
      __typename: "ModelScheduleConnection",
      nextToken?: string | null,
    } | null,
    teacherNotes?:  {
      __typename: "ModelTeacherNoteConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateScheduleSubscriptionVariables = {
  filter?: ModelSubscriptionScheduleFilterInput | null,
};

export type OnCreateScheduleSubscription = {
  onCreateSchedule?:  {
    __typename: "Schedule",
    id: string,
    classId: string,
    class?:  {
      __typename: "Class",
      id: string,
      name: string,
      teacherId: string,
      schoolId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    dayOfWeek: DayOfWeek,
    startTime: string,
    endTime: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateScheduleSubscriptionVariables = {
  filter?: ModelSubscriptionScheduleFilterInput | null,
};

export type OnUpdateScheduleSubscription = {
  onUpdateSchedule?:  {
    __typename: "Schedule",
    id: string,
    classId: string,
    class?:  {
      __typename: "Class",
      id: string,
      name: string,
      teacherId: string,
      schoolId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    dayOfWeek: DayOfWeek,
    startTime: string,
    endTime: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteScheduleSubscriptionVariables = {
  filter?: ModelSubscriptionScheduleFilterInput | null,
};

export type OnDeleteScheduleSubscription = {
  onDeleteSchedule?:  {
    __typename: "Schedule",
    id: string,
    classId: string,
    class?:  {
      __typename: "Class",
      id: string,
      name: string,
      teacherId: string,
      schoolId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    dayOfWeek: DayOfWeek,
    startTime: string,
    endTime: string,
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
      studentMedicalRecordId?: string | null,
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
      studentMedicalRecordId?: string | null,
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
      studentMedicalRecordId?: string | null,
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

export type OnCreateAttendanceSubscriptionVariables = {
  filter?: ModelSubscriptionAttendanceFilterInput | null,
};

export type OnCreateAttendanceSubscription = {
  onCreateAttendance?:  {
    __typename: "Attendance",
    id: string,
    studentId: string,
    classId: string,
    date: string,
    status: AttendanceStatus,
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
      studentMedicalRecordId?: string | null,
    } | null,
    checkInTime?: string | null,
    updatedAt?: string | null,
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
  } | null,
};

export type OnUpdateAttendanceSubscriptionVariables = {
  filter?: ModelSubscriptionAttendanceFilterInput | null,
};

export type OnUpdateAttendanceSubscription = {
  onUpdateAttendance?:  {
    __typename: "Attendance",
    id: string,
    studentId: string,
    classId: string,
    date: string,
    status: AttendanceStatus,
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
      studentMedicalRecordId?: string | null,
    } | null,
    checkInTime?: string | null,
    updatedAt?: string | null,
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
  } | null,
};

export type OnDeleteAttendanceSubscriptionVariables = {
  filter?: ModelSubscriptionAttendanceFilterInput | null,
};

export type OnDeleteAttendanceSubscription = {
  onDeleteAttendance?:  {
    __typename: "Attendance",
    id: string,
    studentId: string,
    classId: string,
    date: string,
    status: AttendanceStatus,
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
      studentMedicalRecordId?: string | null,
    } | null,
    checkInTime?: string | null,
    updatedAt?: string | null,
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
  } | null,
};

export type OnCreateAnnouncementSubscriptionVariables = {
  filter?: ModelSubscriptionAnnouncementFilterInput | null,
};

export type OnCreateAnnouncementSubscription = {
  onCreateAnnouncement?:  {
    __typename: "Announcement",
    id: string,
    title: string,
    body: string,
    createdAt: string,
    createdBy: string,
    schoolId?: string | null,
    classId?: string | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateAnnouncementSubscriptionVariables = {
  filter?: ModelSubscriptionAnnouncementFilterInput | null,
};

export type OnUpdateAnnouncementSubscription = {
  onUpdateAnnouncement?:  {
    __typename: "Announcement",
    id: string,
    title: string,
    body: string,
    createdAt: string,
    createdBy: string,
    schoolId?: string | null,
    classId?: string | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteAnnouncementSubscriptionVariables = {
  filter?: ModelSubscriptionAnnouncementFilterInput | null,
};

export type OnDeleteAnnouncementSubscription = {
  onDeleteAnnouncement?:  {
    __typename: "Announcement",
    id: string,
    title: string,
    body: string,
    createdAt: string,
    createdBy: string,
    schoolId?: string | null,
    classId?: string | null,
    updatedAt: string,
  } | null,
};

export type OnCreateEmergencyNotificationSubscriptionVariables = {
  filter?: ModelSubscriptionEmergencyNotificationFilterInput | null,
};

export type OnCreateEmergencyNotificationSubscription = {
  onCreateEmergencyNotification?:  {
    __typename: "EmergencyNotification",
    id: string,
    title: string,
    message: string,
    type: string,
    schoolId?: string | null,
    classId?: string | null,
    status?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateEmergencyNotificationSubscriptionVariables = {
  filter?: ModelSubscriptionEmergencyNotificationFilterInput | null,
};

export type OnUpdateEmergencyNotificationSubscription = {
  onUpdateEmergencyNotification?:  {
    __typename: "EmergencyNotification",
    id: string,
    title: string,
    message: string,
    type: string,
    schoolId?: string | null,
    classId?: string | null,
    status?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteEmergencyNotificationSubscriptionVariables = {
  filter?: ModelSubscriptionEmergencyNotificationFilterInput | null,
};

export type OnDeleteEmergencyNotificationSubscription = {
  onDeleteEmergencyNotification?:  {
    __typename: "EmergencyNotification",
    id: string,
    title: string,
    message: string,
    type: string,
    schoolId?: string | null,
    classId?: string | null,
    status?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateMedicalRecordSubscriptionVariables = {
  filter?: ModelSubscriptionMedicalRecordFilterInput | null,
};

export type OnCreateMedicalRecordSubscription = {
  onCreateMedicalRecord?:  {
    __typename: "MedicalRecord",
    id: string,
    studentId: string,
    allergies?: string | null,
    medications?: string | null,
    conditions?: string | null,
    emergencyNotes?: string | null,
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
      studentMedicalRecordId?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateMedicalRecordSubscriptionVariables = {
  filter?: ModelSubscriptionMedicalRecordFilterInput | null,
};

export type OnUpdateMedicalRecordSubscription = {
  onUpdateMedicalRecord?:  {
    __typename: "MedicalRecord",
    id: string,
    studentId: string,
    allergies?: string | null,
    medications?: string | null,
    conditions?: string | null,
    emergencyNotes?: string | null,
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
      studentMedicalRecordId?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteMedicalRecordSubscriptionVariables = {
  filter?: ModelSubscriptionMedicalRecordFilterInput | null,
};

export type OnDeleteMedicalRecordSubscription = {
  onDeleteMedicalRecord?:  {
    __typename: "MedicalRecord",
    id: string,
    studentId: string,
    allergies?: string | null,
    medications?: string | null,
    conditions?: string | null,
    emergencyNotes?: string | null,
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
      studentMedicalRecordId?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateTeacherNoteSubscriptionVariables = {
  filter?: ModelSubscriptionTeacherNoteFilterInput | null,
};

export type OnCreateTeacherNoteSubscription = {
  onCreateTeacherNote?:  {
    __typename: "TeacherNote",
    id: string,
    teacherId: string,
    studentId: string,
    classId?: string | null,
    title?: string | null,
    body: string,
    category?: string | null,
    createdAt: string,
    updatedAt: string,
    teacher?:  {
      __typename: "Teacher",
      id: string,
      name: string,
      cognitoUserId?: string | null,
      schoolId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
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
      studentMedicalRecordId?: string | null,
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
  } | null,
};

export type OnUpdateTeacherNoteSubscriptionVariables = {
  filter?: ModelSubscriptionTeacherNoteFilterInput | null,
};

export type OnUpdateTeacherNoteSubscription = {
  onUpdateTeacherNote?:  {
    __typename: "TeacherNote",
    id: string,
    teacherId: string,
    studentId: string,
    classId?: string | null,
    title?: string | null,
    body: string,
    category?: string | null,
    createdAt: string,
    updatedAt: string,
    teacher?:  {
      __typename: "Teacher",
      id: string,
      name: string,
      cognitoUserId?: string | null,
      schoolId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
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
      studentMedicalRecordId?: string | null,
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
  } | null,
};

export type OnDeleteTeacherNoteSubscriptionVariables = {
  filter?: ModelSubscriptionTeacherNoteFilterInput | null,
};

export type OnDeleteTeacherNoteSubscription = {
  onDeleteTeacherNote?:  {
    __typename: "TeacherNote",
    id: string,
    teacherId: string,
    studentId: string,
    classId?: string | null,
    title?: string | null,
    body: string,
    category?: string | null,
    createdAt: string,
    updatedAt: string,
    teacher?:  {
      __typename: "Teacher",
      id: string,
      name: string,
      cognitoUserId?: string | null,
      schoolId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
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
      studentMedicalRecordId?: string | null,
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
  } | null,
};

export type OnCreateIncidentSubscriptionVariables = {
  filter?: ModelSubscriptionIncidentFilterInput | null,
};

export type OnCreateIncidentSubscription = {
  onCreateIncident?:  {
    __typename: "Incident",
    id: string,
    description: string,
    severity?: string | null,
    date?: string | null,
    teacherId: string,
    studentId: string,
    classId?: string | null,
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
      studentMedicalRecordId?: string | null,
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
    school?:  {
      __typename: "School",
      id: string,
      name: string,
      address?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateIncidentSubscriptionVariables = {
  filter?: ModelSubscriptionIncidentFilterInput | null,
};

export type OnUpdateIncidentSubscription = {
  onUpdateIncident?:  {
    __typename: "Incident",
    id: string,
    description: string,
    severity?: string | null,
    date?: string | null,
    teacherId: string,
    studentId: string,
    classId?: string | null,
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
      studentMedicalRecordId?: string | null,
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
    school?:  {
      __typename: "School",
      id: string,
      name: string,
      address?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteIncidentSubscriptionVariables = {
  filter?: ModelSubscriptionIncidentFilterInput | null,
};

export type OnDeleteIncidentSubscription = {
  onDeleteIncident?:  {
    __typename: "Incident",
    id: string,
    description: string,
    severity?: string | null,
    date?: string | null,
    teacherId: string,
    studentId: string,
    classId?: string | null,
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
      studentMedicalRecordId?: string | null,
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
    school?:  {
      __typename: "School",
      id: string,
      name: string,
      address?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateConversationSubscriptionVariables = {
  filter?: ModelSubscriptionConversationFilterInput | null,
};

export type OnCreateConversationSubscription = {
  onCreateConversation?:  {
    __typename: "Conversation",
    id: string,
    type: ConversationType,
    parentId?: string | null,
    teacherId: string,
    studentId?: string | null,
    classId?: string | null,
    parentName?: string | null,
    teacherName?: string | null,
    studentName?: string | null,
    className?: string | null,
    lastMessageText?: string | null,
    lastMessageAt?: string | null,
    messages?:  {
      __typename: "ModelMessageConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateConversationSubscriptionVariables = {
  filter?: ModelSubscriptionConversationFilterInput | null,
};

export type OnUpdateConversationSubscription = {
  onUpdateConversation?:  {
    __typename: "Conversation",
    id: string,
    type: ConversationType,
    parentId?: string | null,
    teacherId: string,
    studentId?: string | null,
    classId?: string | null,
    parentName?: string | null,
    teacherName?: string | null,
    studentName?: string | null,
    className?: string | null,
    lastMessageText?: string | null,
    lastMessageAt?: string | null,
    messages?:  {
      __typename: "ModelMessageConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteConversationSubscriptionVariables = {
  filter?: ModelSubscriptionConversationFilterInput | null,
};

export type OnDeleteConversationSubscription = {
  onDeleteConversation?:  {
    __typename: "Conversation",
    id: string,
    type: ConversationType,
    parentId?: string | null,
    teacherId: string,
    studentId?: string | null,
    classId?: string | null,
    parentName?: string | null,
    teacherName?: string | null,
    studentName?: string | null,
    className?: string | null,
    lastMessageText?: string | null,
    lastMessageAt?: string | null,
    messages?:  {
      __typename: "ModelMessageConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateMessageSubscriptionVariables = {
  filter?: ModelSubscriptionMessageFilterInput | null,
};

export type OnCreateMessageSubscription = {
  onCreateMessage?:  {
    __typename: "Message",
    id: string,
    conversationId: string,
    senderId: string,
    senderType: SenderType,
    senderName: string,
    body: string,
    createdAt: string,
    conversation?:  {
      __typename: "Conversation",
      id: string,
      type: ConversationType,
      parentId?: string | null,
      teacherId: string,
      studentId?: string | null,
      classId?: string | null,
      parentName?: string | null,
      teacherName?: string | null,
      studentName?: string | null,
      className?: string | null,
      lastMessageText?: string | null,
      lastMessageAt?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateMessageSubscriptionVariables = {
  filter?: ModelSubscriptionMessageFilterInput | null,
};

export type OnUpdateMessageSubscription = {
  onUpdateMessage?:  {
    __typename: "Message",
    id: string,
    conversationId: string,
    senderId: string,
    senderType: SenderType,
    senderName: string,
    body: string,
    createdAt: string,
    conversation?:  {
      __typename: "Conversation",
      id: string,
      type: ConversationType,
      parentId?: string | null,
      teacherId: string,
      studentId?: string | null,
      classId?: string | null,
      parentName?: string | null,
      teacherName?: string | null,
      studentName?: string | null,
      className?: string | null,
      lastMessageText?: string | null,
      lastMessageAt?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteMessageSubscriptionVariables = {
  filter?: ModelSubscriptionMessageFilterInput | null,
};

export type OnDeleteMessageSubscription = {
  onDeleteMessage?:  {
    __typename: "Message",
    id: string,
    conversationId: string,
    senderId: string,
    senderType: SenderType,
    senderName: string,
    body: string,
    createdAt: string,
    conversation?:  {
      __typename: "Conversation",
      id: string,
      type: ConversationType,
      parentId?: string | null,
      teacherId: string,
      studentId?: string | null,
      classId?: string | null,
      parentName?: string | null,
      teacherName?: string | null,
      studentName?: string | null,
      className?: string | null,
      lastMessageText?: string | null,
      lastMessageAt?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    updatedAt: string,
  } | null,
};

export type OnCreatePushTokenSubscriptionVariables = {
  filter?: ModelSubscriptionPushTokenFilterInput | null,
};

export type OnCreatePushTokenSubscription = {
  onCreatePushToken?:  {
    __typename: "PushToken",
    id: string,
    userId: string,
    userType: SenderType,
    token: string,
    platform: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdatePushTokenSubscriptionVariables = {
  filter?: ModelSubscriptionPushTokenFilterInput | null,
};

export type OnUpdatePushTokenSubscription = {
  onUpdatePushToken?:  {
    __typename: "PushToken",
    id: string,
    userId: string,
    userType: SenderType,
    token: string,
    platform: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeletePushTokenSubscriptionVariables = {
  filter?: ModelSubscriptionPushTokenFilterInput | null,
};

export type OnDeletePushTokenSubscription = {
  onDeletePushToken?:  {
    __typename: "PushToken",
    id: string,
    userId: string,
    userType: SenderType,
    token: string,
    platform: string,
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
    incidents?:  {
      __typename: "ModelIncidentConnection",
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
    incidents?:  {
      __typename: "ModelIncidentConnection",
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
    incidents?:  {
      __typename: "ModelIncidentConnection",
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
    attendances?:  {
      __typename: "ModelAttendanceConnection",
      nextToken?: string | null,
    } | null,
    incidents?:  {
      __typename: "ModelIncidentConnection",
      nextToken?: string | null,
    } | null,
    medicalRecord?:  {
      __typename: "MedicalRecord",
      id: string,
      studentId: string,
      allergies?: string | null,
      medications?: string | null,
      conditions?: string | null,
      emergencyNotes?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    teacherNotes?:  {
      __typename: "ModelTeacherNoteConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    schoolStudentsId?: string | null,
    studentMedicalRecordId?: string | null,
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
    attendances?:  {
      __typename: "ModelAttendanceConnection",
      nextToken?: string | null,
    } | null,
    incidents?:  {
      __typename: "ModelIncidentConnection",
      nextToken?: string | null,
    } | null,
    medicalRecord?:  {
      __typename: "MedicalRecord",
      id: string,
      studentId: string,
      allergies?: string | null,
      medications?: string | null,
      conditions?: string | null,
      emergencyNotes?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    teacherNotes?:  {
      __typename: "ModelTeacherNoteConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    schoolStudentsId?: string | null,
    studentMedicalRecordId?: string | null,
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
    attendances?:  {
      __typename: "ModelAttendanceConnection",
      nextToken?: string | null,
    } | null,
    incidents?:  {
      __typename: "ModelIncidentConnection",
      nextToken?: string | null,
    } | null,
    medicalRecord?:  {
      __typename: "MedicalRecord",
      id: string,
      studentId: string,
      allergies?: string | null,
      medications?: string | null,
      conditions?: string | null,
      emergencyNotes?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    teacherNotes?:  {
      __typename: "ModelTeacherNoteConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    schoolStudentsId?: string | null,
    studentMedicalRecordId?: string | null,
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
      studentMedicalRecordId?: string | null,
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
      studentMedicalRecordId?: string | null,
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
      studentMedicalRecordId?: string | null,
    },
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};
