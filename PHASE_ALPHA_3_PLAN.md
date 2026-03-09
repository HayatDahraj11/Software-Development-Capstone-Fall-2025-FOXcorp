# Phase Alpha.3 Plan - Filling Every Placeholder

**Branch:** `feature/mvp-polish`
**Date:** March 9, 2026

This phase fills every remaining placeholder screen in the app. After Alpha.3, there are no more "This is a placeholder!" screens. Every screen a user can navigate to has real functionality.

---

## Current State of Each Screen

| # | Screen | Current State | Problem |
|---|--------|--------------|---------|
| 1 | Student Schedule | Duplicate of studentDocumentation.tsx (copy-pasted, same code) | Shows class list instead of a schedule view. Should show classes with times/periods in a schedule format |
| 2 | Parent Account Settings | "This is a placeholder!" text | Blank screen when user taps Account |
| 3 | Parent Notification Settings | "This is a placeholder!" text | Blank screen when user taps Notifications |
| 4 | Teacher Account Settings | "This is a placeholder!" text (identical file) | Same blank screen on teacher side |
| 5 | Teacher Notification Settings | "This is a placeholder!" text (identical file) | Same blank screen on teacher side |
| 6 | Teacher Grades | "This is a placeholder!" text | Tab is visible but shows nothing |
| 7 | Teacher Attendance Map | "This is a placeholder!" text | Hidden via `href: null` but still reachable from class home grid |
| 8 | Teacher Modal (student detail) | Has layout/styles but uses hardcoded "Student Name", "Parent Name", "Medical Records Stuff" | No real data, no theming, incomplete |
| 9 | Teacher Announcements | Hardcoded array with "Announcement" / "Description" | Not querying DynamoDB, shows fake data |

---

## What Each Fix Involves

### 1. Student Schedule - Rewrite as schedule view

**File:** `app/(parent)/(tabs)/[studentId]/studentSchedule.tsx` - REWRITE

**Current:** 117 lines, exact copy of studentDocumentation.tsx. Shows a FlatList of class cards with a class detail modal. This is a class list, not a schedule.

**What it should be:** A schedule/timetable view showing the student's classes in a structured format. Each row shows the class name, teacher name, and the student's current grade in that class. This is distinct from studentDocumentation which opens a modal with full class details.

**Data available (no new queries needed):**
- `getClassesMappedByStudent(studentId)` returns class IDs for the student
- `userClasses` has class names and teacher IDs
- `userTeachers` has teacher names
- `getStudentGradeInClass(studentId, classId)` returns the grade
- All from ParentLoginContext, already loaded

**Plan:**
- ScrollView with card-style rows (not the class detail modal pattern)
- Each row: class name (bold), teacher name (subtitle), grade badge on the right
- Uses the same color-coded badge pattern from the dashboard for grades
- Section header "Class Schedule" at the top
- No modal - tapping does nothing (or could navigate to studentDocumentation in the future)
- Themed with useThemeColor

### 2 + 4. Account Settings (parent + teacher) - Show user profile info

**Files:**
- `app/(parent)/(tabs)/(hamburger)/account_settings.tsx` - REWRITE
- `app/(teacher)/(class)/(tabs)/(hamburger)/account_settings.tsx` - REWRITE

**Current:** Both are 16 lines showing "This is a placeholder!"

**What they should show:**
- User's name (parent: firstName + lastName, teacher: name)
- Role label ("Parent" or "Teacher")
- User ID (useful for debugging, shown in subtle text)
- Debug mode indicator if on debug login
- This is a read-only info screen, not editable (editing would require backend changes)

**Data available:**
- Parent: `useParentLoginContext()` gives `userParent` with `userId`, `firstName`, `lastName` and `isDebug`
- Teacher: `useTeacherLoginContext()` gives `userTeacher` with `userId`, `name` and `isDebug`

**Plan:**
- Profile section at top with initials avatar circle (same pattern as dashboard hero)
- Info rows below: Name, Role, Account Type (AWS/Debug), User ID
- Each row is a simple label + value pair
- Themed with useThemeColor
- No new feature files needed - these are simple display screens

