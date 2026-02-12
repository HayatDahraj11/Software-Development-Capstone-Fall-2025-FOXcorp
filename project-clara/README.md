# Project Clara

A cross-platform mobile application built for real-time school communication between parents and teachers. Clara provides role-based portals where parents can track their children's attendance, grades, schedules, and receive live updates, while teachers can manage classrooms, take attendance, post announcements, and communicate directly with guardians.

Built with React Native and Expo for iOS, Android, and Web. Powered by a serverless AWS backend with real-time GraphQL subscriptions.

> This project is actively being developed as part of a university Software Development Capstone (2025-2026).

---

## Table of Contents

- [The Problem](#the-problem)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Data Model](#data-model)
- [Authentication & Role-Based Routing](#authentication--role-based-routing)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Setup](#environment-setup)
- [Available Scripts](#available-scripts)
- [Navigation Map](#navigation-map)
- [Development Notes](#development-notes)

---

## The Problem

Schools rely on fragmented communication channels between parents and teachers. Report cards come home late, attendance issues go unnoticed, and there's no centralized way for a parent to see their child's day-to-day school life in real time.

Clara solves this by giving each user a role-specific portal:

**Parents** see a dashboard for each of their children with schedules, grades, attendance rates, live status updates, teacher notes, and direct messaging with teachers.

**Teachers** get a classroom management hub with attendance tracking (including map-based views), grade entry, announcements, and parent communication tools.

The app determines which portal to show automatically based on the logged-in user's database records. No manual role assignment needed.

---

## Architecture

The codebase follows a **Feature-Based MVVM** pattern adapted for React Native. Each feature is self-contained with three layers:

```
src/features/<feature-name>/
    api/        Model         Data source. Talks to AWS (GraphQL, Cognito, AsyncStorage).
    logic/      ViewModel     Custom hooks. Manages state, validation, business rules.
    ui/         View          React components. Renders UI. Contains no business logic.
```

This separation means the UI layer never touches AWS directly. A component like `LoginForm.tsx` doesn't know how login works. It calls `handleLogin()` from the `useLogin` hook, and the hook calls `loginUser()` from `authRepo.ts`. Each layer has one job.

**Why this matters:** Any developer on the team can change how login works (switch from Cognito to Firebase, for example) by editing one file in `api/` without touching the UI or the state management.

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Framework** | React Native + Expo | RN 0.81, Expo 54, React 19 |
| **Language** | TypeScript | 5.9 (strict mode) |
| **Navigation** | Expo Router | File-based routing with typed routes |
| **Auth** | AWS Cognito | User pools with email sign-up |
| **API** | AWS AppSync | GraphQL with real-time subscriptions |
| **Database** | Amazon DynamoDB | NoSQL, provisioned through Amplify |
| **IaC** | AWS Amplify CLI | Schema-driven backend provisioning |
| **Storage** | AsyncStorage | Local device storage for user preferences |
| **Animations** | React Native Reanimated | 4.1 |
| **Notifications** | Expo Notifications | Push notification support |
| **Build** | EAS Build | Cloud builds for iOS/Android distribution |

---

## Data Model

The backend is defined through a single GraphQL schema that Amplify transforms into DynamoDB tables, AppSync resolvers, and auto-generated TypeScript types.

```
┌──────────┐       ┌────────────────┐       ┌──────────┐
│  School  │───1:N─│    Teacher     │───1:N─│  Class   │
│          │       │                │       │          │
│ name     │       │ name           │       │ name     │
│ address  │       │ cognitoUserId  │       │          │
└──────────┘       └────────────────┘       └──────────┘
     │                                           │
     │1:N                                        │1:N
     ▼                                           ▼
┌──────────┐       ┌────────────────┐       ┌────────────┐
│ Student  │───M:N─│ ParentStudents │───M:N─│   Parent   │
│          │       │  (join table)  │       │            │
│ firstName│       │ parentId       │       │ firstName  │
│ lastName │       │ studentId      │       │ lastName   │
│ gradeLevel       └────────────────┘       │ cognitoId  │
│ attendance                                └────────────┘
│ status   │
└──────────┘
     │1:N
     ▼
┌────────────┐
│ Enrollment │
│            │
│ studentId  │
│ classId    │
│ grade      │
└────────────┘
```

### Relationships

| Relationship | Type | Implementation |
|-------------|------|---------------|
| Parent to Student | Many-to-Many | `@manyToMany` via ParentStudents join table |
| Student to School | Many-to-One | `@belongsTo` on Student |
| Teacher to School | Many-to-One | `@belongsTo` with `bySchool` index |
| Teacher to Classes | One-to-Many | `@hasMany` with `byTeacher` index |
| Student to Enrollments | One-to-Many | `@hasMany` with `byStudent` index |
| Class to Enrollments | One-to-Many | `@hasMany` with `byClass` index |

### Authorization Rules

| Model | Rule | Effect |
|-------|------|--------|
| School | `allow: public (apiKey)` | Anyone can read schools (used on login screen before auth) |
| Parent | `allow: owner` | Parents can only access their own record |
| Parent | `allow: private (read)` | Any authenticated user can read parent data |
| Student | `allow: groups ["Teachers"] (read, update)` | Teachers can view and update student records |
| Student | `allow: private (read)` | Authenticated users can read student data |

---

## Authentication & Role-Based Routing

Clara uses a **data-driven** approach to role detection instead of Cognito user groups.

```
User enters credentials
        │
        ▼
AWS Cognito authenticates
        │
        ▼
App receives unique userId
        │
        ▼
GraphQL query: parentsByCognitoUserId(userId)
        │
   ┌────┴────┐
   │         │
 Found    Not Found
   │         │
   ▼         ▼
Parent     Teacher
Portal     Portal
/(parent)  /(teacher)
```

**Why not Cognito Groups?** Database lookups are easier to manage during development. Adding a user to a role means creating a record in DynamoDB, not configuring IAM policies. The routing logic lives in one custom hook (`useLogin.ts`), making it trivial to swap the detection method later.

### Auth Modes

The app uses two authentication modes depending on context:

| Screen | Auth Mode | Reason |
|--------|----------|--------|
| School Selection | `apiKey` | User hasn't logged in yet |
| Everything after login | `userPool` | Cognito token required for protected data |

---

## Project Structure

```
project-clara/
│
├── app/                                    # Screens (Expo Router file-based routing)
│   ├── _layout.tsx                         # Root layout, Amplify config, theme provider
│   ├── index.tsx                           # Entry redirect
│   │
│   ├── login/
│   │   ├── index.tsx                       # Login form
│   │   └── school-selection.tsx            # School picker
│   │
│   ├── (parent)/                           # Parent portal
│   │   └── (tabs)/
│   │       ├── home.tsx                    # Parent dashboard
│   │       ├── messaging.tsx               # Parent-teacher messaging
│   │       ├── live-updates.tsx            # Real-time student status
│   │       ├── general-info.tsx            # Student info with child picker
│   │       ├── [studentId]/                # Dynamic per-student pages
│   │       │   ├── studentSchedule.tsx
│   │       │   ├── studentRecords.tsx
│   │       │   └── studentDocumentation.tsx
│   │       └── (hamburger)/
│   │           ├── settings.tsx            # Theme toggle, preferences
│   │           ├── account_settings.tsx
│   │           └── notification_settings.tsx
│   │
│   └── (teacher)/                          # Teacher portal
│       └── (class)/(tabs)/
│           ├── class.tsx                   # Class overview
│           ├── attendance-list.tsx         # Attendance roster
│           ├── attendance-map.tsx          # Map-based attendance view
│           ├── grades.tsx                  # Grade management
│           ├── announcements.tsx           # Class announcements
│           ├── messaging.tsx               # Teacher-parent messaging
│           └── (hamburger)/
│               ├── settings.tsx
│               ├── account_settings.tsx
│               └── notification_settings.tsx
│
├── src/
│   ├── API.ts                              # Auto-generated GraphQL types
│   ├── graphql/                            # Auto-generated queries, mutations, subscriptions
│   │
│   └── features/                           # Feature-based MVVM modules
│       ├── auth/
│       │   ├── api/authRepo.ts             # Cognito sign-in/sign-out
│       │   ├── logic/useLogin.ts           # Login state + role routing
│       │   └── ui/LoginForm.tsx            # Login form component
│       │
│       ├── school-selection/
│       │   ├── api/schoolRepo.ts           # GraphQL school queries
│       │   ├── logic/useSchoolSelection.ts # Search/filter logic
│       │   └── ui/SchoolPicker.tsx         # School picker modal
│       │
│       ├── app-themes/
│       │   ├── constants/theme.ts          # Light/dark color palettes
│       │   └── logic/
│       │       ├── ThemeContext.tsx         # Theme state management (React Context)
│       │       ├── use-color-scheme.ts     # Theme-aware color scheme hook
│       │       └── use-theme-color.ts      # Per-color accessor hook
│       │
│       ├── in-app-settings/
│       │   ├── api/storage_handler.ts      # AsyncStorage persistence
│       │   └── logic/useStoredSettings.ts  # Settings state + theme application
│       │
│       ├── cards/ui/Card.tsx               # Reusable card component
│       ├── child-selection/ui/             # Child picker modal
│       ├── class-viewer/ui/                # Class detail modal
│       └── notifications/logic/            # Push notification setup
│
├── amplify/                                # AWS Amplify backend
│   └── backend/
│       ├── api/projectclara/schema.graphql # GraphQL schema (source of truth)
│       └── auth/                           # Cognito user pool config
│
└── context/                                # Legacy context providers
    ├── ParentLoginContext.js
    └── TeacherLoginContext.js
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- AWS Amplify CLI (`npm install -g @aws-amplify/cli`)
- Expo Go app on your phone (for testing), or an iOS Simulator / Android Emulator

### Installation

```bash
# Clone the repository
git clone https://github.com/HayatDahraj11/Software-Development-Capstone-Fall-2025-FOXcorp.git
cd Software-Development-Capstone-Fall-2025-FOXcorp/project-clara

# Install dependencies
npm install

# Pull the latest Amplify backend config
amplify pull

# Start the development server
npx expo start
```

Press `i` for iOS Simulator, `a` for Android Emulator, or `w` for web. On a physical device, scan the QR code with the Expo Go app (iOS: use Camera app, Android: use Expo Go app directly).

### First Run

If you're setting up the Amplify backend for the first time:

```bash
amplify init        # Initialize Amplify in the project
amplify push        # Deploy backend resources to AWS
amplify codegen     # Generate TypeScript types and GraphQL operations
```

---

## Environment Setup

The project uses AWS Amplify for backend services. Configuration is stored in:

| File | Purpose |
|------|---------|
| `src/aws-exports.ts` | Auto-generated Amplify config (API endpoints, Cognito pool IDs) |
| `src/amplifyconfiguration.json` | Amplify configuration in JSON format |
| `amplify/team-provider-info.json` | Team-specific AWS provider settings |
| `google-services.json` | Firebase config for Android push notifications |

These files contain environment-specific values and are generated by the Amplify CLI. Do not edit them manually.

---

## Available Scripts

| Command | Description |
|---------|------------|
| `npx expo start` | Start the Expo dev server |
| `npx expo start --clear` | Start with a cleared Metro cache |
| `npm run android` | Build and run on Android |
| `npm run ios` | Build and run on iOS |
| `npm run web` | Start web version |
| `npm run lint` | Run ESLint |
| `amplify push` | Deploy backend changes to AWS |
| `amplify pull` | Sync local config with deployed backend |
| `amplify codegen` | Regenerate TypeScript types from schema |
| `amplify console api` | Open AppSync console in browser |

---

## Navigation Map

### Parent Portal (6 tabs)

| Tab | Screen | Description |
|-----|--------|------------|
| Home | `/(parent)/(tabs)/home` | Dashboard with cards and notifications |
| Messages | `/(parent)/(tabs)/messaging` | Direct messaging with teachers |
| Live Updates | `/(parent)/(tabs)/live-updates` | Real-time student status and location |
| Student Info | `/(parent)/(tabs)/general-info` | Per-child schedule, records, documentation |
| More | `/(parent)/(tabs)/(hamburger)` | Settings, account, notification preferences |

### Teacher Portal (7 tabs)

| Tab | Screen | Description |
|-----|--------|------------|
| Class | `/(teacher)/(class)/(tabs)/class` | Class overview and management |
| Attendance List | `.../(tabs)/attendance-list` | Roster-based attendance |
| Attendance Map | `.../(tabs)/attendance-map` | Map visualization of attendance |
| Grades | `.../(tabs)/grades` | Grade entry and management |
| Announcements | `.../(tabs)/announcements` | Class announcements |
| Messages | `.../(tabs)/messaging` | Parent communication |
| More | `.../(tabs)/(hamburger)` | Settings, account, notification preferences |

---

## Development Notes

### Theme System

The app supports light and dark mode with a custom React Context-based theme system. The theme state is managed in JavaScript rather than through the native `Appearance` API to avoid Android Activity recreation crashes that occur when `Appearance.setColorScheme()` triggers native configuration changes across multiple components simultaneously.

Theme colors are defined in `src/features/app-themes/constants/theme.ts` and accessed throughout the app via the `useThemeColor()` hook.

### GraphQL Code Generation

After modifying `amplify/backend/api/projectclara/schema.graphql`, run:

```bash
amplify push
```

This will update the DynamoDB tables and regenerate:
- `src/API.ts` (TypeScript types for all models)
- `src/graphql/queries.ts` (all query operations)
- `src/graphql/mutations.ts` (all mutation operations)
- `src/graphql/subscriptions.ts` (real-time subscription operations)

Do not edit these generated files manually. They will be overwritten on the next codegen run.

### Debug Logins

In development mode (`__DEV__`), two debug accounts bypass Cognito authentication:

| Username | Password | Routes To |
|----------|----------|-----------|
| `parent_debug` | `debug` | Parent portal |
| `teacher_debug` | `debug` | Teacher portal |

These accounts use hardcoded mock data from `debug_parent_data.ts` and `debug_teacher_data.ts`.

---

## Status

This project is under active development. Core infrastructure (authentication, database schema, role-based routing, theming, and the feature-based architecture) is complete. Remaining work includes real-time messaging, live attendance tracking, grade management, push notification integration, and connecting all screens to live backend data.

---

## License

This project is developed as part of a university capstone course and is not currently licensed for public distribution.
