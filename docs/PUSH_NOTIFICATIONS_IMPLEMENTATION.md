# Push Notifications Implementation

**Author:** Hayat Dahraj
**Date:** March 18, 2026
**Branch:** `feature/push-notifications`

---

## What I Did

We already had the Expo push notification infrastructure in place from earlier work. The `usePushNotifications` hook was registering devices, getting Expo push tokens, and handling notification taps with deep linking. But the tokens were never being saved anywhere and nothing was actually triggering notifications when messages came in. So I built out the full pipeline from token storage to notification delivery.

---

## The Problem

When a parent sends a message to a teacher (or vice versa), the only way the other person sees it is if they have the conversation open at that exact moment. The AppSync subscription handles real time delivery when youre looking at the screen, but if the app is closed or youre on a different screen you have no idea a message came in. Thats a bad experience for a school communication app where timely responses matter.

---

## What Was Already In Place

- `expo-notifications` and `expo-device` were installed
- `usePushNotifications` hook existed and was getting Expo push tokens on physical devices
- The hook handled notification permissions, Android channel setup, and tap-to-navigate via route data
- The parent home screen was calling the hook but not doing anything with the token beyond holding it in state
- Notification settings UI existed with toggles stored in AsyncStorage

What was missing was everything between "we have a token" and "the other person gets a notification."

---

## What I Built

### 1. PushToken Table in DynamoDB

Added a new `PushToken` model to the GraphQL schema and deployed it to AWS. This table stores the Expo push token for each users device.

**Schema addition:**
```graphql
type PushToken @model @auth(rules: [{ allow: public }]) {
  id: ID!
  userId: ID! @index(name: "byUser", queryField: "pushTokensByUserId")
  userType: SenderType!
  token: String!
  platform: String!
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}
```

Each row represents one device for one user. The `byUser` index lets us quickly query "give me all push tokens for this userId" which is what we need when sending a notification. I reused the existing `SenderType` enum (PARENT or TEACHER) for `userType` so theres no new enum to maintain.

I also had to fix a pre-existing schema issue while I was in there. The `Schedule` model had a `@belongsTo` pointing to `Class` but `Class` was missing the matching `@hasMany` for schedules. Same kind of relationship fix I did back when I first added the messaging models. Added `schedules: [Schedule] @hasMany(indexName: "byClass", fields: ["id"])` to the Class model.

After updating the schema I ran `amplify push` and `amplify codegen` to deploy the new table and generate the GraphQL operations.

### 2. Push Token Repository

**New file:** `src/features/notifications/api/pushTokenRepo.ts`

This is the data layer for push tokens. Three functions following the same RepoResult pattern we use everywhere:

- **`registerPushToken(userId, userType, token)`** - Saves an Expo push token to DynamoDB. Before creating a new row it checks if this exact token already exists for this user to avoid duplicates. This matters because the hook runs on every mount and we dont want to create a new row every time someone opens the app.

- **`unregisterPushTokens(userId)`** - Deletes all push tokens for a user. This is for logout, when we want to stop sending notifications to a device that the user is no longer signed into.

- **`fetchPushTokensForUser(userId)`** - Returns all Expo push token strings for a given user. This is what the notification sender uses to know where to send the push. A user can have multiple devices so this returns an array.

### 3. Push Notification Sender

**New file:** `src/features/notifications/api/sendPushToUser.ts`

This is a simple utility that takes a recipient userId, a title, a body, and optional route data, then:

1. Looks up all the recipients Expo push tokens from DynamoDB
2. If they have no tokens (denied permissions, never logged in on a physical device) it silently returns
3. Builds the notification payload for each token
4. Sends them all to the Expo Push API (`https://exp.host/--/api/v2/push/send`)

The Expo Push API handles routing to APNs for iOS and FCM for Android. We dont have to deal with either platform directly.

The body gets truncated to 100 characters for the notification preview. The full message is still in the app when they open it.

The whole thing is wrapped in a try-catch and will never throw. If push fails for any reason it just logs a warning and moves on. Sending the actual message is way more important than the notification about it.

### 4. Updated usePushNotifications Hook

**Modified file:** `src/features/notifications/logic/usePushNotifications.ts`

The hook now accepts optional `userId` and `userType` parameters. When both are provided and the Expo push token is obtained, it automatically calls `registerPushToken` to save the token to DynamoDB. I added a `hasRegistered` ref to prevent duplicate registration calls across re-renders.

All existing behavior is preserved. If you call the hook without userId/userType it works exactly like before, it just doesnt save the token to the backend.

### 5. Wired Push Notifications Into Message Sending

**Modified file:** `src/features/messaging/api/messageRepo.ts`

This is where everything comes together. After `sendMessage` creates a message in DynamoDB (and fires the conversation preview update), it now also triggers a push notification to the recipient. The flow:

