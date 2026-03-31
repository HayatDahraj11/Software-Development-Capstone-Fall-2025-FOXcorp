# Messaging System for Project Clara

This document explains everything about the messaging system. What it does, how it works, what has been built, what files were created, what was changed, and what still needs to be done. Written in plain language so any team member can read this and understand the full picture.

---

## Table of Contents

1. [What the Messaging System Does](#what-the-messaging-system-does)
2. [How It Works at a High Level](#how-it-works-at-a-high-level)
3. [The Database (Schema)](#the-database-schema)
4. [Every File That Was Created or Changed](#every-file-that-was-created-or-changed)
5. [How the Code is Organized](#how-the-code-is-organized)
6. [How Each Piece Works](#how-each-piece-works)
7. [How Navigation and Routing Works](#how-navigation-and-routing-works)
8. [Real Time Messaging (Subscriptions)](#real-time-messaging-subscriptions)
9. [Optimistic Sending](#optimistic-sending)
10. [Schema Fixes That Were Made](#schema-fixes-that-were-made)
11. [What is Done](#what-is-done)
12. [What Still Needs to Be Done](#what-still-needs-to-be-done)
13. [How to Test](#how-to-test)
14. [How to Pick Up Where This Left Off](#how-to-pick-up-where-this-left-off)

---

## What the Messaging System Does

The messaging system lets parents and teachers talk to each other inside the app. There are two types of conversations:

1. **Direct Messages (DIRECT)**: A one on one thread between a single parent and a single teacher about a specific student. For example, "Mrs. Smith" messages "John's Mom" about John's behavior in class.

2. **Group Broadcasts (GROUP)**: A teacher sends a message to their entire class. Every parent with a student in that class can see the message and reply. For example, a teacher announces a field trip to all parents at once.

Parents see their conversations in the Messages tab. Teachers see their conversations in their Messages tab too. Tapping a conversation opens the full chat thread where you can read the history and send new messages.

Messages show up in real time. If a parent sends a message, the teacher sees it appear on their screen instantly without needing to refresh or pull down. This works through AWS AppSync subscriptions which keep a live connection open between the app and the server.

---

## My Thought Process and Why I Built It This Way

Before writing any code I sat down and looked at how other messaging apps handle things. The big question was whether to use one model for everything or split conversations and messages into separate tables. I went with two tables because it keeps things clean. The Conversation table is basically the "inbox row" and the Message table holds the actual chat history. This way loading the inbox is one fast query and you only load the full message history when someone actually opens a thread.

The next decision was about names. When you open your inbox you see "Mrs. Smith" or "John's Mom" next to each conversation. The obvious approach is to look up that name from the Parent or Teacher table every time. But that means if you have 20 conversations, you are making 20 extra database calls just to show the inbox. That is way too slow on mobile. So I stored the names directly on the Conversation row when it gets created. Yes it means the data is duplicated, but the tradeoff is worth it. The inbox loads in a single query now.

For real time I looked at polling (checking the server every few seconds) vs subscriptions (keeping a live connection open). Polling is simpler but it wastes bandwidth and battery, and messages feel delayed. AppSync subscriptions give us true real time with no polling. The tradeoff is a bit more code to manage the WebSocket lifecycle, but I think the user experience is way better.

The optimistic sending was something I really wanted to get right. Nothing kills the feel of a chat app more than hitting send and watching a spinner for two seconds. So the message appears immediately with a temporary ID, and then the real server response swaps in silently in the background. If the network call fails (which almost never happens), the message just disappears. This is the same pattern iMessage and WhatsApp use.

I also had to think about how to prevent duplicate conversations. If a parent taps "message teacher" twice quickly, we should not end up with two identical threads. The `getOrCreateDirectConversation` function handles this by checking if a conversation already exists for that exact parent/teacher/student combination before creating a new one.

For the teacher side, I knew TeacherLoginContext only has `isDebug` right now and does not expose the teacher's actual ID or name. Rather than blocking on that, I used placeholder constants with clear TODO comments so the UI is fully built and functional, and someone just needs to swap in the real values once the context is expanded. This way the teacher messaging screens are not blocked by someone else's work.

One thing I ran into during `amplify push` was that the existing schema had broken relationships. Attendance and Incident models were using `@belongsTo` to point back to Student, Class, Teacher, and School, but those parent models were missing the matching `@hasMany` declarations. This probably worked fine before because the team may have been on an older transformer version that did not enforce it. But transformer v2 is strict about it. I fixed all of them while I was in there.

---

## How It Works at a High Level

Here is the flow from start to finish:

1. A parent or teacher opens the Messages tab
2. The app queries DynamoDB for all conversations belonging to that user
3. The conversations show up in a list, sorted by the most recent message
4. The user taps a conversation
5. The app navigates to a new screen and loads all messages for that conversation
6. A real time subscription starts listening for new incoming messages
7. The user types a message and hits send
8. The message appears instantly in the chat (optimistic UI)
9. The message gets saved to DynamoDB in the background
10. The other person sees the message appear on their screen in real time through the subscription
11. The conversation list updates its preview text and timestamp

---

## The Database (Schema)

Two new models were added to `amplify/backend/api/projectclara/schema.graphql`. These models create DynamoDB tables in AWS.

### Conversation Table

This table stores every conversation thread. Each row is one conversation.

| Field           | Type             | Purpose                                                    |
| --------------- | ---------------- | ---------------------------------------------------------- |
| id              | ID               | Unique identifier, auto generated                          |
| type            | ConversationType | Either "DIRECT" or "GROUP"                                 |
| parentId        | ID               | The parent in this conversation (null for group chats)     |
| teacherId       | ID               | The teacher in this conversation (always required)         |
| studentId       | ID               | Which student this conversation is about (null for group)  |
| classId         | ID               | Which class this conversation belongs to (for group chats) |
| parentName      | String           | The parent's name stored directly on the row               |
| teacherName     | String           | The teacher's name stored directly on the row              |
| studentName     | String           | The student's name stored directly on the row              |
| className       | String           | The class name stored directly on the row                  |
| lastMessageText | String           | Preview of the most recent message                         |
| lastMessageAt   | AWSDateTime      | Timestamp of the most recent message                       |

The name fields (parentName, teacherName, studentName, className) are stored directly on the conversation instead of being looked up from other tables every time. This is called denormalization. Without it, loading the inbox would require one extra database call per conversation to get each name. That would be slow. By storing the names upfront when the conversation is created, the inbox loads in one single query.

The table has four indexes (GSIs) so we can quickly look up conversations by parentId, teacherId, studentId, or classId without scanning the entire table.

### Message Table

This table stores every individual message. Each row is one message inside a conversation.

| Field          | Type        | Purpose                                    |
| -------------- | ----------- | ------------------------------------------ |
| id             | ID          | Unique identifier, auto generated          |
| conversationId | ID          | Which conversation this message belongs to |
| senderId       | ID          | The user ID of whoever sent it             |
| senderType     | SenderType  | Either "PARENT" or "TEACHER"               |
| senderName     | String      | Display name of the sender                 |
| body           | String      | The actual message text                    |
| createdAt      | AWSDateTime | When the message was sent                  |

The conversationId field has a composite index with createdAt as the sort key. This means when you query "give me all messages for conversation X", DynamoDB automatically returns them sorted by time. The app requests them in ascending order so the oldest messages appear at the top and the newest at the bottom, like a normal chat.

### Enums

Two enums were added:

* `ConversationType`: DIRECT or GROUP
* `SenderType`: PARENT or TEACHER

---

## Every File That Was Created or Changed

### New Files (10 total)

**API Layer (1 file)**

* `src/features/messaging/api/messageRepo.ts`: All database operations for messaging. Fetching conversations, fetching messages, sending messages, creating conversations. This is the only file that talks to AWS. I kept everything in one file because scattering GraphQL calls across multiple files makes debugging painful. If something breaks with the data layer, you only need to look in one place.

**Hooks (2 files)**

* `src/features/messaging/logic/useConversations.ts`: React hook that loads the conversation list for a parent or teacher. Used by both inbox screens. I made it take a `role` parameter so both parent and teacher screens can use the same hook instead of duplicating logic.
* `src/features/messaging/logic/useMessages.ts`: React hook that loads messages for a single conversation, sets up the real time subscription, and handles sending with optimistic UI. This is the most complex hook in the feature because it manages the subscription lifecycle, optimistic updates, and deduplication all in one place.

**UI Components (4 files)**

* `src/features/messaging/ui/ConversationItem.tsx`: One row in the inbox list. Shows an icon, the other person's name, a message preview, and a relative timestamp like "3m" or "2d". I wrote a small `relativeTime` helper inside this file rather than pulling in a library like moment.js since we only need basic time formatting.
* `src/features/messaging/ui/ConversationList.tsx`: The full inbox view. A FlatList that shows all conversations with pull to refresh, a loading spinner, and an empty state message when there are no conversations yet.
* `src/features/messaging/ui/MessageBubble.tsx`: A single chat bubble. Your own messages appear on the right side with a blue background. Other people's messages appear on the left side with the card background color. In group chats, the sender's name is shown above the bubble. I used asymmetric border radius (smaller on the bottom corner closest to the sender) to give the bubbles a directional feel, similar to how iMessage does it.
* `src/features/messaging/ui/MessageInput.tsx`: The text input bar at the bottom of the chat screen. Has a multiline text field and a send button. The send button is grayed out when the field is empty or a message is currently being sent. On iOS it has extra bottom padding for the home indicator.

**Screen Files (2 files)**

* `app/(parent)/conversation.tsx`: The chat thread screen for parents. Loads messages, shows them in a scrollable list, and has the input bar at the bottom. Scrolls to the bottom automatically when new messages come in. I used `scrollToEnd` instead of the `inverted` FlatList pattern because inverted lists have known rendering issues on Android with KeyboardAvoidingView.
* `app/(teacher)/conversation.tsx`: Same thing but for teachers. Currently uses placeholder IDs because TeacherLoginContext does not expose the teacher's real ID yet.

### Modified Files (5 total)

* `amplify/backend/api/projectclara/schema.graphql`: Added the Conversation model, Message model, ConversationType enum, and SenderType enum at the bottom. Also added missing @hasMany relationships on Student, Class, Teacher, and School for the Attendance and Incident models (see the Schema Fixes section below).
* `app/(parent)/(tabs)/messaging.tsx`: Replaced the placeholder text with the real inbox screen. Now uses useConversations hook and renders the ConversationList component.
* `app/(teacher)/(class)/(tabs)/messaging.tsx`: Same replacement for the teacher side.
* `app/(parent)/_layout.tsx`: Added a Stack.Screen entry for the conversation route so you can navigate from the inbox to a chat thread.
* `app/(teacher)/_layout.tsx`: Same addition for the teacher side.

### Auto Generated Files (4 files, updated by amplify codegen)

* `src/graphql/queries.ts`: Now includes `conversationsByParentId`, `conversationsByTeacherId`, `messagesByConversationIdAndCreatedAt`, and other conversation/message queries.
* `src/graphql/mutations.ts`: Now includes `createConversation`, `updateConversation`, `deleteConversation`, `createMessage`, `updateMessage`, `deleteMessage`.
* `src/graphql/subscriptions.ts`: Now includes `onCreateMessage`, `onUpdateMessage`, `onDeleteMessage`.
* `src/API.ts`: Updated TypeScript types for all the new models.

---

## How the Code is Organized

The messaging feature follows the same pattern as the rest of the app. Everything lives inside `src/features/messaging/` and is split into three layers:

```
src/features/messaging/
    api/
        messageRepo.ts       (talks to AWS, all database operations)
    logic/
        useConversations.ts   (React hook for the inbox list)
        useMessages.ts        (React hook for the chat thread)
    ui/
        ConversationItem.tsx  (single inbox row)
        ConversationList.tsx  (full inbox with FlatList)
        MessageBubble.tsx     (single chat bubble)
        MessageInput.tsx      (text field and send button)
```

The screens that use these components live in the app directory:

```
app/(parent)/(tabs)/messaging.tsx    (parent inbox screen)
app/(parent)/conversation.tsx        (parent chat thread screen)
app/(teacher)/(class)/(tabs)/messaging.tsx  (teacher inbox screen)
app/(teacher)/conversation.tsx       (teacher chat thread screen)
```

I deliberately kept this separation strict. The UI components do not know anything about GraphQL or DynamoDB. The hooks do not know anything about how the UI renders. And messageRepo.ts does not know anything about React. This means you can change how the UI looks without touching the database code, and you can change how data is fetched without touching the UI. If we ever need to swap out AppSync for something else, the only file that changes is messageRepo.ts.

---

## How Each Piece Works

### messageRepo.ts

This file is the only place in the messaging feature that talks to AWS. It uses `generateClient()` from `aws-amplify/api`, which is the same pattern used in `parent_data_fetcher.ts` and `schoolRepo.ts`. I kept it consistent with the existing codebase on purpose so it does not feel foreign to anyone reading the code.

It imports the generated GraphQL operations from `src/graphql/` and wraps them in simple functions:

* `fetchConversationsByParent(parentId)`: Gets all conversations where this parent is involved. Uses the byParent index on the Conversation table.
* `fetchConversationsByTeacher(teacherId)`: Gets all conversations where this teacher is involved. Uses the byTeacher index.
* `getOrCreateDirectConversation(params)`: Looks for an existing direct conversation between a parent and teacher about a specific student. If one exists, returns it. If not, creates a new one. This prevents duplicate conversations.
* `getOrCreateGroupConversation(params)`: Same idea but for group conversations. Checks if a group conversation already exists for a class. If not, creates one.
* `fetchMessages(conversationId, limit)`: Gets all messages in a conversation sorted by time (oldest first). Uses the byConversation index with createdAt as the sort key, asking DynamoDB for ascending order.
* `sendMessage(params)`: Creates a new message in DynamoDB, then updates the conversation's lastMessageText and lastMessageAt fields in the background so the inbox preview stays current. I made the conversation update fire-and-forget intentionally. If it fails, the only consequence is the inbox preview is slightly stale, which is way better than blocking the send or showing an error to the user.

Every function returns a `RepoResult<T>` object with either `{ data: ..., error: null }` on success or `{ data: null, error: "..." }` on failure. I picked this pattern over throwing exceptions because it forces you to handle the error case at the call site. You cannot accidentally forget to catch an error.

### useConversations.ts

This hook takes a role ("parent" or "teacher") and a userId, then calls the right fetch function from messageRepo. It returns:

* `conversations`: The array of conversation objects
* `isLoading`: True while fetching
* `error`: An error message string if something went wrong, null otherwise
* `loadConversations()`: A function you can call to reload the list (used for pull to refresh)

It loads conversations automatically when the component mounts. It has an isMounted guard to prevent state updates after the component unmounts (which would cause React warnings). I copied this pattern from `useSchoolSelection.ts` since it already handles this correctly.

### useMessages.ts

This hook is more complex. It manages the chat thread for a single conversation. It takes the conversationId plus the current user's info (senderId, senderType, senderName) and returns:

* `messages`: The array of message objects
* `isLoading`: True while fetching initial messages
* `isSending`: True while a message is being sent
* `error`: Error message string if something failed
* `sendMessage(body)`: Function to send a new message

It does three things on mount:

1. Fetches existing messages from DynamoDB
2. Sets up a real time subscription that listens for new messages in this conversation
3. Returns a cleanup function that unsubscribes when you leave the screen

### ConversationItem.tsx

Renders a single row in the inbox. It figures out what to display based on who is viewing:

* If you are a parent, the title shows the teacher's name
* If you are a teacher, the title shows the parent's name
* If it is a group conversation, the title shows the class name
* Below the title it shows context like "Re: Johnny" for direct messages or "Class broadcast" for groups
* Below that it shows a preview of the last message
* On the right side it shows a relative timestamp like "now", "3m", "2h", "5d", or a full date for older conversations

### ConversationList.tsx

A FlatList wrapper that handles all the states:

* Loading: shows a spinner
* Error: shows the error message in red
* Empty: shows "No conversations yet"
* Data: shows the list of ConversationItem components
* Pull to refresh is wired up to reload the conversation list

### MessageBubble.tsx

Renders a single message in the chat thread:

* Your messages: right aligned, blue background (#0a7ea4), white text, rounded corners with a smaller radius on the bottom right to give it a "tail" effect
* Other people's messages: left aligned, card background color, normal text color, smaller radius on the bottom left
* In group chats, the sender's name appears above the bubble for other people's messages
* A small timestamp appears at the bottom right of each bubble

### MessageInput.tsx

The input bar at the bottom of the chat:

* Multiline TextInput that grows up to 120px tall
* Send button with an Ionicons "send" icon
* Send button turns gray and becomes disabled when the text field is empty or a message is currently being sent
* On iOS, adds extra bottom padding (28px) so the input bar sits above the home indicator
* After sending, the text field clears automatically

---

## How Navigation and Routing Works

The messaging screens are wired into the existing Expo Router navigation structure.

**Parent flow:**

1. Parent taps the Messages tab (this renders `app/(parent)/(tabs)/messaging.tsx`)
2. The inbox shows their conversations
3. Parent taps a conversation
4. The app calls `router.push({ pathname: "/(parent)/conversation", params: { conversationId, conversationTitle } })`
5. This pushes the conversation screen onto the parent Stack navigator
6. The header shows "Conversation" with a back button labeled "Messages"

**Teacher flow:**

1. Teacher taps the Messages tab (this renders `app/(teacher)/(class)/(tabs)/messaging.tsx`)
2. The inbox shows their conversations
3. Teacher taps a conversation
4. Same push navigation but to `/(teacher)/conversation`
5. Same header setup

The conversation screens were added as Stack.Screen entries in the parent and teacher layout files so the router knows about them. I put the conversation screen at the Stack level (not inside the tabs) so it pushes on top of the tab bar and gives you the full screen for the chat. This felt more natural than trying to squeeze a chat thread inside a tab.

---

## Real Time Messaging (Subscriptions)

When you open a conversation, the useMessages hook sets up an AppSync subscription. This is a WebSocket connection that stays open and listens for new messages.

Here is how it works:

1. The hook calls `client.graphql({ query: onCreateMessage, variables: { filter: { conversationId: { eq: conversationId } } } })`
2. This tells AppSync "notify me whenever a new Message is created where the conversationId equals this value"
3. AppSync keeps a WebSocket connection open
4. When anyone (the other person in the conversation) creates a new message via `sendMessage()`, AppSync pushes that message through the WebSocket to every subscriber
5. The hook receives the message and adds it to the messages array
6. React re-renders the FlatList with the new message at the bottom

The subscription has deduplication built in. When you send a message, it appears immediately through the optimistic UI (see below). The subscription would also try to add that same message when it comes back from the server. The hook checks if a message with that ID already exists in the array and skips it if so. I spent a while thinking about this edge case because without the dedup check, you would see every message you send appear twice briefly.

When you leave the conversation screen (navigate back), the cleanup function runs and calls `subscription.unsubscribe()`. This closes the WebSocket connection so it does not keep running in the background and eating battery.

---

## Optimistic Sending

When a user hits the send button, we do not want them to wait for the network round trip to see their message appear. That would feel slow. Instead we use optimistic sending:

1. User hits send
2. We immediately create a temporary message object with a fake ID like `temp-1709123456789` and add it to the messages array
3. The message appears in the chat right away
4. In the background, we send the real request to DynamoDB
5. If it succeeds, we swap the temporary message for the real one (which has the real server-generated ID)
6. If it fails, we remove the temporary message from the array so it disappears

This makes the app feel instant. The user sees their message appear immediately and 99% of the time the server confirms it a moment later. I considered showing a small "sending..." indicator on optimistic messages but decided against it for now since it adds visual noise and the confirmation happens so fast you would barely see it anyway.

---

## Schema Fixes That Were Made

While running `amplify push`, the deployment failed because of pre-existing issues in the schema that were unrelated to messaging. The Amplify GraphQL transformer v2 enforces that if Model A has a `@belongsTo` pointing to Model B, then Model B must have a matching `@hasMany` pointing back to Model A.

These relationships were missing:

* `Attendance` had `@belongsTo` on `student` and `class`, but `Student` and `Class` did not have `@hasMany` for `attendances`
* `Incident` had `@belongsTo` on `teacher`, `student`, `class`, and `school`, but none of those models had `@hasMany` for `incidents`

The fix was adding the missing `@hasMany` lines:

* Added `attendances: [Attendance] @hasMany(...)` to Student and Class
* Added `incidents: [Incident] @hasMany(...)` to Student, Class, Teacher, and School

These additions do not change any existing behavior. They just tell Amplify that the relationship goes both ways, which it already did at the database level. The existing Attendance and Incident features continue to work exactly the same. I suspect these were never caught before because the team might have been on an older Amplify CLI version that was less strict, or nobody had run `amplify push` since those models were added.

---

## What is Done

Everything in this list is complete, committed, pushed to GitHub on the `feature/messaging` branch, and deployed to AWS:

* [x] Conversation and Message models added to the GraphQL schema
* [x] DynamoDB tables provisioned in AWS via amplify push
* [x] GraphQL operations generated via amplify codegen (queries, mutations, subscriptions, types)
* [x] messageRepo.ts with all database operations using the generated imports
* [x] useConversations hook for loading the inbox
* [x] useMessages hook with real time subscription and optimistic send
* [x] ConversationItem component
* [x] ConversationList component with pull to refresh, loading, error, and empty states
* [x] MessageBubble component with own/other styling
* [x] MessageInput component with disabled state and iOS safe area padding
* [x] Parent inbox screen (replaced placeholder)
* [x] Teacher inbox screen (replaced placeholder)
* [x] Parent conversation thread screen
* [x] Teacher conversation thread screen
* [x] Navigation wired up in both parent and teacher layouts
* [x] Pre-existing schema relationship fixes for Attendance and Incident models
* [x] All code pushed to `feature/messaging` branch on GitHub

---

## What Still Needs to Be Done

### 1. Expand TeacherLoginContext (Blocking for teacher side)

**Current situation:** The `TeacherLoginContext` in `context/TeacherLoginContext.js` only exposes `isDebug` and `updateIsDebug`. It does not expose the teacher's ID, name, or current class.

**What needs to happen:** Someone needs to expand this context to include the teacher's data, similar to how `ParentLoginContext` exposes `userParent` with `userId`, `firstName`, and `lastName`.

**Where to look:** The parent version is in `src/features/context/ParentLoginContext.tsx`. You can use it as a reference for what the teacher version should expose.

**Impact:** Until this is done, the teacher messaging screens use hardcoded placeholder values:

* `PLACEHOLDER_TEACHER_ID = "teacher-debug-001"` in `app/(teacher)/(class)/(tabs)/messaging.tsx`
* `PLACEHOLDER_TEACHER_ID` and `PLACEHOLDER_TEACHER_NAME` in `app/(teacher)/conversation.tsx`

These are marked with TODO comments in the code. Once TeacherLoginContext is expanded, replace the placeholders with the real values from the context. I intentionally did not block on this because it is someone else's area and the rest of the messaging system should not wait for it.

### 2. Wire Up "Contact Teacher" Flow

**Current situation:** Parents can see conversations that already exist in the inbox, but there is no way for a parent to start a new conversation from within the app yet.

**What needs to happen:** When a parent is viewing a student's details (schedule, records, etc.) and wants to message the teacher, there should be a button that calls `getOrCreateDirectConversation()` from messageRepo.ts and then navigates to the conversation screen.

**Where to add it:** The student schedule screen at `app/(parent)/(tabs)/[studentId]/studentSchedule.tsx` already has an `onTeacherClicked` function that navigates to the messaging tab. Instead of just navigating to the tab, it should:

1. Call `getOrCreateDirectConversation({ parentId, teacherId, studentId, parentName, teacherName, studentName })`
2. Navigate to `/(parent)/conversation` with the returned conversationId

The `getOrCreateDirectConversation` function handles the logic of checking if a conversation already exists. If one does, it returns it. If not, it creates a new one. So you never get duplicate conversations. I already built this function specifically for this use case, it just needs to be wired up in the UI.

### 3. UI Polish and Styling

**Current situation:** The messaging UI is functional but uses the default app theme colors and basic layouts. It works but it has not been styled to match the mockups.

**What needs to happen:** Use the mockups from Sleep0 and Abraham to refine the look and feel. All components use `useThemeColor` so they already support light and dark mode. The styling just needs to be adjusted to match whatever the team decides looks best.

**Where to change it:** All the visual components are in `src/features/messaging/ui/`. Each component has a StyleSheet that you can modify. I kept the styling simple on purpose so it is easy to restyle without untangling complex layout code.

### 4. Push Notifications for New Messages

**Current situation:** Messages appear in real time if you have the conversation open. But if the app is closed or you are on a different screen, you have no way of knowing a new message arrived.

**What needs to happen:** When a new message is created, send a push notification to the other person. The notifications infrastructure already exists in `src/features/notifications/`.

**This is a separate feature** and does not need to be part of the initial messaging implementation. I considered baking it in but decided it would be better as its own task since notifications have their own complexity (permissions, tokens, background handling).

### 5. Read Receipts and Unread Counts (Future)

Not currently implemented. If the team wants to add "unread message" badges on the Messages tab or show read receipts in the chat, that would require adding fields to the Conversation model (like `parentUnreadCount` and `teacherUnreadCount`) and updating them when messages are read.

### 6. File and Image Attachments (Future)

Not currently implemented. The current system only supports text messages. Adding attachments would require integrating with S3 for file storage and adding an `attachmentUrl` field to the Message model.

---

## How to Test

### Basic Flow Test

1. Run `npx expo start --clear`
2. Log in with a parent debug account
3. Tap the Messages tab
4. You should see an empty inbox with "No conversations yet" (no crash, no error)
5. Pull down to refresh (the loading spinner should appear briefly and then go away)

### Creating a Conversation (Requires "Contact Teacher" Flow)

Until the contact teacher flow is wired up, you can create test conversations manually by calling `getOrCreateDirectConversation()` from the console or by adding a temporary button to the parent inbox screen.

### Real Time Test

1. Open the app on two devices or two simulators
2. Log in as a parent on one and a teacher on the other
3. Open the same conversation on both
4. Send a message from one device
5. The message should appear on the other device within a couple seconds without refreshing

### Pull to Refresh Test

1. Open the Messages tab
2. Pull down on the list
3. The loading indicator should appear
4. The list should reload with fresh data from the server

---

## How to Pick Up Where This Left Off

If you are a developer picking up this work, here is what you need to know:

1. **Branch:** All messaging code is on `feature/messaging`. Make sure you pull the latest from this branch.

2. **AWS is already set up.** The DynamoDB tables exist and the GraphQL endpoint is live. You do not need to run `amplify push` again unless you change the schema.

3. **If you change the schema**, run these two commands after:

   ```
   amplify push --yes
   amplify codegen
   ```

   This will update the tables in AWS and regenerate the GraphQL files in `src/graphql/`.

4. **The parent side works end to end** (with debug login). The teacher side works too but uses placeholder IDs.

5. **The most impactful next task** is expanding TeacherLoginContext. Once the teacher has a real ID and name, the teacher messaging screens become fully functional.

6. **All UI components use `useThemeColor`** so they automatically adapt to light and dark mode. You do not need to handle theme switching manually.

7. **The messageRepo.ts file is the single source of truth** for all messaging data operations. If you need to change how data is fetched or sent, that is the only file you need to touch. The hooks and UI components do not know or care about GraphQL or DynamoDB. I set it up this way on purpose so nobody accidentally puts a GraphQL call inside a component.
