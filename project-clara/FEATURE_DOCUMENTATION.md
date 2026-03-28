# Project Clara - Feature Documentation

## What This Covers

This doc walks through everything I built across two feature branches and explains what each piece does, why I made the decisions I made, and how it all connects together. The two branches are:

- `feature/push-notifications` - push notification system for messaging
- `feature/attendance-incidents-schedule` - attendance taking, incident reporting, and schedule viewing

Both of these branches are also combined into one branch called `feature/notifications-attendance-incidents-schedule` which has everything in one place.

---

## Branch 1: Push Notifications (`feature/push-notifications`)

### The Problem

Before this, when a parent sent a message to a teacher (or the other way around), the other person had no idea they got a message unless they opened the app and checked. There was no way to alert them in real time. This is a school communication app so that's a pretty big gap.

### What I Built

I set up a full push notification pipeline that works like this:

1. When a user opens the app, we grab their device's Expo push token and save it to our backend
2. When someone sends a message, we look up the recipient's push tokens and fire off a notification through Expo's push API
3. When the recipient taps the notification, it deep links them straight into the conversation

### Files I Created or Modified

#### `src/features/notifications/api/pushTokenRepo.ts` (New)

This is the data layer for managing push tokens. Each user can have multiple tokens because they might be logged in on more than one device (like a phone and a tablet). The tokens live in a `PushToken` table in DynamoDB with an index on `userId` so we can look them up fast.

Three functions here:

- **`registerPushToken(userId, userType, token)`** - Saves a new push token to the backend. Before creating a new record, it checks if that exact token already exists for the user so we dont end up with duplicates. If the token is already there, it just returns the existing ID. It also stores the platform (ios or android) and whether the user is a parent or teacher.

- **`unregisterPushTokens(userId)`** - Removes all push tokens for a user. This gets called when someone logs out so they stop getting notifications on that device. It loops through all their tokens and deletes the ones that arent already soft deleted.

- **`fetchPushTokensForUser(userId)`** - Gets all active push tokens for a user. Filters out any soft deleted ones. This is what we call when we need to send someone a notification and need to know what devices to hit.

All three functions use the `RepoResult<T>` pattern that returns `{ data, error }` so the calling code can handle errors cleanly.

#### `src/features/notifications/api/sendPushToUser.ts` (New)

This is the function that actually sends the push notification. It takes a payload with the recipient's user ID, a title, a body, and optional data for deep linking.

How it works:
1. Calls `fetchPushTokensForUser` to get all the recipient's device tokens
2. If they have no tokens (maybe they never opened the app or denied permissions), it just returns silently
3. Builds a message object for each token with the notification content
4. POSTs the whole batch to Expo's push API at `https://exp.host/--/api/v2/push/send`

One detail worth noting: it truncates the notification body to 100 characters. Push notification previews are small so theres no point sending a wall of text. If the message is longer than 100 chars it cuts it at 97 and adds "..." at the end.

The entire function is wrapped in a try/catch that just logs a warning on failure. This is intentional. Push notifications are a nice to have, not a requirement. If the Expo API is down or something goes wrong, the message itself still sends fine. We never want a push failure to break the messaging flow.

#### `src/features/notifications/logic/usePushNotifications.ts` (Modified)

This hook already existed but I updated it to accept `userId` and `userType` as parameters so it can register the token with our backend, not just locally.

What the hook does on mount:
1. Requests notification permissions from the user
2. Gets the device's Expo push token
3. Registers that token with our DynamoDB backend (only once per mount, using a ref guard so it doesnt re-register on every render)
4. Sets up listeners for incoming notifications and for when the user taps a notification
5. Cleans up all listeners on unmount

When a user taps a notification, the hook reads the `route` field from the notification data and uses Expo Router to navigate them to the right screen. So if a parent taps a notification from a teacher, it takes them to the conversation view on the parent side.

It also handles Android specific setup like creating a notification channel with vibration and light color settings.

#### `src/features/messaging/api/messageRepo.ts` (Modified)

I added a push notification block to the `sendMessage` function. After a message is created successfully, it fires off a push notification to the other person in the conversation.

The push notification part runs in an immediately invoked async function (IIFE) so it doesnt block the message return. The flow is:

1. Fetch the conversation to figure out who the recipient is (if a parent sent it, the teacher is the recipient and vice versa)
2. Build a title like "Mrs. Smith - Math Class" for group convos or "Jane Doe - Re: Tommy" for direct messages about a student
3. Include deep link data so tapping the notification opens the right conversation
4. Call `sendPushToUser` with all of that

