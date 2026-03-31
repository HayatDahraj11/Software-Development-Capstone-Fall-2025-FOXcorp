# Phase Alpha - MVP Polish Documentation

**Author:** Hayat Dahraj
**Branch:** `feature/mvp-polish`
**Date:** March 2026

---

## Overview

Phase Alpha represents a comprehensive push to bring Project Clara from a functional prototype to a polished, near-MVP state. This work was broken into three sub-phases, each building on the last. Throughout this process, I made sure to preserve and build upon the strong foundations my teammates had already established - the navigation structure, context systems, backend integrations, and component library that were already in place.

---

## Phase Alpha - Core Polish

### 1. Cleanup

Removed leftover test artifacts that were no longer needed:
- Deleted `test-messaging.ts` (a smoke-test file for the messaging backend that had served its purpose)

### 2. Medical Records Feature

Built a complete medical records viewing system for parents, following the feature-folder architecture the team had established.

**New files created:**
- `src/features/medical-records/api/medicalRecordRepo.ts` - Data layer using `medicalRecordsByStudentId` GraphQL query. Follows the `RepoResult<T>` pattern (`{ data, error }`) that keeps error handling consistent across the app.
- `src/features/medical-records/logic/useMedicalRecord.ts` - React hook with `isMounted` ref guard to prevent state updates after unmount. Returns `{ record, isLoading, error }`.
- `src/features/medical-records/ui/MedicalRecordView.tsx` - Renders allergy, medication, condition, and emergency notes sections with appropriate warning icons and color coding.
- `app/(parent)/(tabs)/[studentId]/studentMedical.tsx` - Screen wrapper that passes `studentId` to the MedicalRecordView component.

**Modified files:**
- `app/(parent)/(tabs)/[studentId]/_layout.tsx` - Added the studentMedical tab registration.
- `app/(parent)/(tabs)/[studentId]/studentRecords.tsx` - Wired the Medical card's `onPress` to navigate to the new studentMedical screen.

### 3. New Conversation Flow

Added the ability for parents to start new conversations with teachers directly from the messaging screen.

**New files created:**
- `src/features/messaging/logic/useTeacherList.ts` - Builds a teacher picker list by combining data from `ParentLoginContext` (built by jgallagherunt). Instead of making extra GraphQL calls, it uses `useMemo` to derive the teacher list from `userTeachers`, `userEnrollments`, and `userStudents` that are already available in context. Deduplicates by teacher+student combination.
- `src/features/messaging/ui/NewConversationSheet.tsx` - Bottom sheet modal with a FlatList of teachers. Each row shows the teacher's name and the associated student. Slides up from the bottom with a semi-transparent overlay.

**Modified files:**
- `app/(parent)/(tabs)/messaging.tsx` - Added a floating action button (FAB) that opens the NewConversationSheet. The `handleSelectTeacher` function calls `getOrCreateDirectConversation` to either find an existing conversation or create a new one, then navigates to it.

### 4. Dashboard Home Screen Redesign

The original home screen used basic Card components that looked like plain text boxes. I completely rewrote it to feel like a modern app (think banking/telecom apps with visual hierarchy).

**Rewritten file:** `app/(parent)/(tabs)/home.tsx`

The new dashboard includes:
- **Hero welcome section** with the parent's first name, initials avatar with gradient background, and a greeting based on time of day
- **Quick actions row** with icon buttons for Messages, Students, and Live updates - each with colored icon backgrounds
- **Student cards** for each enrolled student showing their name, class name, teacher, and a color-coded attendance badge (green for 90%+, amber for 70%+, red below)
- **Messages preview card** showing the latest conversation with relative timestamps
- **Medical alerts card** that surfaces any allergies/conditions for quick reference
- **Announcements card** with the latest class announcement

All of this was built on top of the `ParentLoginContext` data that jgallagherunt had set up - `userParent`, `userStudents`, `userClasses`, `userEnrollments`, and `userTeachers` provided everything I needed without additional API calls.

A supporting hook was also created:
- `src/features/dashboard/logic/useDashboardData.ts` - Aggregates the latest conversation and medical alert data for the dashboard, with graceful fallbacks if data isn't available yet.

---

## Phase Alpha.2 - Teacher Messaging Fix

### Problem

The teacher-side messaging screens had hardcoded placeholder IDs (`PLACEHOLDER_TEACHER_ID`) instead of using real teacher identity data. This meant teachers couldn't actually send messages that would be properly attributed to them.

### Solution

After Dontoli-G expanded the `TeacherLoginContext` with real teacher data in PR #37, I was able to wire the teacher messaging screens to use actual context data.

**Modified files:**
- `app/(teacher)/(class)/(tabs)/messaging.tsx` - Replaced `PLACEHOLDER_TEACHER_ID` with `useTeacherLoginContext().userTeacher.userId`
- `app/(teacher)/conversation.tsx` - Replaced three placeholder values:
  - `senderId` now uses `userTeacher.userId`
  - `senderName` now uses `userTeacher.firstName + " " + userTeacher.lastName`
  - `currentUserId` now uses `userTeacher.userId`

This was a small but critical fix - without it, teacher messaging was non-functional. The foundation that Dontoli-G built in the TeacherLoginContext expansion made this straightforward.

---

## Phase Alpha.3 - Placeholder Screen Elimination

### Goal

Eliminate every remaining "This is a placeholder!" screen in the app. After this phase, zero screens show placeholder text.

### Screens Completed

