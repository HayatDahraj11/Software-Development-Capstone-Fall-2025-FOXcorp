# Phase Alpha + Alpha.2 - Complete Technical Documentation

**Branch:** `feature/mvp-polish`
**Date:** March 9, 2026
**Base:** Branched from `main` at commit `98f66ca`

This document explains every change made in Phase Alpha and Phase Alpha.2 in complete detail. Every file created, every file modified, every line that matters, and why each decision was made. The foundations laid by the frontend team (Card component, ParentLoginContext, TeacherLoginContext, theming system, navigation structure, existing screens) were not disturbed. All existing components, routes, and functionality continue to work exactly as they did before.

---

## Table of Contents

1. [Summary of Changes](#summary-of-changes)
2. [Phase Alpha - Cleanup](#phase-alpha---cleanup)
3. [Phase Alpha - Medical Records Feature](#phase-alpha---medical-records-feature)
4. [Phase Alpha - New Conversation Flow](#phase-alpha---new-conversation-flow)
5. [Phase Alpha - Dashboard Home Screen Redesign](#phase-alpha---dashboard-home-screen-redesign)
6. [Phase Alpha.2 - Teacher Messaging Fix](#phase-alpha2---teacher-messaging-fix)
7. [Complete File Inventory](#complete-file-inventory)
8. [Conventions Followed](#conventions-followed)
9. [What Was NOT Changed](#what-was-not-changed)
10. [Verification Steps](#verification-steps)

---

## Summary of Changes

Phase Alpha and Alpha.2 together transform the parent side of the app from a development prototype into an MVP-ready product. The work covers four areas:

1. **Cleanup** - Deleted test artifacts that were left over from messaging backend verification
2. **Medical Records** - Built a complete new feature allowing parents to view their child's medical information (allergies, medications, conditions, emergency notes) from the Student Records screen
3. **New Conversation Flow** - Parents can now start new conversations with teachers directly from the Messages tab using a floating action button and teacher picker modal
4. **Dashboard Redesign** - Completely rewrote the parent home screen from test cards to a polished, card-based dashboard with a hero welcome section, quick action buttons, student summary cards with attendance badges, message previews, medical alerts, and announcements
5. **Teacher Messaging Fix (Alpha.2)** - Replaced all hardcoded placeholder teacher IDs with real data from TeacherLoginContext, making parent-to-teacher messaging fully two-way functional

**Totals:** 8 new files created, 6 files modified, 1 file deleted. Zero existing components or shared utilities were altered.

---

## Phase Alpha - Cleanup

### 1. Deleted: `project-clara/test-messaging.ts`

This file was a smoke test for the messaging backend. It exported a single function `testMessaging()` that:
- Created a test conversation between `test-parent-001` and `test-teacher-001`
- Sent two messages into it
- Fetched them back and logged results to the console
- Checked the parent inbox

The file itself said "Delete this file once you have confirmed everything works." Messaging backend has been confirmed working and deployed to AWS. The file was 104 lines and served no purpose in the production app.

### 2. Modified: `app/(parent)/(tabs)/home.tsx` (cleanup portion)

**What was removed:**
- Line 6 (old): `import { testMessaging } from "@/test-messaging";` - import for the deleted test file
- Line 1 (old): `import { sendPushNotification, usePushNotifications }` changed to `import { usePushNotifications }` - removed `sendPushNotification` since the notification test card that used it was removed
- Lines 45-51 (old): The entire `LocalNotificationSender` function - was only used by the notification test card
- Lines 72-76 (old): The "Send Notification" card - a test card that sent a push notification when tapped
- Lines 78-84 (old): The "Test Messaging Backend" card - a test card that called `testMessaging()` when tapped

**What was kept:**
- `usePushNotifications` hook import and usage - still needed for push token registration even without the test card. The hook registers the device with Expo's push notification service on mount, which is required for the app to receive push notifications in the future.

---

## Phase Alpha - Medical Records Feature

This is an entirely new feature. No existing files were modified to build it (only two existing files were edited to wire it into navigation). The feature follows the exact same architecture pattern as the messaging feature: api layer -> logic hook -> ui component -> screen.

### 3. Created: `src/features/medical-records/api/medicalRecordRepo.ts`

**Purpose:** Data access layer for medical records. The only file in this feature that talks to AWS.

**How it works:**

```typescript
import { generateClient } from "aws-amplify/api";
import { medicalRecordsByStudentId } from "@/src/graphql/queries";
```

Uses `generateClient()` from aws-amplify, identical to how `messageRepo.ts` and `parent_data_fetcher.ts` create their clients. Imports the auto-generated GraphQL query `medicalRecordsByStudentId` which was created by `amplify codegen` from the MedicalRecord model in `schema.graphql`.

**Types defined:**

```typescript
export interface MedicalRecord {
  id: string;
  studentId: string;
  allergies?: string | null;
  medications?: string | null;
  conditions?: string | null;
  emergencyNotes?: string | null;
}
```

These fields match the MedicalRecord model in `schema.graphql` (lines 103-113 of the schema):
```
type MedicalRecord @model @auth(rules: [{ allow: public }]) {
  id: ID!
  studentId: ID! @index(name: "byStudent")
  allergies: String
  medications: String
  conditions: String
  emergencyNotes: String
  student: Student @belongsTo(fields: ["studentId"])
}
```

**RepoResult pattern:**

```typescript
export interface RepoResult<T> {
  data: T | null;
  error: string | null;
}
```

This is the same pattern used in `messageRepo.ts` (lines 56-59). Returns either `{ data: ..., error: null }` on success or `{ data: null, error: "..." }` on failure. Forces callers to handle both cases explicitly.

**The fetch function:**

```typescript
export async function fetchMedicalRecord(
  studentId: string
): Promise<RepoResult<MedicalRecord>>
```

- Calls `client.graphql()` with the `medicalRecordsByStudentId` query, passing the studentId
- The query uses the `byStudent` GSI (Global Secondary Index) on the MedicalRecord DynamoDB table
- Returns the first item from the results (there is one medical record per student, based on the `@hasOne` relationship on the Student model)
- Wraps the entire call in try/catch so network failures return a clean error instead of crashing the app

### 4. Created: `src/features/medical-records/logic/useMedicalRecord.ts`

**Purpose:** React hook that loads a medical record for a given student.

**Pattern followed:** Identical to `useConversations.ts` (lines 23-65 of that file). Specifically:
- `useState` for `record`, `isLoading`, `error`
- `useRef(true)` for `isMounted` guard - prevents React state updates after the component unmounts, which would cause "Can't perform a React state update on an unmounted component" warnings
- `useCallback` for the load function with `[studentId]` dependency
- `useEffect` that calls `load()` on mount
- Cleanup function in a separate `useEffect` that sets `isMounted.current = false`

**Return type:**
```typescript
interface UseMedicalRecordReturn {
  record: MedicalRecord | null;
  isLoading: boolean;
  error: string | null;
}
```

### 5. Created: `src/features/medical-records/ui/MedicalRecordView.tsx`

**Purpose:** The visual component that displays a student's medical record.

**Structure:**
- Takes a single prop: `studentId: string`
- Calls `useMedicalRecord(studentId)` internally
- Has three states: loading (ActivityIndicator spinner), error (red error text), empty ("No records found")
- When data exists, renders a ScrollView with card-style sections for each field

**Section component:**
```typescript
function Section({ title, content, textColor, cardBg }: SectionProps) {
  if (!content) return null;
  return (
    <View style={[styles.card, { backgroundColor: cardBg }]}>
      <Text style={[styles.sectionTitle, { color: textColor }]}>{title}</Text>
      <Text style={[styles.sectionBody, { color: textColor }]}>{content}</Text>
    </View>
  );
}
```

Each section only renders if its content exists (not null/undefined). So if a student has allergies but no medications, only the Allergies section appears. This prevents empty cards from showing up.

**Sections rendered:**
1. Allergies
2. Medications
3. Conditions
4. Emergency Notes

**Theming:** All colors come from `useThemeColor`:
- `textColor` from `"text"` - adapts to light/dark mode
- `cardBg` from `"cardBackground"` - matches the existing card backgrounds
- `bg` from `"background"` - matches the screen background

**Styling:**
- Cards have `borderRadius: 10` and `padding: 15` to match the existing Card component's visual feel
- Section titles are `fontSize: 16, fontWeight: "bold"`
- Section body is `fontSize: 15, lineHeight: 22` for readability
- Container uses `gap: 12` for spacing between sections

### 6. Created: `app/(parent)/(tabs)/[studentId]/studentMedical.tsx`

**Purpose:** Screen wrapper for the medical records view. This is the Expo Router file-based route.

**Entire file (7 lines):**
```typescript
import { useLocalSearchParams } from "expo-router";
import MedicalRecordView from "@/src/features/medical-records/ui/MedicalRecordView";

export default function StudentMedicalScreen() {
  const { studentId } = useLocalSearchParams<{ studentId: string }>();
  return <MedicalRecordView studentId={studentId} />;
}
```

Gets `studentId` from the URL params (the `[studentId]` segment in the route path) and passes it to the view component. The screen file is intentionally minimal - all logic and UI lives in the feature folder.

### 7. Modified: `app/(parent)/(tabs)/[studentId]/_layout.tsx`

**What changed:** Added one line (line 28):
```typescript
<Tabs.Screen name="studentMedical" options={{title: "Medical Records", href: null}}/>
```

This registers the new `studentMedical` route with the Expo Router Tabs navigator. The `href: null` means it does not appear as a tab in the tab bar (it is navigated to programmatically from the Student Records screen). The `title: "Medical Records"` sets the header title when the screen is active.

**Context:** This layout file already had entries for `index`, `studentDocumentation`, `studentRecords`, and `studentSchedule`. The new entry follows the exact same pattern.

### 8. Modified: `app/(parent)/(tabs)/[studentId]/studentRecords.tsx`

**What changed:** One line (line 43). The Medical card's `onPress` handler was changed from:
```typescript
onPress={() => RouteCard(" ")}
```
to:
```typescript
onPress={() => router.push(`/(parent)/(tabs)/${studentId}/studentMedical` as Href)}
```

**Before:** Tapping the Medical card did nothing (RouteCard with a space string is a no-op, as seen in lines 18-24 of the same file).

**After:** Tapping the Medical card navigates to the new `studentMedical` screen, passing the current `studentId` in the route.

---

## Phase Alpha - New Conversation Flow

Before this change, parents could see existing conversations in their inbox, but there was no way to start a new conversation from within the app. This adds that capability.

### 9. Created: `src/features/messaging/logic/useTeacherList.ts`

**Purpose:** Builds a list of teachers that a parent can message, using data already available in ParentLoginContext.

**Key design decision:** The MVP plan originally suggested making GraphQL calls (enrollmentsByStudentId, getClass, etc.) to build this list. But after reading ParentLoginContext, it became clear that the context already has `userEnrollments`, `userClasses`, `userTeachers`, and `userStudents` fully loaded. Making additional GraphQL calls would be redundant and slow. Instead, this hook just combines the existing context data using `useMemo`.

**How it builds the list:**

```typescript
for (const enrollment of userEnrollments) {
  const cls = userClasses.find((c) => c.id === enrollment.classId);
  const teacher = userTeachers.find((t) => t.id === cls.teacherId);
  const student = userStudents.find((s) => s.id === enrollment.studentId);
  // ...
}
```

For each enrollment:
1. Find the class this enrollment belongs to (via `enrollment.classId`)
2. Find the teacher who teaches that class (via `cls.teacherId`)
3. Find the student who is enrolled (via `enrollment.studentId`)
4. Deduplicate by `teacherId + studentId` combo (a student might be enrolled in multiple classes with the same teacher)

**Return type:**
```typescript
export interface TeacherOption {
  teacherId: string;
  teacherName: string;
  studentId: string;
  studentName: string;
  className: string;
}
```

Each entry represents one "row" in the teacher picker. It includes the class name and student name for context, so a parent with multiple children can see which child the teacher is associated with.

**Dependencies:** `[userStudents, userEnrollments, userClasses, userTeachers]` - the useMemo recomputes if any of these change (which they won't during a session, but the dependency array is correct).

### 10. Created: `src/features/messaging/ui/NewConversationSheet.tsx`

**Purpose:** A bottom sheet modal that displays the list of teachers a parent can message.

**Visual design:**
- Uses React Native's `Modal` component with `animationType="slide"` and `transparent={true}`
- Semi-transparent overlay (`rgba(0,0,0,0.4)`) behind the sheet
- Sheet slides up from the bottom with rounded top corners (`borderTopLeftRadius: 16, borderTopRightRadius: 16`)
- Maximum height of 70% of the screen
- Header row with "New Conversation" title on the left and "Cancel" button on the right
- FlatList of teacher rows, each showing: teacher name (bold, 16px), class name + student name below (14px, subtext color)
- Divider lines between rows using `listBorderTranslucent` theme color
- Empty state "No teachers found" if no teachers are available

**Props:**
```typescript
interface Props {
  visible: boolean;
  onClose: () => void;
  teachers: TeacherOption[];
  onSelectTeacher: (teacher: TeacherOption) => void;
}
```

The component does not manage its own visibility or handle conversation creation. It receives the data and callbacks from the parent component (messaging.tsx). This keeps it purely presentational.

**Theming:** All five colors used come from `useThemeColor`:
- `bgColor` ("background") for the sheet background
- `cardBg` ("cardBackground") - available but not currently used in the sheet styling
- `textColor` ("text") for teacher names and the title
- `subtextColor` ("placeholderText") for class/student detail text and the Cancel button
- `borderColor` ("listBorderTranslucent") for row dividers and the header border

### 11. Modified: `app/(parent)/(tabs)/messaging.tsx`

**What changed:** This file was significantly expanded. Original was 39 lines, new version is 105 lines.

**New imports added:**
```typescript
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getOrCreateDirectConversation } from "@/src/features/messaging/api/messageRepo";
import { useTeacherList, TeacherOption } from "@/src/features/messaging/logic/useTeacherList";
import NewConversationSheet from "@/src/features/messaging/ui/NewConversationSheet";
```

**New state:**
```typescript
const [showNewConvo, setShowNewConvo] = useState(false);
```

**New hook:**
```typescript
const { teachers } = useTeacherList();
```

**New handler - `handleSelectTeacher`:**
```typescript
const handleSelectTeacher = async (teacher: TeacherOption) => {
  setShowNewConvo(false);
  const parentName = `${userParent.firstName} ${userParent.lastName}`;
  const result = await getOrCreateDirectConversation({
    parentId: userParent.userId,
    teacherId: teacher.teacherId,
    studentId: teacher.studentId,
    parentName,
    teacherName: teacher.teacherName,
    studentName: teacher.studentName,
  });
  if (result.data) {
    router.push({
      pathname: "/(parent)/conversation" as RelativePathString,
      params: { conversationId: result.data.id, conversationTitle: teacher.teacherName },
    });
    loadConversations();
  }
};
```

This function:
1. Closes the modal immediately (responsive feel)
2. Builds the parent's display name from context
3. Calls `getOrCreateDirectConversation` from messageRepo.ts - this checks if a conversation already exists for this parent+teacher+student combination. If one exists, it returns it. If not, it creates a new one in DynamoDB. This prevents duplicate conversations.
4. If successful, navigates to the conversation thread screen
5. Reloads the conversation list so the new conversation appears in the inbox

**FAB (Floating Action Button):**
```typescript
<Pressable style={styles.fab} onPress={() => setShowNewConvo(true)}>
  <Ionicons name="add" size={28} color="#fff" />
</Pressable>
```

Positioned absolutely at `bottom: 24, right: 24`, circular (56x56, borderRadius 28), the app's tint color (#0a7ea4), with a shadow for depth. Contains a white "+" icon. Tapping it sets `showNewConvo = true` which opens the NewConversationSheet modal.

**Layout change:** The `ConversationList` component is now wrapped in a `View` with `flex: 1` so the FAB can be positioned absolutely on top of it.

---

## Phase Alpha - Dashboard Home Screen Redesign

### 12. Created: `src/features/dashboard/logic/useDashboardData.ts`

**Purpose:** Aggregates data from multiple sources for the home screen dashboard cards.

**What it fetches:**

1. **Conversations:** Calls `fetchConversationsByParent(parentId)` from messageRepo.ts. Gets the total count and the most recent conversation (for the inbox preview card).

2. **Medical alerts:** Calls `fetchMedicalRecord(students[0].id)` from medicalRecordRepo.ts for the first student. If the record has an `allergies` field, stores it as the medical alert.

**Error handling:** Both fetches are wrapped in separate try/catch blocks. If either fails, the dashboard still renders - it just shows fallback values ("No messages yet", "All clear"). The dashboard should never crash because a backend call failed.

**Return type:**
```typescript
interface DashboardData {
  latestConversation: Conversation | null;
  messageCount: number;
  medicalAlert: string | null;
  isLoading: boolean;
}
```

**Pattern:** Uses the same `isMounted` ref guard as `useConversations.ts` and `useMedicalRecord.ts`.

### 13. Rewritten: `app/(parent)/(tabs)/home.tsx`

**Before:** 66 lines. A FlatList rendering three test Card components ("Clickable Test Card" x2, "Test Card" x1) plus a notification test card and a messaging test card. No real data. No visual hierarchy.

**After:** 334 lines. A complete dashboard with real data, visual hierarchy, icons, shadows, badges, and sections.

**Imports:**
```typescript
import { usePushNotifications } from "@/src/features/notifications/logic/usePushNotifications";
import { Href, useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/src/features/app-themes/logic/use-theme-color";
import { useParentLoginContext } from "@/src/features/context/ParentLoginContext";
import { useDashboardData } from "@/src/features/dashboard/logic/useDashboardData";
```

Note: The old `Card` component import was removed. The dashboard uses custom-styled Pressable components instead of the generic Card, because the Card component is designed for simple header+preview text layouts and does not support icons, badges, row layouts, or color-coded indicators.

**Data sources:**
- `usePushNotifications()` - kept for push token registration
- `useParentLoginContext()` - provides `userParent` (name, userId) and `userStudents` (children array)
- `useDashboardData()` - provides `latestConversation`, `messageCount`, `medicalAlert`

**Theme colors used (6 total):**
- `bg` ("background") - screen background
- `cardBg` ("cardBackground") - card backgrounds
- `textColor` ("text") - primary text
- `subtextColor` ("placeholderText") - secondary text, date, subtitles
- `tint` ("tint") - accent color for icons, avatar circle, quick action buttons
- `urgent` ("urgent") - medical alert text color when there is an allergy

**UI Sections (top to bottom):**

**1. Hero Welcome Section (lines 34-52)**
- Left side: "Welcome back," (16px, weight 400) on first line, parent's first name (28px, weight 700) on second line
- Right side: circular avatar (48x48, borderRadius 24) with the parent's initials in white text on the tint color background
- Below: today's date formatted as "Monday, March 9" in the subtext color
- marginBottom: 24 to separate from the next section

**2. Quick Actions Row (lines 54-77)**
- Three equal-width buttons in a horizontal row with `gap: 12`
- Each button: cardBackground color, borderRadius 14, paddingVertical 16, subtle shadow (shadowOpacity 0.08)
- Each has an Ionicon on top and a label below (12px, weight 600, marginTop 6)
- Messages button: `chatbubbles` icon, navigates to `/(parent)/(tabs)/messaging`
- Students button: `people` icon, navigates to `/(parent)/(tabs)/general-info`
- Live button: `pulse` icon, navigates to `/(parent)/(tabs)/live-updates`

**3. "YOUR CHILDREN" Section Label (line 80)**
- 12px, weight 700, letterSpacing 1, subtext color
- This is the design pattern used by banking/fintech apps for section headers

**4. Student Cards (lines 82-124)**
- One card per child, dynamically generated from `userStudents.map()`
- Each card is a Pressable (navigates to general-info on tap) with cardBackground, borderRadius 14, padding 16, subtle shadow
- Layout is a horizontal row with gap 14:
  - Left: 44x44 icon container with borderRadius 12, tint color at 12% opacity (`tint + "20"`), person icon in tint color
  - Middle: student name (16px, weight 600) and grade/status subtitle (13px)
  - Right: attendance badge (if attendance data exists) + chevron-forward icon
- Attendance badge is color-coded:
  - Green (`#22c55e` background at 12% opacity, `#16a34a` text) if >= 90%
  - Yellow (`#f59e0b` background at 12% opacity, `#d97706` text) if >= 75%
  - Red (`#ef4444` background at 12% opacity, `#dc2626` text) if < 75%
- Badge has paddingHorizontal 10, paddingVertical 4, borderRadius 8

**5. "UPDATES" Section Label (line 127)**
- Same styling as "YOUR CHILDREN"

**6. Messages Card (lines 129-153)**
- Blue icon theme (`#3b82f6` at 12% opacity background, solid `#3b82f6` icon)
- Icon: `chatbubble-ellipses`
- Title: "Messages"
- Subtitle: either `"{teacherName}: {lastMessageText}"` from the latest conversation, or "No messages yet"
- If there are conversations, shows a count badge (blue circle with white number)
- `numberOfLines={1}` on the subtitle to truncate long message previews
- Navigates to `/(parent)/(tabs)/messaging`

**7. Medical Card (lines 155-176)**
- Dynamic icon based on whether there's a medical alert:
  - Alert exists: red theme (`#ef4444` at 12% opacity, `#dc2626` icon), `warning` icon
  - No alert: green theme (`#22c55e` at 12% opacity, `#16a34a` icon), `shield-checkmark` icon
- Title: "Medical"
- Subtitle: either `"Allergies: {allergies}"` in the urgent color, or "All clear" in subtext color
- Navigates to `/(parent)/(tabs)/general-info`

**8. Announcements Card (lines 178-190)**
- Purple icon theme (`#8b5cf6` at 12% opacity, solid `#8b5cf6` icon)
- Icon: `megaphone`
- Title: "Announcements"
- Subtitle: "Coming soon"
- No navigation (onPress is empty function) - placeholder for future feature

**StyleSheet (lines 197-333):**
All styles are defined outside the component function (not inside it like the old version), which is more performant since they are not recreated on every render. The old version called `useThemeColor` inside `StyleSheet.create` which is technically incorrect. The new version passes theme colors via inline style arrays (`style={[styles.card, { backgroundColor: cardBg }]}`) which is the React Native best practice.

---

## Phase Alpha.2 - Teacher Messaging Fix

### 14. Modified: `app/(teacher)/(class)/(tabs)/messaging.tsx`

**The problem:** The teacher inbox was querying conversations using a hardcoded `PLACEHOLDER_TEACHER_ID = "teacher-debug-001"`. When a parent created a conversation with a real teacher (e.g., teacher ID from the database), the teacher's inbox would query for `teacherId = "teacher-debug-001"` which would not match, so the conversation would never appear.

**What was removed:**
```typescript
// TODO: pull from TeacherLoginContext once it exposes teacher data
const PLACEHOLDER_TEACHER_ID = "teacher-debug-001";
```

**What was added:**
```typescript
import { useTeacherLoginContext } from "@/src/features/context/TeacherLoginContext";
// ...
const { userTeacher } = useTeacherLoginContext();
// ...
useConversations("teacher", userTeacher.userId);
```

**Why this works now:** TeacherLoginContext was expanded (by the frontend team in a previous PR, merged into main via PR #37) to expose `userTeacher` with a `userId` field. This was not available when the messaging screens were originally written. The context loads teacher data either from AWS (real login) or from `debug_teacher` (debug login), so both flows are covered.

### 15. Modified: `app/(teacher)/conversation.tsx`

**Same problem, three places:**

**Removed:**
```typescript
// TODO: pull from TeacherLoginContext once it exposes teacher data
const PLACEHOLDER_TEACHER_ID = "teacher-debug-001";
const PLACEHOLDER_TEACHER_NAME = "Teacher (debug)";
```

**Added:**
```typescript
import { useTeacherLoginContext } from "@/src/features/context/TeacherLoginContext";
// ...
const { userTeacher } = useTeacherLoginContext();
```

**Three substitutions:**
1. `senderId: PLACEHOLDER_TEACHER_ID` changed to `senderId: userTeacher.userId` (line 33)
   - This means messages sent by the teacher are now tagged with their real ID, so the parent sees them correctly
2. `senderName: PLACEHOLDER_TEACHER_NAME` changed to `senderName: userTeacher.name` (line 35)
   - Messages now show the teacher's real name instead of "Teacher (debug)"
3. `currentUserId={PLACEHOLDER_TEACHER_ID}` changed to `currentUserId={userTeacher.userId}` (line 100)
   - This is used by MessageBubble to determine which messages are "yours" (shown on the right in blue) vs "theirs" (shown on the left). Without this fix, ALL messages would appear as "theirs" because the bubble was comparing against the wrong ID.

---

## Complete File Inventory

### New Files (8)

| # | File | Lines | Purpose |
|---|------|-------|---------|
| 1 | `src/features/medical-records/api/medicalRecordRepo.ts` | 37 | Data layer - fetches medical records from DynamoDB via GraphQL |
| 2 | `src/features/medical-records/logic/useMedicalRecord.ts` | 45 | React hook - loads a medical record for a student |
| 3 | `src/features/medical-records/ui/MedicalRecordView.tsx` | 90 | UI component - renders allergies, medications, conditions, emergency notes |
| 4 | `app/(parent)/(tabs)/[studentId]/studentMedical.tsx` | 7 | Screen wrapper - Expo Router entry for medical records |
| 5 | `src/features/messaging/logic/useTeacherList.ts` | 49 | React hook - builds teacher picker list from context data |
| 6 | `src/features/messaging/ui/NewConversationSheet.tsx` | 115 | UI component - bottom sheet modal for selecting a teacher |
| 7 | `src/features/dashboard/logic/useDashboardData.ts` | 60 | React hook - aggregates data for home screen cards |
| 8 | (directory) `src/features/dashboard/` | - | New feature directory |

### Modified Files (6)

| # | File | Change |
|---|------|--------|
| 1 | `app/(parent)/(tabs)/home.tsx` | Complete rewrite - test cards to polished dashboard |
| 2 | `app/(parent)/(tabs)/messaging.tsx` | Added FAB button, teacher picker modal, new conversation flow |
| 3 | `app/(parent)/(tabs)/[studentId]/_layout.tsx` | Added one line - registered studentMedical tab |
| 4 | `app/(parent)/(tabs)/[studentId]/studentRecords.tsx` | Changed Medical card onPress to navigate to studentMedical |
| 5 | `app/(teacher)/(class)/(tabs)/messaging.tsx` | Replaced placeholder ID with TeacherLoginContext (Alpha.2) |
| 6 | `app/(teacher)/conversation.tsx` | Replaced 3 placeholder values with TeacherLoginContext (Alpha.2) |

### Deleted Files (1)

| # | File | Reason |
|---|------|--------|
| 1 | `project-clara/test-messaging.ts` | Smoke test file, messaging confirmed working, file says to delete after confirmation |

---

## Conventions Followed

Every piece of code written follows the established project conventions:

1. **`useThemeColor({}, "colorName")`** for all colors - ensures light/dark mode support
2. **`generateClient()` from `aws-amplify/api`** for GraphQL client creation
3. **`RepoResult<T>` pattern** for data functions - `{ data: T | null, error: string | null }`
4. **`isMounted` ref guard** in hooks - prevents state updates after unmount
5. **`StyleSheet.create()`** for all styles
6. **Ionicons** for all icons (already used across the app)
7. **Feature folder structure:** `src/features/{feature-name}/{api,logic,ui}/`
8. **Screen files in `app/` directory** following Expo Router file-based routing
9. **TypeScript** with explicit types for all props, return values, and interfaces

---

## What Was NOT Changed

The following existing code was not modified in any way:

- `src/features/cards/ui/Card.tsx` - the existing Card component
- `src/features/context/ParentLoginContext.tsx` - parent login context
- `src/features/context/TeacherLoginContext.tsx` - teacher login context
- `src/features/messaging/api/messageRepo.ts` - messaging data layer
- `src/features/messaging/logic/useConversations.ts` - conversation list hook
- `src/features/messaging/logic/useMessages.ts` - message thread hook
- `src/features/messaging/ui/ConversationItem.tsx` - inbox row component
- `src/features/messaging/ui/ConversationList.tsx` - inbox list component
- `src/features/messaging/ui/MessageBubble.tsx` - chat bubble component
- `src/features/messaging/ui/MessageInput.tsx` - chat input component
- `src/features/app-themes/constants/theme.ts` - theme colors
- `src/features/app-themes/logic/use-theme-color.ts` - theme hook
- `src/features/notifications/logic/usePushNotifications.ts` - push notification hook
- `src/features/fetch-user-data/api/parent_data_fetcher.ts` - parent data types and fetcher
- `src/features/fetch-user-data/api/teacher_data_fetcher.ts` - teacher data types and fetcher
- `app/(parent)/_layout.tsx` - parent layout/navigation
- `app/(teacher)/_layout.tsx` - teacher layout/navigation
- `amplify/backend/api/projectclara/schema.graphql` - GraphQL schema
- All auto-generated files in `src/graphql/` (queries.ts, mutations.ts, subscriptions.ts, schema.json)
- All other existing screens and components

The foundations laid by the frontend team were preserved entirely. New code was added alongside existing code, not on top of it.

---

## Verification Steps

### Dashboard
1. Run `npx expo start --clear`
2. Log in with a parent debug account
3. Home screen should show: welcome section with name + initials avatar, quick action buttons, student cards with attendance badges, messages card, medical card, announcements card
4. Tap any student card - navigates to general-info
5. Tap Messages quick action or Messages card - navigates to messaging tab
6. Tap Live quick action - navigates to live-updates

### Medical Records
1. From home, navigate to a student's details
2. Tap Student Records
3. Tap Medical card - should navigate to the Medical Records screen
4. Screen shows medical data or "No records found" (depending on whether data exists in DynamoDB for that student)

### New Conversation Flow
1. Navigate to Messages tab
2. Blue FAB button should be visible in bottom-right corner
3. Tap FAB - teacher picker modal slides up
4. Select a teacher - conversation is created (or existing one is found) and chat thread opens
5. Navigate back - new conversation should appear in the inbox list

### Two-Way Messaging (Alpha.2)
1. Log in as a parent on one device, send a message to a teacher
2. Log in as a teacher on another device
3. Teacher should see the conversation in their inbox
4. Teacher can open the conversation and see the parent's messages
5. Teacher can reply and the parent sees the reply