If anything fails in this block, it catches the error and logs a warning. The message creation has already succeeded at this point so the user's message is safe regardless.

#### `app/(parent)/(tabs)/home.tsx` (Modified)

Added the `usePushNotifications` hook call on the parent home screen. When a parent opens the app and lands on their home page, it registers their device for push notifications. Passes their user ID and "PARENT" as the user type.

#### `app/(teacher)/(class)/(tabs)/class.tsx` (Modified)

Same thing but for teachers. When a teacher navigates to their class home page, it registers their device. Passes the teacher's user ID and "TEACHER" as the user type.

#### `amplify/backend/api/projectclara/schema.graphql` (Modified)

Added the `PushToken` model to our GraphQL schema:

```graphql
type PushToken @model {
  id: ID!
  userId: ID!
  userType: SenderType!
  token: String!
  platform: String
}
```

It has a `byUser` index on `userId` so we can efficiently query all tokens for a specific user. The `userType` field uses the existing `SenderType` enum (PARENT or TEACHER). This was deployed to AWS with `amplify push` and the DynamoDB table is live.

### Testing

#### `__tests__/notifications/pushTokenRepo.test.ts` (New)

10 unit tests covering all three functions:

For `registerPushToken`:
- Creates a new token when none exists (verifies both the query and the mutation get called)
- Returns the existing token ID if the same token is already registered (deduplication check)
- Ignores soft deleted tokens and creates a fresh one
- Returns a proper error object when GraphQL fails

For `unregisterPushTokens`:
- Deletes all non-deleted tokens and skips the soft deleted ones
- Handles empty token list without errors
- Returns error on failure

For `fetchPushTokensForUser`:
- Returns the right array of token strings and filters out deleted ones
- Returns empty array when user has no tokens
- Returns error on failure

#### `__tests__/notifications/sendPushToUser.test.ts` (New)

6 unit tests:

- Sends notification to all of a user's tokens (verifies the Expo API URL, method, headers, and message structure)
- Truncates body longer than 100 characters
- Does nothing when user has no tokens
- Does nothing when token fetch returns null
- Swallows errors silently without throwing (fire and forget verification)
- Includes empty data object when no custom data is provided

#### `jest.config.js` (New)

Set up Jest for the project using `ts-jest` with the node environment. Configured module name mapping so `@/` resolves to the project root, matching how imports work in the rest of the codebase.

### Live AWS Verification

Beyond unit tests, I also verified the system works against the actual AWS backend:

- Created test push tokens in DynamoDB via direct GraphQL mutations
- Verified the `pushTokensByUserId` index returns correct results
- Confirmed token deduplication works with real data
- Cleaned up all test data from production tables after testing

---

## Branch 2: Attendance, Incidents, and Schedule (`feature/attendance-incidents-schedule`)

This branch was created off of `feature/push-notifications` so it includes everything from that branch plus three new features.

### The Problem

Teachers had no way to take attendance, report behavioral incidents, or manage any of that through the app. Parents also couldnt see their kid's class schedule with actual meeting times. These are all things a school communication app should have.

### Feature 1: Attendance Taking (Teacher Side)

#### What It Does

Teachers can open a class, see a list of all enrolled students, and mark each one as Present, Absent, or Late. The UI updates instantly when they tap a button (optimistic updates) and syncs with the backend in the background.

#### Files

**`src/features/attendance/api/attendanceRepo.ts` (New)**

Three functions for working with attendance records in DynamoDB:

- `fetchAttendanceByClass(classId)` - Gets all attendance records for a class using the `byClass` index
- `submitAttendance({studentId, classId, date, status})` - Creates a new attendance record
- `changeAttendance({id, status})` - Updates an existing record's status (for when a teacher changes their mind)

The `AttendanceStatus` enum comes from the generated `API.ts` file (PRESENT, ABSENT, LATE). I re-export it from the repo for convenience so other files dont need to import from two places.

**`src/features/attendance/logic/useAttendance.ts` (New)**

This hook manages all the attendance state and logic:

- Loads all attendance records for the class on mount
- Filters them down to just today's records
- Exposes `saveAttendanceForStudent(studentId, status)` which figures out whether to create a new record or update an existing one
- Provides `getTodayStatus(studentId)` and `getTodayRecordId(studentId)` helpers for the UI to check current state
- Uses `isMounted` ref guard to prevent state updates after unmount

The smart part is the create vs update logic. If a student doesnt have an attendance record for today, it creates one. If they already do (like the teacher marked them present but wants to change to late), it updates the existing record instead of creating a duplicate.