### 3 + 5. Notification Settings (parent + teacher) - Toggle switches

**Files:**
- `app/(parent)/(tabs)/(hamburger)/notification_settings.tsx` - REWRITE
- `app/(teacher)/(class)/(tabs)/(hamburger)/notification_settings.tsx` - REWRITE

**Current:** Both are 16 lines showing "This is a placeholder!"

**What they should show:**
- Toggle switches for notification preferences
- Push Notifications (on/off)
- Message Notifications (on/off)
- Announcement Notifications (on/off)
- Note: These toggles won't actually control anything yet (push notification targeting is not implemented), but the UI should exist so it's not a blank screen. The toggle state can be stored locally with AsyncStorage for now.

**Plan:**
- Section header "Notification Preferences"
- Three rows with labels and Switch components
- Uses `useStoredSettings` pattern or direct AsyncStorage for local persistence
- Themed with useThemeColor
- Parent and teacher versions can share the same layout (just different context imports for the header)

### 6. Teacher Grades - Show student grades for the class

**File:** `app/(teacher)/(class)/(tabs)/grades.tsx` - REWRITE

**Current:** 18 lines showing "This is a placeholder!" with unused useThemeColor import.

**What it should show:** A list of students in the class with their current grades.

**Data available:**
- `useTeacherLoginContext()` gives `userClasses` which includes `enrollments` with nested `student` objects
- Each enrollment has `currentGrade: Float`
- `useLocalSearchParams()` gives `classId` to identify which class

**Plan:**
- Get selectedClass from context using classId param (same pattern as attendance-list.tsx)
- FlatList of student rows, each showing: student name, current grade (or "N/A")
- Grade displayed as a color-coded badge (same pattern as dashboard attendance badges)
- Green for A range (90+), yellow for B-C (70-89), red for below 70, gray for null
- Section header with class name
- Themed with useThemeColor

### 7. Teacher Attendance Map - Hide or replace with useful view

**File:** `app/(teacher)/(class)/(tabs)/attendance-map.tsx` - REWRITE

**Current:** 20 lines showing "This is a placeholder!" Already hidden from tabs via `href: null`.

**Reality:** A real map feature would require location services, maps SDK, significant backend work. Not feasible for MVP.

**Plan:** Replace with a simple attendance summary view instead of a map:
- Shows attendance stats for the class: total students, present today, absent, late
- Uses data from Attendance model (attendancesByClassId query exists in generated queries)
- If no attendance data exists, shows "No attendance records yet"
- This is more useful than a map and actually achievable

### 8. Teacher Modal (student detail) - Wire up real data

**File:** `app/(teacher)/(class)/modal.tsx` - REWRITE

**Current:** 101 lines. Has a nice bottom-sheet modal layout but all content is hardcoded:
- "Student Name" instead of actual name
- "Parent Name" instead of actual parent
- "Medical Records Stuff" instead of real data
- No theming (hardcoded white background, black text)
- Mail icon navigates to `/messaging` which is wrong path

**What it should show:**
- Student's real name from the studentId query param
- Student's grade level and attendance rate
- Medical record info if available (allergies)
- Notes text input (local only, not persisted - just having the UI is enough)
- Mail icon that opens a conversation with the student's parent (but this requires knowing the parent, which we may not have from teacher context)

**Data available:**
- `useLocalSearchParams()` gives `studentId`
- Student data is nested inside class enrollments in `userClasses` from TeacherLoginContext
- Medical records can be fetched via `fetchMedicalRecord(studentId)` from medicalRecordRepo

