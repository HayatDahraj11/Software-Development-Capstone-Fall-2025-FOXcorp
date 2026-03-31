# Project Clara MVP Polish Plan

## Context
Messaging backend is live and tested. The app works but looks rough — placeholder screens, test artifacts, no medical records UI, and the home screen is just test cards. This plan covers: card-based dashboard redesign, messaging "new conversation" flow, medical records display, and cleanup. Goal is to make it feel like a real app (Bank of America / T-Mobile card-based dashboard style) without breaking what the frontend team has already built.

---

## Phase A: Cleanup (do first, zero risk)

### 1. Delete test-messaging.ts
**File:** `test-messaging.ts` — DELETE

### 2. Clean home.tsx test artifacts
**File:** `app/(parent)/(tabs)/home.tsx` — EDIT
- Remove `testMessaging()` import and its card (lines 78-83)
- Remove the notification test card (lines 72-76)
- Will be fully rewritten in Phase D anyway

---

## Phase B: Medical Records (new files, nothing breaks)

### 3. Medical records data layer
**File:** `src/features/medical-records/api/medicalRecordRepo.ts` — NEW
- Uses `generateClient()` + imports `medicalRecordsByStudentId` from `@/src/graphql/queries`
- Single function: `fetchMedicalRecord(studentId: string): Promise<RepoResult<MedicalRecord>>`
- Returns first record from the GSI query (one record per student)
- Follows `messageRepo.ts` RepoResult pattern exactly

### 4. Medical records hook
**File:** `src/features/medical-records/logic/useMedicalRecord.ts` — NEW
- `useMedicalRecord(studentId: string)`
- Returns `{ record, isLoading, error }`
- Loads on mount with isMounted guard (same pattern as useConversations)

### 5. Medical records display component
**File:** `src/features/medical-records/ui/MedicalRecordView.tsx` — NEW
- Props: `{ studentId: string }`
- Uses `useMedicalRecord` hook internally
- Renders sections for: Allergies, Medications, Conditions, Emergency Notes
- Each section is a card-style block with a header and body text
- Shows "No records found" if data is null, ActivityIndicator while loading
- All colors via `useThemeColor`

### 6. Medical records screen
**File:** `app/(parent)/(tabs)/[studentId]/studentMedical.tsx` — NEW
- Gets `studentId` from `useLocalSearchParams()`
- Renders `<MedicalRecordView studentId={studentId} />`
- Simple wrapper screen

### 7. Register medical screen in layout
**File:** `app/(parent)/(tabs)/[studentId]/_layout.tsx` — EDIT
- Add: `<Tabs.Screen name="studentMedical" options={{title: "Medical Records", href: null}}/>`

### 8. Wire up Medical card in student records
**File:** `app/(parent)/(tabs)/[studentId]/studentRecords.tsx` — EDIT
- Change Medical card's `onPress` from `RouteCard(" ")` to navigate to `studentMedical` screen
- Route: `/(parent)/(tabs)/${studentId}/studentMedical`

---

## Phase C: New Conversation Flow (messaging enhancement)

### 9. Teacher list hook
**File:** `src/features/messaging/logic/useTeacherList.ts` — NEW
- `useTeacherList(studentIds: string[])`
- For each student: calls `enrollmentsByStudentId` → gets classIds → calls `getClass` for each → extracts teacher info
- Returns `{ teachers: Array<{teacherId, teacherName, studentId, studentName, className}>, isLoading }`
- Deduplicates by teacherId
- Uses generated queries from `@/src/graphql/queries`

### 10. New conversation picker modal
**File:** `src/features/messaging/ui/NewConversationSheet.tsx` — NEW
- Props: `{ visible, onClose, teachers[], onSelectTeacher(teacher) }`
- Modal overlay with FlatList of teachers
- Each row shows: teacher name, class name, student name
- Tapping a teacher calls `onSelectTeacher` → parent creates/opens the conversation
- Uses useThemeColor for all styling

### 11. Add FAB + new conversation flow to parent messaging
**File:** `app/(parent)/(tabs)/messaging.tsx` — EDIT
- Import `useTeacherList` with student IDs from `useParentLoginContext().userStudents`
- Import `NewConversationSheet`
- Import `getOrCreateDirectConversation` from messageRepo
- Add state: `showNewConvo` boolean
- Add floating action button (bottom-right, "+" icon) that sets `showNewConvo = true`
- On teacher selected: call `getOrCreateDirectConversation`, then navigate to conversation screen
- Wrap existing ConversationList in a View to position the FAB