**`app/(teacher)/(class)/(tabs)/take-attendance.tsx` (New)**

The UI screen teachers interact with. Built with regular React Native StyleSheet (not React Native Reusables, Jacob will swap those in later).

Layout:
- Header showing "X of Y marked" so teachers can see their progress
- FlatList of students, each with their initials in a colored circle and three buttons (Present, Absent, Late)
- Present buttons are green, Absent is red, Late is orange
- A saving banner appears at the top while a status is being synced

The big thing here is optimistic UI updates. When a teacher taps a button:
1. The UI immediately updates to show the new status (stored in `localStatuses` state)
2. The API call happens in the background
3. If the API call fails, the UI reverts back to the previous state
4. If it succeeds, we reload from the backend to stay in sync

This makes the app feel snappy even on slow connections. Teachers are marking 20+ students in a row so it would feel terrible if they had to wait for each API call.

**`__tests__/attendance/attendanceRepo.test.ts` (New)**

8 tests covering fetch, submit, and change operations. Tests success paths, empty results, null responses, and error handling for all three functions.

#### Layout Changes

Added `take-attendance` as a hidden tab in the teacher class layout (`_layout.tsx`). Its set to `href: null` so it doesnt show up in the bottom tab bar. Teachers access it from the class home grid where I replaced the old "etc." placeholder button with a "Take Attendance" button.

---

### Feature 2: Incident Reporting (Teacher Side)

#### What It Does

Teachers can report behavioral incidents for students. Each incident has a student, a severity level (Low, Medium, High, Critical), and a description. Teachers can view all past incidents for the class organized by date.

#### Files

**`src/features/incidents/api/incidentRepo.ts` (New)**

Two functions:

- `fetchIncidentsByClass(classId)` - Gets all incidents for a class. One thing I ran into here: the `byClass` DynamoDB index doesnt have a sort key, so I cant tell the server to sort by date. The query just returns them in whatever order DynamoDB feels like. Sorting happens on the client side instead.

- `reportIncident({description, severity, date, teacherId, studentId, classId, schoolId})` - Creates a new incident record. Takes all the relationship IDs so we know which teacher reported it, which student its about, which class and school it belongs to.

Incidents are intentionally immutable. Once reported you cant edit or delete them. This is a deliberate choice since incident records should be a reliable history.

**`src/features/incidents/logic/useIncidents.ts` (New)**

Hook for loading and creating incidents:

- Fetches all incidents on mount and sorts them by `createdAt` descending (newest first) on the client side since the GraphQL index cant sort for us
- `createIncident` takes the form data, auto sets today's date, calls the repo, and reloads the list on success
- Uses `isMounted` ref guard like the other hooks

**`app/(teacher)/(class)/(tabs)/incidents.tsx` (New)**

The main incidents screen with two parts: a list view and a creation modal.

The list view:
- ScrollView of incidents grouped by date with divider lines
- Each incident card shows the student name, severity badge, and description
- Severity badges are color coded: Low is green, Medium is amber/orange, High is red, Critical is purple
- When theres no incidents it shows a shield icon with "No incidents reported" and a hint to tap the + button
- One thing I had to handle carefully: dates from the backend come as just "2026-03-18" but JavaScript's `Date` constructor can shift dates by a day depending on timezone. I append `T00:00:00` to prevent that.

The creation modal:
- Floating action button (purple circle with +) in the bottom right corner
- Opens a bottom sheet modal with a form
- Student picker dropdown that shows all enrolled students
- Four severity buttons that highlight when selected
- Multi line text input for the description
- Submit button that disables until you pick a student and write a description
- Shows "Submitting..." state while the API call is in progress
- Resets the form and closes the modal after successful submission

**`__tests__/incidents/incidentRepo.test.ts` (New)**

6 tests covering fetch and report operations. Verifies correct data structure including nested student objects, handles empty results and null responses, and tests error paths.

#### Layout Changes

Added `incidents` as another hidden tab in the teacher class layout. Also accessed from the class home grid where I added an "Incidents" button with a warning icon.

---

### Feature 3: Schedule Viewing (Parent Side)

#### What It Does

Parents can see their child's class schedule with actual meeting days and times. Before this, parents could see what classes their kid was in but had no idea when they met.

#### Files

**`src/features/schedules/api/scheduleRepo.ts` (New)**

One function: `fetchSchedulesByClass(classId)` that gets all schedule entries for a class. Each schedule entry has a day of the week (MONDAY, TUESDAY, etc.), a start time, and an end time. Times come from AWS in 24 hour format like "14:30:00".