**Plan:**
- Get studentId from params
- Find student from class enrollments
- Add useThemeColor for dark/light mode
- Show real name, grade, attendance
- Fetch and show medical allergies if they exist
- Keep notes TextInput (local only)
- Fix or remove the mail icon (messaging from teacher to specific parent needs parent ID which we don't have in this context yet)

### 9. Teacher Announcements - Query from DynamoDB

**File:** `app/(teacher)/(class)/(tabs)/announcements.tsx` - REWRITE

**Current:** 96 lines. Has a good layout with date grouping and dividers, but uses hardcoded data:
```typescript
const announcements = [
  { id: 1, date: "12/5/2025", header: "Announcement", preview: "Description" },
  { id: 2, date: "12/1/2025", header: "Announcement", preview: "Description" },
  { id: 3, date: "2/3/2024", header: "Announcement", preview: "Description" },
];
```

**What it should do:**
- Query announcements from DynamoDB using `announcementsByClassId` (query exists in generated files)
- Keep the existing date-grouped layout (it's a good design)
- Add a way for teachers to create new announcements (FAB button like the messaging screen)
- Show loading and empty states

**Data available:**
- `announcementsByClassId` query in `src/graphql/queries.ts` - takes classId, returns announcements
- `createAnnouncement` mutation in `src/graphql/mutations.ts` - takes title, body, createdBy, classId
- `classId` from `useLocalSearchParams()`

**Plan:**
- Create `src/features/announcements/api/announcementRepo.ts` - fetch and create functions
- Create `src/features/announcements/logic/useAnnouncements.ts` - hook with loading/error state
- Rewrite the screen to use real data with the existing date-grouped layout pattern
- Add FAB + simple create modal (title + body text inputs)
- Pull to refresh

---

## Files Summary

| # | File | Action |
|---|------|--------|
| 1 | `app/(parent)/(tabs)/[studentId]/studentSchedule.tsx` | REWRITE |
| 2 | `app/(parent)/(tabs)/(hamburger)/account_settings.tsx` | REWRITE |
| 3 | `app/(parent)/(tabs)/(hamburger)/notification_settings.tsx` | REWRITE |
| 4 | `app/(teacher)/(class)/(tabs)/(hamburger)/account_settings.tsx` | REWRITE |
| 5 | `app/(teacher)/(class)/(tabs)/(hamburger)/notification_settings.tsx` | REWRITE |
| 6 | `app/(teacher)/(class)/(tabs)/grades.tsx` | REWRITE |
| 7 | `app/(teacher)/(class)/(tabs)/attendance-map.tsx` | REWRITE (attendance summary) |
| 8 | `app/(teacher)/(class)/modal.tsx` | REWRITE |
| 9 | `app/(teacher)/(class)/(tabs)/announcements.tsx` | REWRITE |
| 10 | `src/features/announcements/api/announcementRepo.ts` | NEW |
| 11 | `src/features/announcements/logic/useAnnouncements.ts` | NEW |

**Total: 2 new files, 9 rewrites, 0 deletions**

---

## Conventions

Same as Alpha:
- `useThemeColor({}, "colorName")` for all colors
- `generateClient()` from `aws-amplify/api` for GraphQL
- `RepoResult<T>` pattern for data functions
- `isMounted` guard in hooks
- Ionicons for icons
- StyleSheet for all styles
- No changes to existing shared components or contexts

## What Is NOT Touched

- Card component
- ParentLoginContext
- TeacherLoginContext
- All messaging files
- All medical records files
- Dashboard (home.tsx)
- Theme system
- Schema / GraphQL generated files
- Navigation layouts

## Order of Implementation

1. Account Settings (parent + teacher) - easiest, no data fetching, establishes the profile pattern
2. Notification Settings (parent + teacher) - easy, just switches
3. Student Schedule - uses existing context data, no new queries
4. Teacher Grades - uses existing context data, same pattern as attendance-list
5. Teacher Attendance Map -> Summary - needs one new query (attendancesByClassId)
6. Teacher Modal - needs student lookup + medical record fetch
7. Teacher Announcements - most complex, needs new feature files (repo + hook + create flow)

## Verification

After Alpha.3, navigate to every single screen in the app:
- Parent: Home, Messages, Live Updates, Student Info, each student's Schedule/Records/Medical/Documentation, Account Settings, Notification Settings, Settings
- Teacher: Class list, Class Home, Messages, Announcements, Attendance List, Grades, Student Modal, Account Settings, Notification Settings, Settings

Every screen should show real content or a meaningful display. Zero "This is a placeholder!" screens remaining.