---

## Phase D: Dashboard Home Screen (highest impact, do last)

### 12. Dashboard data hook
**File:** `src/features/dashboard/logic/useDashboardData.ts` — NEW
- `useDashboardData(parentId: string, students: Student[])`
- Aggregates data for the home screen cards:
  - Unread message count: calls `fetchConversationsByParent` and counts conversations with recent `lastMessageAt`
  - Latest announcement: placeholder for now (no announcement query by parent exists yet)
  - Student quick stats: uses data already in `userStudents` (attendanceRate, currentStatus, gradeLevel)
  - Medical alerts: calls `medicalRecordsByStudentId` for first student to check for allergies
- Returns `{ messagePreview, studentSummaries[], medicalAlert, isLoading }`
- All calls wrapped in try-catch, graceful fallbacks

### 13. Rewrite parent home screen as dashboard
**File:** `app/(parent)/(tabs)/home.tsx` — REWRITE
- Remove all test cards and notification code
- Keep `usePushNotifications` for token registration (still needed)
- Use `useDashboardData` hook
- Render a ScrollView of dashboard cards using existing `Card` component:
  1. **Welcome Card** — "Welcome, {firstName}" with current date
  2. **Student Card** (one per child) — name, grade, attendance rate, current status. Taps to `/(parent)/(tabs)/general-info`
  3. **Messages Card** — preview of latest conversation or "No messages yet". Taps to messaging tab
  4. **Medical Card** — shows allergy alert if exists, or "All clear". Taps to student records
  5. **Announcements Card** — placeholder "Coming soon" for now
- Uses existing Card component (no new component needed — the existing Card with header/preview is exactly the dashboard card pattern)

---

## Files Summary

| # | File | Action |
|---|------|--------|
| 1 | `test-messaging.ts` | DELETE |
| 2 | `app/(parent)/(tabs)/home.tsx` | EDIT → REWRITE |
| 3 | `src/features/medical-records/api/medicalRecordRepo.ts` | NEW |
| 4 | `src/features/medical-records/logic/useMedicalRecord.ts` | NEW |
| 5 | `src/features/medical-records/ui/MedicalRecordView.tsx` | NEW |
| 6 | `app/(parent)/(tabs)/[studentId]/studentMedical.tsx` | NEW |
| 7 | `app/(parent)/(tabs)/[studentId]/_layout.tsx` | EDIT (add tab) |
| 8 | `app/(parent)/(tabs)/[studentId]/studentRecords.tsx` | EDIT (wire route) |
| 9 | `src/features/messaging/logic/useTeacherList.ts` | NEW |
| 10 | `src/features/messaging/ui/NewConversationSheet.tsx` | NEW |
| 11 | `app/(parent)/(tabs)/messaging.tsx` | EDIT (add FAB + modal) |
| 12 | `src/features/dashboard/logic/useDashboardData.ts` | NEW |

**Total: 7 new files, 4 edits, 1 deletion**

## Conventions
- `useThemeColor({}, "colorName")` for all colors
- `generateClient()` from `aws-amplify/api` for GraphQL
- StyleSheet inside component
- Ionicons for icons
- No AI comments/attribution
- RepoResult<T> pattern for all data functions
- isMounted guard in hooks

## Verification
1. Parent debug login → home screen shows dashboard cards (no test buttons)
2. Tap student card → navigates to general-info
3. Tap messages card → navigates to messaging tab
4. Messages tab → FAB visible → tap → teacher picker shows → select teacher → conversation opens
5. Student Records → Medical card → medical records screen loads with data (or "No records" gracefully)
6. App doesn't crash with debug/test accounts that have no real data


your best practice:
 1. Let me read the existing files first before I edit anything — I'll understand the patterns and won't break things
  2. Review each change before approving — don't just approve all, glance at diffs
  3. One phase at a time — exactly what we're doing, keeps context focused
  4. Tell me if something looks off — course-correcting early is way cheaper than fixing later
  5. Make sure we're on the right branch — let me check that now