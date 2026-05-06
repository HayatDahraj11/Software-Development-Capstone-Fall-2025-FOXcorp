<div align="center">

# Project Clara

**A real-time, AI-augmented school communication platform.**

*One mobile codebase. Two role-aware portals. A serverless GraphQL backend. A function-calling LLM agent that answers questions about your kid using live database queries - not hallucinations.*

[![React Native](https://img.shields.io/badge/React_Native-0.81-61DAFB?logo=react&logoColor=white)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-54-000020?logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9_strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![AWS Amplify](https://img.shields.io/badge/AWS_Amplify-Gen_1-FF9900?logo=awsamplify&logoColor=white)](https://docs.amplify.aws/)
[![AppSync](https://img.shields.io/badge/AppSync-GraphQL-E535AB?logo=graphql&logoColor=white)](https://aws.amazon.com/appsync/)
[![DynamoDB](https://img.shields.io/badge/DynamoDB-NoSQL-4053D6?logo=amazondynamodb&logoColor=white)](https://aws.amazon.com/dynamodb/)
[![Cognito](https://img.shields.io/badge/Cognito-Auth-DD344C?logo=amazoncognito&logoColor=white)](https://aws.amazon.com/cognito/)
[![Lambda](https://img.shields.io/badge/Lambda-Node_20-FF9900?logo=awslambda&logoColor=white)](https://aws.amazon.com/lambda/)
[![Gemini](https://img.shields.io/badge/Gemini_2.5_Flash-AI_Agent-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![Jest](https://img.shields.io/badge/Jest-56_tests_passing-C21325?logo=jest&logoColor=white)](https://jestjs.io/)
[![NativeWind](https://img.shields.io/badge/NativeWind-4.2-38BDF8?logo=tailwindcss&logoColor=white)](https://www.nativewind.dev/)

</div>

---

## Table of Contents

- [The Problem](#the-problem)
- [What's Inside - At a Glance](#whats-inside--at-a-glance)
- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [The Data Layer](#the-data-layer)
- [Authentication & Role Routing](#authentication--role-routing)
- [Feature Catalog](#feature-catalog)
- [Clara AI - The Flagship](#clara-ai--the-flagship-feature)
- [Real-Time Messaging & Read Receipts](#real-time-messaging--read-receipts)
- [Push Notifications](#push-notifications)
- [Theme System - and an Android Crash Story](#theme-system--and-an-android-crash-story)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Navigation Map](#navigation-map)
- [Deployment](#deployment)
- [Engineering Patterns Worth Calling Out](#engineering-patterns-worth-calling-out)
- [Known Limitations & Roadmap](#known-limitations--roadmap)
- [Documentation Index](#documentation-index)
- [Team](#team)
- [Status & License](#status--license)

---

## The Problem

Schools rely on fragmented communication channels. Report cards arrive late. Attendance issues go unnoticed for weeks. Teachers and parents talk past each other in email chains, paper notes, and three different apps.

**Clara collapses all of that into one platform** with two role-aware portals on the same codebase:

- **Parents** see live dashboards per child - attendance, grades, schedules, incidents, medical records, teacher notes - and can ask an AI assistant questions in natural language about how their kid is doing.
- **Teachers** get a class command center - roster-based attendance, incident logging, grade entry, announcements, schedule editing, and direct parent messaging.

The portal is **chosen automatically** based on the user's database records. No user-group toggling. No "are you a parent or teacher?" prompts. Log in, get the right experience.

---

## What's Inside - At a Glance

| Dimension | Number |
| --- | --- |
| **Mobile screens** (Expo Router) | 50 |
| **Feature modules** (MVVM-structured) | 21 |
| **Reusable UI components** | 25 (11 primitives + 14 domain) |
| **GraphQL models** | 16 |
| **DynamoDB Global Secondary Indexes** | 13 unique (45 references) |
| **AppSync resolvers (auto-generated VTL)** | 844 |
| **Auto-generated TypeScript types** | 490 |
| **Lambda functions** | 1 (Clara AI - 1,415 LoC across 9 files) |
| **AI agent tools** (typed function-calling) | 6 |
| **API repository functions** | 18 files / 2,192 LoC |
| **Custom hooks** | 20+ |
| **Unit/integration tests** | 56 across 7 suites - all passing |
| **Markdown design docs** | 10 |
| **Production dependencies** | 77 |
| **Target platforms** | iOS · Android · Web |

---

## System Architecture

Clara follows a **Feature-Based MVVM** pattern adapted for React Native. Every feature is a self-contained slice of the product with three layers - and a strict rule that information only flows in one direction across them.

```
┌────────────────────────────────────────────────────────────────────────────┐
│                              MOBILE CLIENT                                  │
│                  (iOS · Android · Web - single codebase)                    │
│                                                                              │
│   ┌──────────────┐      ┌──────────────┐      ┌─────────────────────────┐  │
│   │     ui/      │ ───▶ │    logic/    │ ───▶ │           api/          │  │
│   │  React/RN    │      │  custom hooks│      │  repos · GraphQL clients│  │
│   │  components  │      │  state, biz  │      │  AsyncStorage handlers  │  │
│   └──────────────┘      └──────────────┘      └─────────────────────────┘  │
│         View                ViewModel                    Model              │
│                                                                              │
│   Components never touch GraphQL.  Hooks never render JSX.  Repos never     │
│   import React.  Each layer has exactly one job.                             │
└────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │  HTTPS · Cognito JWT · API Key
                                    ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                          AWS SERVERLESS BACKEND                             │
│                                                                              │
│   ┌──────────┐    ┌──────────┐    ┌──────────────┐    ┌────────────────┐   │
│   │ Cognito  │    │ AppSync  │    │   DynamoDB   │    │  Lambda        │   │
│   │User Pool │ ─▶ │ GraphQL  │ ─▶ │ 16 tables    │    │  claraAiAgent  │   │
│   │ + IdP    │    │ + Subs   │    │ 13 GSIs      │    │  (Node 20)     │   │
│   └──────────┘    └──────────┘    └──────────────┘    └────────────────┘   │
│                        ▲                                       │            │
│                        │   real-time onCreate/onUpdate         │            │
│                        └───────────────────────────────────────┘            │
│                                                                              │
│   ┌──────────────────────────────┐      ┌────────────────────────────────┐ │
│   │  Expo Push API (FCM + APNs)  │      │  Google Gemini 2.5 Flash       │ │
│   └──────────────────────────────┘      └────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────┘
```

**Why this pattern matters in practice:** any developer can swap Cognito for Firebase by editing `src/features/auth/api/authRepo.ts` - without touching a single component or hook. The same is true for the LLM provider (the migration from OpenAI to Gemini was a one-file change to `llmClient.js`).

---

## Tech Stack

### Mobile

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | **Expo SDK 54** + React Native 0.81 + React 19 | New Architecture enabled, React Compiler on for auto-memoization |
| Language | **TypeScript 5.9 (strict mode)** | 100% TS coverage; 490 generated types from schema |
| Routing | **Expo Router 6** (file-based, typed routes) | Universal navigation across iOS / Android / Web |
| Styling | **NativeWind 4.2** + Tailwind 3.4 + CVA | Tailwind compiled to native styles at build time |
| UI Primitives | **React Native Reusables** + `@rn-primitives/*` + Radix UI bridges | Accessible, headless, themeable |
| Animations | **React Native Reanimated 4.1** + Worklets | 60fps gestures and transitions |
| Charts | `react-native-chart-kit` + `react-native-svg` | Grade distribution + attendance pies |
| State | React Context + custom hooks | No Redux. Context is enough at this scale. |
| Local Storage | `@react-native-async-storage/async-storage` | Per-user settings, theme, remembered username |
| Build / OTA | **EAS Build** (development · preview · production) | Cloud builds, APK previews, App Store / Play submission |

### Backend (AWS Serverless)

| Service | Role |
| --- | --- |
| **Amazon Cognito** | Email-only sign-in, identity pool → IAM, 30-day refresh tokens |
| **AWS AppSync** | GraphQL API with real-time subscriptions; multi-auth (API_KEY · IAM · User Pools) |
| **Amazon DynamoDB** | 16 NoSQL tables, on-demand billing, encryption at rest |
| **AWS Lambda** | Single function (`claraAiAgent`, Node 20, 512 MB, 30s timeout) for AI orchestration |
| **API Gateway HTTP API** | Public Lambda endpoint with CORS for the AI agent |
| **Expo Push (via FCM/APNs)** | Cross-platform push delivery |
| **AWS Amplify CLI** | Schema-driven IaC: `amplify push` materializes 844 VTL resolvers |

### Tooling

| Tool | Use |
| --- | --- |
| **Jest 30** + `ts-jest` | 56-test suite, all passing |
| **ESLint 9** (flat config) | `eslint-config-expo` |
| **Prettier** + `prettier-plugin-tailwindcss` | Class sorting and formatting |

---

## The Data Layer

The entire backend is described by a single GraphQL schema (`amplify/backend/api/projectclara/schema.graphql`, 227 lines). Amplify transforms it into:

- **16 DynamoDB tables**
- **13 Global Secondary Indexes** (45 index references across the schema)
- **38 model relationships** (`@hasMany`, `@belongsTo`, `@manyToMany`, `@hasOne`)
- **844 AppSync VTL resolvers**
- **490 TypeScript types** in `src/API.ts`

### Entity-Relationship Map

```
                                  ┌────────┐
                                  │ School │
                                  └───┬────┘
              ┌───────────────┬───────┼───────┬────────────────┐
              ▼               ▼       │       ▼                ▼
        ┌──────────┐   ┌──────────┐   │  ┌─────────┐   ┌──────────────┐
        │  Parent  │◀─▶│ Student  │   │  │ Teacher │   │ Announcement │
        └────┬─────┘ M:M└────┬─────┘  │  └────┬────┘   └──────────────┘
             │   ParentStudents       │       │                ▲
             │                ▼       │       ▼                │
             │         ┌────────────┐ │  ┌─────────┐           │
             │         │MedicalRec.│  │  │  Class  │───────────┘
             │         └────────────┘ │  └────┬────┘
             │                        │       │
             ▼                        ▼       ▼
      ┌─────────────┐         ┌──────────────────────────────────┐
      │Conversation │         │ Enrollment · Attendance ·        │
      └──────┬──────┘         │ Schedule · Incident · TeacherNote│
             ▼                └──────────────────────────────────┘
       ┌─────────┐
       │ Message │      Real-time via onCreate/onUpdate AppSync subs
       └─────────┘
                                ┌─────────────────────────┐
                                │ PushToken (multi-device)│
                                │ EmergencyNotification   │
                                └─────────────────────────┘
```

### The Sixteen Models

| Model | Purpose | Key Index |
| --- | --- | --- |
| `School` | Tenant root | - |
| `Parent` | Authenticated guardian; M:M to Student | `byCognitoUser` |
| `Teacher` | Authenticated educator | `byCognitoUser` |
| `Student` | Learner record | `bySchool` |
| `Class` | Course cohort taught by Teacher | `byTeacher`, `bySchool` |
| `Enrollment` | Student↔Class join, holds `currentGrade` | `byStudent`, `byClass` |
| `Attendance` | Per-day per-class status (PRESENT/ABSENT/LATE) | `byClass`, `byStudent` |
| `Incident` | Behavioral report with severity | 4 indexes |
| `Schedule` | Day-of-week + start/end time per Class | `byClass` |
| `MedicalRecord` | Allergies, meds, conditions, emergency notes | `byStudent` |
| `TeacherNote` | Categorized free-text observations | `byStudent`, `byTeacher` |
| `Announcement` | Class or school-wide bulletin | `byClass`, `bySchool` |
| `Conversation` | DIRECT (1:1) or GROUP thread | `byParent`, `byTeacher` |
| `Message` | Individual chat row | `byConversation (createdAt sort)` |
| `PushToken` | Per-device Expo token | `byUser` |
| `EmergencyNotification` | Lockdown / weather / closure alerts | `bySchool`, `byClass` |

### Authorization Strategy

Multi-mode authorization with sensible defaults:

| Auth Mode | When | Example |
| --- | --- | --- |
| `API_KEY` | Pre-login operations (school directory, onboarding) | `listSchools` on the login screen |
| `userPool` (Cognito) | All authenticated user actions | Reading your own messages |
| `IAM` | Lambda → AppSync server-to-server | Clara writing replies |
| `groups: ["Teachers"]` | Role-gated mutations | Teachers updating Student records |
| `owner` | Per-record ownership | Parents reading their own data |

Sensitive surfaces (medical records, push tokens) layer additional checks at the **feature** level - Clara's tools, for example, run `assertStudentBelongsToParent()` in JavaScript on every call. **Authorization lives in code, not prompts.**

---

## Authentication & Role Routing

```
   ┌──────────────┐       ┌──────────────────┐       ┌────────────────────┐
   │ Email + pw   │  ─▶   │ Cognito sign-in  │  ─▶   │ getCurrentUser()   │
   └──────────────┘       └──────────────────┘       └─────────┬──────────┘
                                                                │ userId
                                                                ▼
                                            ┌──────────────────────────────────┐
                                            │ parentsByCognitoUserId(userId)   │
                                            └─────────┬────────────────────────┘
                                                      │
                                          ┌───────────┴────────────┐
                                          ▼                        ▼
                                   ┌───────────────┐       ┌────────────────┐
                                   │ Match found   │       │ No match       │
                                   │ → /(parent)/  │       │ → /(teacher)/  │
                                   └───────────────┘       └────────────────┘
```

**Why a database lookup instead of Cognito Groups?** Adding a user to a role becomes "create a row in DynamoDB" instead of "configure IAM". The role-detection logic lives in one hook (`useLogin.ts`), so swapping the strategy later is a single-file change. Cognito tokens still gate the GraphQL API - this just decides which portal to render.

In `__DEV__`, two debug accounts (`parent_debug` / `teacher_debug`, password `debug`) bypass Cognito entirely and load hardcoded fixtures from `debug_parent_data.ts` / `debug_teacher_data.ts` - invaluable when the AppSync API key has rotated or you're working offline.

---

## Feature Catalog

Every feature follows the same shape: `api/` (data), `logic/` (hooks), `ui/` (components). Below is what's actually shipping.

| Feature | What It Does | Notable Engineering |
| --- | --- | --- |
| **Auth** | Email/password sign-in, role-routing, remember-me | Cognito error name → user-friendly message map; pre-logout to clear stale sessions |
| **School Selection** | Pre-login school picker with search | Graceful degradation to 4 hardcoded fallback schools on API failure |
| **Attendance** | Teachers mark, parents view; per-day per-class | Optimistic UI with instant local update + lean mutations to bypass `@belongsTo` resolver bugs |
| **Incidents** | Behavior reports with 4-tier severity (Low → Critical) | Lean GraphQL mutations; client-side date sort (GSI lacks sort key) |
| **Schedules** | Day-of-week + time-block CRUD | Optimistic edit/remove with rollback; parent view aggregates across classes via `Promise.all` and Set-deduplication |
| **Medical Records** | Allergies, meds, conditions, emergency notes | Single component handles both create and update via shared modal; field-config array drives rendering |
| **Teacher Notes** | Categorized observations (General / Academic / Behavioral / Positive) | Custom paginated GraphQL query; soft-mutation patterns |
| **Announcements** | Class bulletin board | Per-class error resilience - one class failure doesn't break the others |
| **Grades** | Grade entry on Enrollment | Single lean mutation, color-coded thresholds (≥90 green / ≥70 orange / <70 red) |
| **Dashboard** | Parent home aggregation | Pulls 5 metrics from 4 different repos with independent try/catch |
| **Messaging** | Real-time 1:1 + group chat with read receipts | Optimistic send, dedup vs subscription echo, fire-and-forget conversation preview update |
| **Clara AI** | Natural-language student insights | Tool-calling LLM agent over real DynamoDB data ([deep dive below](#clara-ai--the-flagship-feature)) |
| **Notifications** | Multi-device push with dead-token cleanup | Auto-removes Expo `DeviceNotRegistered` tokens on send-failure |
| **Fetch User Data** | Login-time hydration | Custom `listClassesWithEnrollments` query bypasses shallow generated `listClasses` |
| **In-App Settings** | Per-user theme persistence | AsyncStorage keyed by userId with type-guarded JSON parsing |
| **App Themes** | Light/dark across 30+ tokens | React Context, **not** the native Appearance API ([crash story below](#theme-system--and-an-android-crash-story)) |
| **Cards** | Reusable dashboard cards (default, list, urgent variants) | Data-factory pattern (`createStudentClassUpdateCard`, etc.) |
| **Child Selection** | Modal child-picker for parents | Optional "Display All" sentinel for aggregate views |
| **Class Viewer** | Class detail card | Live announcement fetch + relative-time formatting |

---

## Clara AI - The Flagship Feature

**Clara is a read-only AI assistant that lives inside the parent's messaging inbox.** A parent taps "Ask Clara", types `"How has Emma been this week?"` in plain English, and receives a grounded answer like *"Emma has been present 4 of 5 days this week, has an 87 in Math, and her teacher Mrs. Patel left a positive note on Tuesday about her science project."*

The answer is not hallucinated. It is generated by the LLM **after** querying real DynamoDB tables through typed function-calling tools.

### Anatomy

```
amplify/backend/function/claraAiAgent/src/        9 files · 1,415 LoC · Node 20 · 512MB · 30s
├── index.js              91   API Gateway handler - awaits the FULL pipeline before returning
├── claraEngine.js       266   ReAct loop · MAX_HISTORY=12 · MAX_TOOL_ROUNDS=5
├── llmClient.js         262   Provider adapter (Gemini today; OpenAI yesterday)
├── tools.js             434   6 typed tools + per-tool authorization
├── contextBuilder.js    124   Loads parent + students + classes → builds allow-list
├── prompt.js             73   System prompt with allowed-students injection
├── graphqlClient.js      66   Fetch-based AppSync wrapper
├── local-server.js       60   Express harness for local dev
└── test-local.js         39   Integration test stub

src/features/clara/
├── api/claraRepo.ts      155   Lazy conversation creation, HTTP trigger to Lambda
├── logic/useClaraConversation.ts   Lazy get-or-create, memoized conversation id
└── ui/AskClaraButton.tsx          Home-screen entry tile
```

### The Six Tools

Every tool is a typed JSON-Schema definition paired with a JavaScript executor. Each executor performs an **explicit authorization check** before querying.

| Tool | Purpose |
| --- | --- |
| `get_student_attendance(studentId, daysBack)` | Per-day status timeline |
| `get_teacher_notes(studentId, limit)` | Recent free-text observations |
| `get_student_incidents(studentId, limit)` | Severity-tagged behavior events |
| `get_student_enrollments(studentId)` | Classes + current grades + teacher names |
| `get_class_schedule(classId)` | Meeting times per day of week |
| `summarize_week(studentId)` | Composite: attendance + notes + incidents for the past 7 days |

### End-to-End Sequence

```
   Parent app                  AppSync                  Lambda                 Gemini
        │                         │                       │                       │
   1.   │── createMessage ───────▶│                       │                       │
        │   (parent's question)   │                       │                       │
   2.   │                         │ ─ onCreateMessage ───▶│                       │
        │   (renders instantly)   │                       │                       │
   3.   │                         │                       ├─ buildContext()       │
        │                         │                       ├─ load 12-msg history  │
   4.   │                         │                       │── tools + history ───▶│
        │                         │                       │                       │ model picks tools
   5.   │                         │                       │◀── tool calls ────────│
        │                         │                       ├─ execute in parallel  │
        │                         │                       │── results ───────────▶│
        │                         │                       │   (loop until answer) │
   6.   │                         │                       │◀── final text ────────│
   7.   │                         │◀── createMessage ─────│                       │
        │                         │   (Clara's reply)     │                       │
   8.   │◀── onCreateMessage ─────│                       │                       │
        │   renders identically   │                       │                       │
        │   to a human reply      │                       │                       │
```

Clara is **a regular `Teacher` row** in DynamoDB with id `clara-ai-bot`. The mobile UI has zero knowledge that one of the participants is an AI - `MessageBubble.tsx` doesn't branch on Clara, the inbox doesn't either. Adding a second AI participant tomorrow would be a database insert.

### Six Engineering Decisions Worth Defending

1. **Function calling over RAG.** The data is structured (DynamoDB rows), not unstructured text. RAG solves *"which note mentions reading?"*; Clara needs *"count Emma's absences this month."* Different problem, different tool.
2. **Authorization in code, not in the prompt.** Prompts are soft constraints - jailbreaks bypass them. Every tool runs `assertStudentBelongsToParent(studentId, context)` in JavaScript. A malicious prompt that tricks the model into requesting another family's data still receives `{ error: "Access denied" }`.
3. **Lambda awaits the full pipeline.** An early version returned `200` and let the work continue async. **AWS freezes the execution environment the instant the handler returns** - unawaited work paused indefinitely and Clara's replies sometimes never arrived. The fix was a single `await`. API Gateway's 29s ceiling gives plenty of headroom for the typical 3–8s pipeline.
4. **Provider-agnostic adapter.** When OpenAI's $5 prepay didn't fit the demo budget, swapping to Gemini 2.5 Flash was *one file*: `llmClient.js`. Tools, prompts, mobile code untouched.
5. **Cost guardrails everywhere.** `maxOutputTokens: 800` · `temperature: 0.3` · `MAX_TOOL_ROUNDS: 5` · `MAX_HISTORY: 12`. At Gemini 2.5 Flash prices a typical turn costs ~$0.0005 - roughly 10,000 turns per $5 of budget.
6. **Clara is a Message, not a "ChatResponse".** Reusing the existing `Message` table means subscriptions, push notifications, optimistic UI, and read receipts all "just work" for Clara replies with zero new infrastructure.

### Stress Test (free-tier Gemini, real parent account)

| Question | Tools Called | Outcome |
| --- | --- | --- |
| *"Update on all three kids this week."* | 3 parallel `summarize_week` | Correct per-child summary |
| *"What classes does Darcey have and when?"* | 5 chained (`enrollments` → 4× `schedule`) | Full timetable returned |
| *"How is fake-student-999 doing?"* | 0 | Refused politely; listed real children |
| *"What's the weather tomorrow?"* | 0 | Redirected to school topics |
| *"Was Ava late this month?"* | 1 `get_student_attendance` | "3 times" - count verified against DynamoDB |

The jailbreak attempt (`fake-student-999`) was deflected at the **prompt** layer - the system prompt injects allowed student ids, so the model never even tried to call a tool. If that defense had failed, the **code** layer would have caught it. Defense in depth, in practice.

---

## Real-Time Messaging & Read Receipts

**Architecture overview.** Two tables - `Conversation` (header + last-message preview) and `Message` (the rows) - backed by AppSync subscriptions for live updates. Read receipts stamp two nullable fields directly on the `Conversation`: `parentLastReadAt` and `teacherLastReadAt`. No separate read-receipt table.

### What "Seen" and "Unread" Actually Mean

```ts
// src/features/messaging/logic/readReceipts.ts (pure functions, fully tested)

computeUnread(conversation, viewerRole):
   true  if  conv.lastMessageAt > viewer.lastReadAt
   true  if  viewer.lastReadAt is null (never opened)
   false if  GROUP thread on parent side  (v1 limitation, intentional)

computeSeen(message, currentUserId, isLastOwnMessage, otherLastReadAt):
   show "Seen" only on YOUR latest message
   show only when otherLastReadAt >= message.createdAt
```

15 tests cover these two pure functions across every branch - null timestamps, group threads, never-opened conversations, edge of clock skew. Pure functions are easy to test, and that's the point.

### Optimistic Send, with Subscription Echo Dedup

When the user taps Send:

1. A `Message` with id `temp-{timestamp}` is appended to local state **immediately**.
2. The real `createMessage` mutation fires.
3. On success, the temp id is swapped for the server id.
4. On failure, the temp message is removed and an error toast is shown.
5. Meanwhile, the AppSync subscription delivers an `onCreateMessage` event for the same row - but the hook checks `if (state.find(m => m.id === incoming.id)) return;` and skips it.

### Fire-and-Forget Side Effects

`messageRepo.sendMessage()` triggers three side effects without blocking the user:

- Conversation preview (`lastMessageText` / `lastMessageAt`) update
- Push notification to the recipient via `sendPushToUser`
- For Clara conversations: HTTP POST to the Clara Lambda

If any one of them fails, the message itself is unaffected.

---

## Push Notifications

End-to-end pipeline:

```
   App startup ──▶ usePushNotifications mounts
                     │
                     ▼
            registerForPushNotificationsAsync()
                     │ (request permissions, fetch Expo token)
                     ▼
            registerPushToken(userId, userType, token)
                     │
                     ▼   one row per device
            DynamoDB.PushToken (byUser GSI)


   sendMessage() ──▶ sendPushToUser({recipientUserId, title, body, data})
                            │
                            ▼
                   fetchPushTokensForUser(recipientUserId)  → ["ExpoToken_A", "ExpoToken_B"]
                            │
                            ▼
                   POST https://exp.host/--/api/v2/push/send
                            │
                            ▼   if Expo replies "DeviceNotRegistered"
                   AppSync.deletePushToken(token)   ← automatic dead-token cleanup
```

**Multi-device by design** - a parent on phone + tablet gets two rows; both are notified. **Soft-deleted tokens** are filtered out client-side. **Logout** triggers `unregisterPushTokens(userId)` to prevent ghost notifications going to wiped devices.

**Tap routing.** Notifications carry `data.route` and `data.conversationId`; tapping opens straight to the conversation thread via `expo-router`'s typed navigation.

---

## Theme System - and an Android Crash Story

The theme provider at `src/features/app-themes/logic/ThemeContext.tsx` looks deceptively simple - a `<ThemeContext.Provider>` wrapping the app, exposing `{ theme, setTheme }`. The version *before* this commit used React Native's built-in `Appearance.setColorScheme()` instead.

### Why That Crashed

```
   Appearance.setColorScheme('dark')
            │
            ▼
   Native config change on Android Activity
            │
            ▼
   Activity recreation
            │
            ▼
   20+ components using useThemeColor() re-render synchronously
            │
            ▼
   Native crash · stack trace lost in JS bridge
```

The fix was architectural, not a bug-fix: **manage theme state in JavaScript, not in the native layer.** The `Appearance` module is read *once* at startup to seed the initial value; after that, every theme transition flows through React state. Theme persistence still works via AsyncStorage in the `in-app-settings` feature.

The takeaway: when a native API has a known crash mode and your use-case doesn't need its semantics, write your own. 50 lines of `Context` saved a recurring P0.

---

## Testing

```
__tests__/
├── messaging/
│   ├── markConversationRead.test.ts          6 tests
│   └── readReceipts.test.ts                 15 tests   (pure-function coverage of every branch)
├── attendance/attendanceRepo.test.ts          8 tests   (CRUD + dedup + partial-error recovery)
├── schedules/scheduleRepo.test.ts             5 tests
├── notifications/
│   ├── sendPushToUser.test.ts                 6 tests   (send · truncate · errors swallowed)
│   └── pushTokenRepo.test.ts                 10 tests   (register · dedup · delete · soft-delete)
└── incidents/incidentRepo.test.ts             6 tests
                                              ─────
                                              56 total, all passing
```

**Patterns:**

- `ts-jest` preset, `node` test environment, `@/*` path-alias mirroring the runtime config
- Every repo test mocks `generateClient().graphql` and asserts on the **shape** of the call (operation, variables, auth mode)
- Edge cases prioritized: null AppSync responses, partial success / partial error (Amplify v6 returns both `data` and `errors`), soft-deleted records, deduplication on upsert, ISO timestamp formatting
- Pure functions (read receipts, card data factories) are tested directly without React

```bash
npx jest                # run the full suite
npx jest --watch        # iterate
npx jest readReceipts   # run a single suite
```

---

## Project Structure

```
project-clara/
├── app/                              50 screens · Expo Router file-based routing
│   ├── _layout.tsx                   Amplify config · ThemeProvider · PortalHost
│   ├── login/                        Pre-auth flow
│   ├── (parent)/(tabs)/              5-tab parent portal + dynamic [studentId] subtree
│   └── (teacher)/(class)/(tabs)/     10-tab class command center
│
├── src/
│   ├── features/                     21 feature modules (api · logic · ui)
│   │   ├── auth/                     Cognito + role routing
│   │   ├── messaging/                Real-time chat + read receipts
│   │   ├── clara/                    AI agent client surface
│   │   ├── attendance/               Teacher write · parent read
│   │   ├── incidents/                4-tier severity reports
│   │   ├── schedules/                Optimistic CRUD with rollback
│   │   ├── medical-records/          Tap-to-edit, parent-owned
│   │   ├── teacher-notes/            Categorized observations
│   │   ├── announcements/            Per-class · cross-class aggregation
│   │   ├── grades/                   Enrollment.currentGrade mutation
│   │   ├── dashboard/                Parent home aggregator
│   │   ├── notifications/            Push tokens · Expo push API
│   │   ├── fetch-user-data/          Login-time hydration
│   │   ├── in-app-settings/          Per-user AsyncStorage
│   │   ├── app-themes/               React-Context theme system
│   │   ├── school-selection/         Pre-login school picker
│   │   ├── child-selection/          Multi-child picker modal
│   │   ├── class-viewer/             Class detail + live announcements
│   │   ├── cards/                    Card components + data factories
│   │   └── context/                  ParentLoginContext · TeacherLoginContext
│   │
│   ├── rnreusables/ui/               11 primitives (button, dialog, select, ...)
│   ├── graphql/                      Auto-generated queries · mutations · subscriptions
│   ├── API.ts                        490 generated TypeScript types (7,227 lines)
│   ├── aws-exports.ts                Amplify config (gitignored values)
│   └── amplifyconfiguration.json
│
├── amplify/
│   └── backend/
│       ├── api/projectclara/
│       │   ├── schema.graphql        16 models · 13 GSIs · 38 relationships
│       │   └── build/resolvers/      844 generated VTL resolvers
│       ├── auth/projectclara0170b5bc/  Cognito user pool config
│       └── function/claraAiAgent/    1,415 LoC across 9 files
│
├── __tests__/                        56 tests across 7 suites
├── lib/                              Theme tokens · cn() utility
├── utils/                            AsyncStorage helpers
├── scripts/                          ask-clara.js · seed-clara.js
├── assets/                           App icons · splash · adaptive-icon
├── app.json                          Expo config (plugins · permissions · adaptive icon)
├── eas.json                          development · preview · production profiles
├── google-services.json              Firebase / FCM for Android push
├── tailwind.config.js                30+ semantic color tokens (light + dark)
├── global.css                        HSL design tokens
├── jest.config.js                    ts-jest · @/* path alias
├── tsconfig.json                     strict mode · path aliases
└── eslint.config.js                  eslint-config-expo flat config

ARCHITECTURE.md · Arch.md · CLARA_AI.md · CLARA_QUICKSTART.md · DEV_NOTES.md
FEATURE_DOCUMENTATION.md · READ_RECEIPTS.md · SESSION_NOTES_MARCH.md · TEST_PLAN.md
```

---

## Getting Started

### Prerequisites

- **Node.js 18+** and npm
- **Expo CLI** (`npm install -g expo-cli`)
- **AWS Amplify CLI** (`npm install -g @aws-amplify/cli`) - only required if modifying the backend
- **EAS CLI** (`npm install -g eas-cli`) - only required for cloud builds
- **Expo Go** on a physical device, or an iOS Simulator / Android Emulator

### Quickstart

```bash
git clone https://github.com/HayatDahraj11/Software-Development-Capstone-Fall-2025-FOXcorp.git
cd Software-Development-Capstone-Fall-2025-FOXcorp/project-clara

npm install
amplify pull            # if you have AWS access; skip otherwise - debug accounts work offline
npx expo start
```

Then press `i` (iOS), `a` (Android), or `w` (Web). On a physical device, scan the QR code with **Expo Go**.

### Debug Accounts (offline-friendly)

Available in `__DEV__` only - bypass Cognito completely and load fixtures from `debug_parent_data.ts` / `debug_teacher_data.ts`.

| Username | Password | Routes To |
| --- | --- | --- |
| `parent_debug` | `debug` | Parent portal with Hayat + 3 children + 4 classes |
| `teacher_debug` | `debug` | Teacher portal with Mr. Smith + 4 classes + 15 students |

### Connecting Clara

Clara is hosted on a Lambda anyone on the team can call. Drop a single env var into `.env.local`:

```bash
echo 'EXPO_PUBLIC_CLARA_ENDPOINT=https://d4in1icwsa.execute-api.us-east-1.amazonaws.com/clara' > .env.local
npx expo start --clear
```

If you want to run the Lambda locally, see `CLARA_QUICKSTART.md`.

---

## Available Scripts

| Command | What it does |
| --- | --- |
| `npm start` | Start the Expo dev server |
| `npm run ios` | Build and run on iOS Simulator |
| `npm run android` | Build and run on Android Emulator/device |
| `npm run web` | Start the web build |
| `npm run lint` | ESLint (flat config) |
| `npx jest` | Run the full 56-test suite |
| `amplify push` | Deploy backend changes (creates DynamoDB columns, regenerates resolvers) |
| `amplify codegen` | Regenerate `src/API.ts` and `src/graphql/*` from the schema |
| `amplify status` | Inspect drift between local and deployed backend |
| `eas build --profile preview` | Cloud-build a preview APK / iOS internal-distribution build |

---

## Navigation Map

### Parent Portal - 5 tabs · 7 student detail screens · 4 settings screens

```
   /(parent)/(tabs)/
   ├── home               Dashboard cards (latest message · medical alert · 
   │                      recent absences · incidents · Ask Clara entry tile)
   ├── messaging          Inbox · unread dots · pull-to-refresh · "New conversation" sheet
   ├── live-updates       Map view of student status / location
   ├── general-info       Child picker → per-student detail subtree
   │   └── [studentId]/
   │       ├── studentSchedule        Day badges · 12-hour times
   │       ├── studentAttendance      History with color-coded statuses
   │       ├── studentMedical         Allergies · meds · conditions · emergency
   │       ├── studentIncidents       Severity badges
   │       ├── studentDocumentation   Teacher-uploaded documents
   │       ├── studentRecords         Academic records
   │       └── index                  Overview
   └── (hamburger)/
       ├── settings                   Theme toggle · preferences
       ├── account_settings           Profile
       └── notification_settings      Push prefs
```

### Teacher Portal - 10 tabs · class command center

```
   /(teacher)/(class)/(tabs)/
   ├── class                 Roster overview
   ├── attendance-list       Take + view attendance · optimistic UI
   ├── attendance-map        Geo view of attendance
   ├── take-attendance       Roster with Present/Absent/Late buttons
   ├── grades                Grade entry + chart visualizations
   ├── announcements         Post / view class bulletins
   ├── messaging             Per-parent direct threads
   ├── incidents             4-tier severity log + creation modal
   ├── schedule              Day-of-week + time-block CRUD
   └── (hamburger)/          Settings · account · notifications
```

---

## Deployment

### Backend (Amplify)

```bash
amplify status                # check drift
amplify push                  # deploys schema → DynamoDB tables, GSIs, AppSync resolvers
amplify codegen               # regenerates src/API.ts + src/graphql/* from the new schema
```

Always run `push` **before** `codegen` - the codegen reads the deployed schema.

### Mobile builds

```bash
eas build --profile development     # internal Dev Client
eas build --profile preview         # APK for QA / share-link distribution
eas build --profile production      # auto-incremented build for store submission
```

Push notifications require:

- `google-services.json` checked in for FCM (Android)
- Expo's APNs key configured in EAS (iOS)
- Each device hits `registerPushToken()` on login → token written to DynamoDB

### Clara Lambda (deployed outside Amplify CloudFormation)

```bash
cd amplify/backend/function/claraAiAgent/src
zip -r claraAiAgent.zip .
aws lambda update-function-code --function-name claraAiAgent --zip-file fileb://claraAiAgent.zip

# update env vars (e.g. rotated Gemini key)
aws lambda update-function-configuration \
   --function-name claraAiAgent \
   --environment Variables={GEMINI_API_KEY=...,APPSYNC_ENDPOINT=...,APPSYNC_API_KEY=...}
```

The Lambda lives behind an API Gateway HTTP API (`POST /clara`) and has a public CORS-enabled URL.

---

## Engineering Patterns Worth Calling Out

- **`isMounted` refs everywhere** - every async hook holds `useRef(true)` and clears it on unmount. State updates after unmount silently no-op. No "can't perform a state update on an unmounted component" warnings, ever.
- **Lean GraphQL mutations.** Auto-generated mutations include nested `@belongsTo` selections that AppSync resolvers occasionally fail on. Custom inline mutations (`createIncidentLean`, `updateEnrollmentLean`, etc.) request only the flat fields and dodge the resolver path entirely.
- **Optimistic UI with rollback.** Schedules edit/remove apply locally first, then revert on server failure. Messages get a `temp-` id swapped for the real one on confirmation.
- **Partial error recovery.** Amplify v6 sometimes returns both `data` and `errors` for partial-success responses. Repos extract `data` even when the result throws - the user sees what arrived rather than nothing.
- **Subscription echo dedup.** The same row that arrives via `onCreateMessage` after an optimistic send is dropped on arrival. `if (state.find(m => m.id === incoming.id)) return;`.
- **Fire-and-forget side effects.** Conversation preview updates, push notifications, and Clara triggers all run after `sendMessage` returns. The user never waits for them; failures are logged but never bubble up.
- **Custom queries when generated ones aren't enough.** `listClassesWithEnrollments` (teacher hydration) and `teacherNotesByStudentId` with pagination are inlined where the auto-generated shapes were too shallow.
- **Repository return tuples.** Every API function returns `{ data, error }`. The caller branches once and doesn't need a try/catch. Rust-style at home in TypeScript.
- **Defense in depth.** Authorization checks happen at three layers - AppSync `@auth` rules · feature-level repo guards · Clara tool-level `assertStudentBelongsToParent`. Each layer assumes the others might fail.
- **Provider-agnostic LLM client.** Swapping OpenAI for Gemini was *one* file. Every other line of Clara code is provider-blind.

---

## Known Limitations & Roadmap

- **Read receipts v1** scopes to DIRECT threads. GROUP threads need per-parent tracking on the conversation row - schema-design work, not deferred indefinitely.
- **Clara doesn't stamp `teacherLastReadAt`** on its own replies. Parents will never see "Seen" on Clara conversations until that's wired into the engine.
- **Push preferences are local only** - toggling notifications off in-app doesn't propagate to the sender. Server-side preferences are next.
- **Teacher grade editing** flows through `updateStudentGrade` but lacks a polished UI; current entry is per-row inline.
- **Cognito pool ID mismatch** between `aws-exports.ts` and the Amplify backend was patched once; if it drifts again, login routing is the symptom.
- **Emergency notifications** model exists in the schema but doesn't yet have a publishing UI - designed-in, build-pending.
- **Group conversations** display correctly but the inbox sort treats them as DIRECT threads.
- **No UI component tests yet.** Repo and pure-function layers are bulletproof; rendering tests are the next milestone.

---

## Documentation Index

| Doc | Topic |
| --- | --- |
| [`ARCHITECTURE.md`](ARCHITECTURE.md) · [`Arch.md`](Arch.md) | Feature-Based MVVM rationale |
| [`CLARA_AI.md`](CLARA_AI.md) | Clara design · function-calling rationale · OpenAI→Gemini migration · stress test results · cost math |
| [`CLARA_QUICKSTART.md`](CLARA_QUICKSTART.md) | 3-command teammate onboarding |
| [`DEV_NOTES.md`](DEV_NOTES.md) | Login routing implementation log |
| [`FEATURE_DOCUMENTATION.md`](FEATURE_DOCUMENTATION.md) | Push notifications + attendance/incidents/schedules build notes |
| [`READ_RECEIPTS.md`](READ_RECEIPTS.md) | Schema additions · pure-function logic · backwards compatibility |
| [`SESSION_NOTES_MARCH.md`](SESSION_NOTES_MARCH.md) | Live data inventory · known issues · debug credentials |
| [`TEST_PLAN.md`](TEST_PLAN.md) | Manual regression checklist · deployment order |

---

## Team

Built by **Hayat Sikandar Dahraj** and the FOXcorp Capstone team at the University of North Texas (Software Development Capstone, 2025-2026).

| Role | Owner |
| --- | --- |
| Architecture · backend · AI agent · messaging · theming | Hayat Sikandar Dahraj |
| Capstone team · feature contributions · QA · design feedback | FOXcorp |

---

## Status & License

**Active development.** Core infrastructure, real-time messaging, push notifications, AI assistant, attendance, incidents, schedules, medical records, teacher notes, theming, and 56 tests are shipping. Remaining work is polish - UI tests, group-thread read receipts, server-side notification preferences, emergency-notification publishing UI.

Developed as part of a university Software Development Capstone (Fall 2025 – Spring 2026). Not currently licensed for public distribution.

---

<div align="center">

*Built with deliberate architecture, real-time data, and a healthy fear of native crashes.*

</div>