#### 1. Account Settings (Parent)
**File:** `app/(parent)/(tabs)/(hamburger)/account_settings.tsx`

Rewrote from a placeholder to a proper profile screen showing:
- Initials avatar with themed background
- Parent's full name and role badge
- Info cards for account type, user ID, and app version
- All data pulled from `ParentLoginContext` (built by jgallagherunt)

#### 2. Account Settings (Teacher)
**File:** `app/(teacher)/(class)/(tabs)/(hamburger)/account_settings.tsx`

Same pattern as the parent version, using `TeacherLoginContext` data (expanded by Dontoli-G in PR #37).

#### 3. Notification Settings (Parent)
**File:** `app/(parent)/(tabs)/(hamburger)/notification_settings.tsx`

Rewrote to show toggle switches for:
- Push notifications (master toggle)
- Message notifications
- Announcement notifications

Settings persist via AsyncStorage with a parent-specific storage key. Toggles are properly disabled when the master push toggle is off.

#### 4. Notification Settings (Teacher)
**File:** `app/(teacher)/(class)/(tabs)/(hamburger)/notification_settings.tsx`

Same toggle pattern with a teacher-specific AsyncStorage key.

#### 5. Student Schedule (Parent)
**File:** `app/(parent)/(tabs)/[studentId]/studentSchedule.tsx`

This screen was previously an exact duplicate of `studentDocumentation.tsx` (copy-pasted content). Rewrote it to show a proper schedule view with:
- Class cards showing class name, teacher name, and subject
- Color-coded grade badges pulled from enrollment data
- Themed styling consistent with the rest of the app

Built on jgallagherunt's enrollment data structure in `ParentLoginContext`.

#### 6. Teacher Grades
**File:** `app/(teacher)/(class)/(tabs)/grades.tsx`

Rewrote to display a student list with:
- Student names from class enrollment data
- Color-coded grade badges (green 90%+, amber 70%+, red below)
- Percentage display with visual weight
- Empty state when no students are enrolled

Uses enrollment data from `TeacherLoginContext`.

#### 7. Attendance Summary (Teacher)
**File:** `app/(teacher)/(class)/(tabs)/attendance-map.tsx`

The original screen was labeled "attendance-map" and was intended to show a map view, but this isn't feasible without a maps SDK and doesn't serve the core use case well. I replaced it with a practical attendance summary showing:
- Stat cards for Enrolled, Present, Absent, and Late counts
- Today's date header
- Total historical attendance records count
- Queries `attendancesByClassId` GraphQL endpoint for real data
- Proper empty state when no records exist for today

#### 8. Student Detail Modal (Teacher)
**File:** `app/(teacher)/(class)/modal.tsx`

Rewrote from a basic placeholder to a rich student detail sheet:
- Pulls real student data from class enrollments in `TeacherLoginContext`
- Shows student name with an avatar circle
- Color-coded grade and attendance badges
- Fetches and displays medical records (allergies, medications, conditions) using the medical records feature built in Phase Alpha
- Teacher notes text input area
- Proper dark/light mode theming

#### 9. Announcements (Teacher)
**File:** `app/(teacher)/(class)/(tabs)/announcements.tsx`

Built a complete announcements system connected to DynamoDB:
- Fetches announcements via `announcementsByClassId` GraphQL query
- Groups announcements by date with decorative date separator lines
- Each announcement shows an icon, title, and body in a card layout
- FAB button opens a creation modal
- Creation modal with title and body inputs, posts via `createAnnouncement` mutation
- Proper loading, empty, and error states

**Supporting new files:**
- `src/features/announcements/api/announcementRepo.ts` - `fetchAnnouncementsByClass()` and `postAnnouncement()` functions following the RepoResult pattern
- `src/features/announcements/logic/useAnnouncements.ts` - Hook managing announcement state with load and create capabilities

---

## Technical Patterns Used Throughout

1. **RepoResult pattern** - All data layer functions return `{ data: T | null, error: string | null }` for consistent error handling
2. **isMounted ref guard** - Prevents React state updates after component unmount in async operations
3. **useThemeColor hook** - Every screen uses `useThemeColor({}, "colorName")` for full dark/light mode support
4. **Feature folder structure** - New features follow `src/features/{name}/{api,logic,ui}/` organization
5. **Context-first data access** - Wherever possible, data comes from existing context providers rather than making redundant API calls

## Teammate Contributions This Work Built Upon

- **jgallagherunt** - Built the `ParentLoginContext` with `userParent`, `userStudents`, `userClasses`, `userEnrollments`, and `userTeachers`. Also built the Card component system, Expo Router navigation structure, student tab layouts, and the original screen files. The dashboard, medical records, conversation flow, and parent-side Alpha.3 screens all rely heavily on this context data.
- **Dontoli-G** - Expanded the `TeacherLoginContext` with real teacher data in PR #37, including `userTeacher` with `userId`, `firstName`, `lastName`. This made the Alpha.2 messaging fix and all teacher-side Alpha.3 screens possible.
- **abraham562** - API key management and security configuration that keeps the Amplify backend secure.

## Result

After Phase Alpha (all sub-phases), Project Clara has:
- Zero placeholder screens remaining
- A polished, modern dashboard for parents
- Working medical records viewing
- Functional teacher-to-parent and parent-to-teacher messaging
- Real-time announcements with DynamoDB persistence
- Proper account and notification settings with local storage
- Full dark/light mode support across every screen
- Clean, consistent architecture following established team patterns