This is a read only repo. Teachers/admins would set up schedules through some other interface. This feature is just about displaying them to parents.

**`src/features/schedules/logic/useSchedules.ts` (New)**

This hook is a bit different from the others because it needs to fetch schedules for multiple classes at once (a student might be in 5 different classes). Instead of fetching them one by one, it uses `Promise.all()` to fire off all the requests in parallel and merge the results.

The dependency array for `useCallback` uses `classIds.join(",")` instead of the array directly. This is because arrays create new references on every render even if the contents are the same, and that would cause the callback to re-create unnecessarily.

**`app/(parent)/(tabs)/[studentId]/studentSchedule.tsx` (Modified)**

This screen already existed and showed basic class info (name, teacher, grade). I enhanced it to also show meeting times from the Schedule table.

What I added:
- Loading spinner while schedules are being fetched
- For each class card, a schedule section showing when it meets
- Day badges (Mon, Tue, Wed, etc.) with formatted time ranges
- A `formatTime` function that converts AWS 24 hour format to readable 12 hour format ("14:30:00" becomes "2:30 PM")
- Handles edge cases: midnight is "12:00 AM", noon is "12:00 PM"
- Schedules within each class are sorted by day of week starting from Monday
- If a class has no schedule data, it just doesnt show the schedule section (no error)

The grade badges from before are still there: green for 90%+, amber/orange for 70-89%, red for below 70%.

**`__tests__/schedules/scheduleRepo.test.ts` (New)**

5 tests for the fetch function. Checks correct data types, empty results, null response handling, error paths, and verifies the classId is passed correctly to the GraphQL query.

---

## Architecture Patterns Used Across Both Branches

### Repository Pattern (api layer)

Every feature follows the same pattern: a repo file in the `api/` folder that handles all the GraphQL calls. Every function returns `RepoResult<T>` which is `{ data: T | null, error: string | null }`. This keeps error handling consistent and makes it easy for hooks and screens to check if something went wrong.

### Hook Pattern (logic layer)

Every feature has a hook in the `logic/` folder that sits between the repo and the UI. The hooks handle:
- Loading state (`isLoading`)
- Error state (`error`)
- Data fetching on mount via `useEffect`
- Business logic (like deciding whether to create or update an attendance record)
- Memory leak prevention with `isMounted` ref

### Screen Pattern (UI layer)

Screens import the hook and render the data. They dont call GraphQL directly or manage complex state. They just consume what the hook gives them. All styling uses regular React Native StyleSheet since the plan is for Jacob to swap in React Native Reusables components later.

### Fire and Forget

Used for push notifications. The pattern is: wrap the call in a try/catch, log warnings on failure, never throw. This ensures side effects like notifications never break the main user action.

### Optimistic UI

Used in attendance. Update the UI immediately, sync in the background, revert on failure. Makes the app feel fast and responsive.

---

## Testing Summary

| Test Suite | Tests | Status |
|---|---|---|
| pushTokenRepo | 10 | All passing |
| sendPushToUser | 6 | All passing |
| attendanceRepo | 8 | All passing |
| incidentRepo | 6 | All passing |
| scheduleRepo | 5 | All passing |
| **Total** | **35** | **All passing** |

All tests mock the AWS Amplify GraphQL client and verify that the right queries/mutations are called with the right variables. They cover success paths, error paths, empty results, and edge cases like token deduplication and message truncation.

---

## Backend Status

All DynamoDB tables for these features are live in AWS:

- **PushToken table** - stores device push tokens with `byUser` index
- **Attendance table** - stores attendance records with `byClass` index
- **Incident table** - stores incident reports with `byClass` index
- **Schedule table** - stores class meeting times with `byClass` index

The GraphQL schema was updated and deployed with `amplify push`. All indexes are active and queryable. I verified this by running direct GraphQL queries against the live API during testing and cleaned up all test data afterward.

---

## Branch Structure

```
main
  |
  +-- feature/push-notifications
  |     (push token management, send notifications, messaging integration, tests)
  |
  +-- feature/attendance-incidents-schedule  (branched off push-notifications)
  |     (everything from push-notifications + attendance + incidents + schedule + tests)
  |
  +-- feature/notifications-attendance-incidents-schedule  (combined branch)
        (merge of both branches, has everything)
```

The combined branch was created by branching off `feature/push-notifications` and merging `feature/attendance-incidents-schedule` into it. No conflicts. Both original branches are still there untouched.