1. Looks up the conversation to get parentId and teacherId
2. Determines the recipient: if sender is PARENT, recipient is the teacher. If sender is TEACHER, recipient is the parent
3. Builds a notification with the senders name as the title and the message body as the preview
4. Includes route data so tapping the notification opens the conversation directly
5. Sends it via `sendPushToUser`

The entire push notification flow is fire-and-forget. It runs asynchronously after the message is already created and returned to the UI. If it fails for any reason the user still sees their message sent successfully. The recipient just wont get a push notification that one time.

For context in the notification, direct messages show "SenderName - Re: StudentName" and group messages show "SenderName - ClassName".

### 6. Token Registration on Both Sides

**Modified file:** `app/(parent)/(tabs)/home.tsx`

The parent home screen now passes `userParent.userId` and `"PARENT"` to the push hook so the parents token gets registered when they open the app.

**Modified file:** `app/(teacher)/(class)/(tabs)/class.tsx`

Same thing for the teacher side. Passes `userTeacher.userId` and `"TEACHER"` to the push hook when a teacher opens their class view.

---

## How It All Flows End to End

```
Parent opens app
  -> usePushNotifications gets Expo push token
  -> registerPushToken saves it to DynamoDB PushToken table

Parent sends message to teacher
  -> createMessage saves to DynamoDB Message table
  -> conversation preview updates (fire-and-forget)
  -> getConversation looks up who the teacher is
  -> fetchPushTokensForUser gets teacher's Expo tokens
  -> Expo Push API sends notification to teacher's device(s)

Teacher's phone shows notification: "Jane Smith - Re: Johnny"
Teacher taps notification
  -> App opens to /(teacher)/conversation with conversationId
  -> Full message history loads
```

Same flow works in reverse for teacher to parent.

---

## Files Changed

| File | Action | What Changed |
|------|--------|-------------|
| `amplify/backend/api/projectclara/schema.graphql` | EDIT | Added PushToken model, fixed Schedule/Class relationship |
| `src/features/notifications/api/pushTokenRepo.ts` | NEW | Token CRUD operations (register, unregister, fetch) |
| `src/features/notifications/api/sendPushToUser.ts` | NEW | Sends push via Expo Push API |
| `src/features/notifications/logic/usePushNotifications.ts` | EDIT | Added userId/userType params, auto-registers token |
| `src/features/messaging/api/messageRepo.ts` | EDIT | Sends push to recipient after message creation |
| `app/(parent)/(tabs)/home.tsx` | EDIT | Passes userId to push hook |
| `app/(teacher)/(class)/(tabs)/class.tsx` | EDIT | Passes userId to push hook |
| `src/graphql/queries.ts` | AUTO | Regenerated by amplify codegen |
| `src/graphql/mutations.ts` | AUTO | Regenerated by amplify codegen |
| `src/graphql/subscriptions.ts` | AUTO | Regenerated by amplify codegen |
| `src/API.ts` | AUTO | Regenerated by amplify codegen |

---

## Design Decisions

### Why Client-Side Push Instead of Lambda

The original plan was to use a Lambda function triggered by DynamoDB streams on the Message table. That would handle notification sending server-side. I went with client-side sending instead because:

1. Adding a Lambda through Amplify CLI requires interactive prompts that are hard to automate
2. Client-side is simpler to deploy, debug, and modify
3. For our scale (school communication app, not millions of users) the overhead is negligible
4. If we need to move to Lambda later the `sendPushToUser` function is already isolated and can be lifted into a Lambda handler with minimal changes

### Why Fire-and-Forget Everywhere

Every notification-related operation (token registration, push sending) is fire-and-forget. None of them block the main user action. If push fails the user still sees their message sent, the conversation still updates, everything still works. The notification is a nice-to-have on top of the core functionality, not a dependency of it.

### Why No Notification Preferences Check Yet

The notification settings screen saves preferences to AsyncStorage locally. The push sending happens on the senders device, not the recipients. So we cant check the recipients preferences before sending. The two options are:

1. Store preferences in DynamoDB and check them before sending
2. Let all notifications come through and filter on the receiving device

Option 2 is simpler and what Ill do next. The `usePushNotifications` hook already receives incoming notifications, it just needs to check AsyncStorage before displaying them.

---

## Whats Still Needed

- **Notification preference filtering** - check AsyncStorage on the receiving device before showing the notification
- **Token cleanup on logout** - call `unregisterPushTokens` when user logs out so they stop getting notifications on that device
- **Announcement notifications** - when a teacher posts an announcement, notify all parents in that class. This needs a lookup chain (class -> enrollments -> students -> parents) that I havent built yet
- **Testing on physical devices** - push notifications only work on real devices, not simulators. Need two physical devices to test the full flow
