# Frontend Data Guide: How to Use the Backend Tables

This guide shows you how to fetch data from our DynamoDB tables using GraphQL.

---

## Step 0: Make Sure You Have the Latest Code

```bash
git pull
npx @aws-amplify/cli pull
```

This ensures you have the latest `src/API.ts` types and `src/graphql/` queries.

---

## Step 1: Set Up the GraphQL Client

At the top of any file where you need to fetch data:

```typescript
import { generateClient } from 'aws-amplify/api';

const client = generateClient();
```

This client is what you use to talk to the database.

---

## Step 2: Import the Queries You Need

All auto-generated queries are in `src/graphql/queries.ts`:

```typescript
// Import specific queries
import { listParents, getParent, listStudents, getStudent, listSchools } from '@/src/graphql/queries';
```

---

## Step 3: Fetch Data

### Example 1: Get All Parents

```typescript
import { generateClient } from 'aws-amplify/api';
import { listParents } from '@/src/graphql/queries';

const client = generateClient();

async function fetchAllParents() {
  try {
    const result = await client.graphql({ query: listParents });
    const parents = result.data.listParents.items;

    console.log(parents);
    // Output: [{ id: "...", firstName: "Hayat", lastName: "Parent", ... }]

    return parents;
  } catch (error) {
    console.error("Error fetching parents:", error);
  }
}
```

### Example 2: Get All Students

```typescript
import { generateClient } from 'aws-amplify/api';
import { listStudents } from '@/src/graphql/queries';

const client = generateClient();

async function fetchAllStudents() {
  try {
    const result = await client.graphql({ query: listStudents });
    const students = result.data.listStudents.items;

    console.log(students);
    // Output: [{ id: "...", firstName: "Darcey", gradeLevel: 3, currentStatus: "Present", ... }]

    return students;
  } catch (error) {
    console.error("Error fetching students:", error);
  }
}
```

### Example 3: Get One Parent by ID

```typescript
import { generateClient } from 'aws-amplify/api';
import { getParent } from '@/src/graphql/queries';

const client = generateClient();

async function fetchParentById(parentId: string) {
  try {
    const result = await client.graphql({
      query: getParent,
      variables: { id: parentId }
    });

    const parent = result.data.getParent;
    console.log(parent);
    // Output: { id: "...", firstName: "Hayat", lastName: "Parent", students: { items: [...] } }

    return parent;
  } catch (error) {
    console.error("Error fetching parent:", error);
  }
}

// Usage:
fetchParentById("adc1346a-6642-40b9-ad2a-a3b718183dbd");
```

### Example 4: Get a Parent WITH Their Children (The Important One!)

```typescript
import { generateClient } from 'aws-amplify/api';
import { listParents } from '@/src/graphql/queries';

const client = generateClient();

async function fetchParentWithKids() {
  try {
    const result = await client.graphql({ query: listParents });
    const parents = result.data.listParents.items;

    // Get the first parent
    const parent = parents[0];

    // Access their children
    const children = parent.students.items;

    // Each child is wrapped in a "student" object due to many-to-many
    children.forEach((link) => {
      const kid = link.student;
      console.log(`Child: ${kid.firstName}, Grade: ${kid.gradeLevel}, Status: ${kid.currentStatus}`);
    });

    // Output:
    // Child: Darcey, Grade: 3, Status: Present

    return children;
  } catch (error) {
    console.error("Error:", error);
  }
}
```

---

## Step 4: Use in a React Component

Here is a complete example for a Parent Home Screen:

```typescript
import { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { generateClient } from 'aws-amplify/api';
import { listParents } from '@/src/graphql/queries';

const client = generateClient();

type Student = {
  id: string;
  firstName: string;
  lastName: string;
  gradeLevel: number;
  currentStatus: string;
  attendanceRate: number;
};

export default function ParentHomeScreen() {
  const [children, setChildren] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [parentName, setParentName] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const result = await client.graphql({ query: listParents });
        const parents = result.data.listParents.items;

        if (parents.length > 0) {
          const parent = parents[0];
          setParentName(`${parent.firstName} ${parent.lastName}`);

          // Extract children from the many-to-many link
          const kids = parent.students.items.map((link: any) => link.student);
          setChildren(kids);
        }
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
        Welcome, {parentName}!
      </Text>

      <Text style={{ fontSize: 18, marginTop: 20 }}>Your Children:</Text>

      <FlatList
        data={children}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ padding: 10, marginTop: 10, backgroundColor: '#f0f0f0', borderRadius: 8 }}>
            <Text style={{ fontSize: 16, fontWeight: '600' }}>{item.firstName} {item.lastName}</Text>
            <Text>Grade: {item.gradeLevel}</Text>
            <Text>Status: {item.currentStatus}</Text>
            <Text>Attendance: {item.attendanceRate}%</Text>
          </View>
        )}
      />
    </View>
  );
}
```

---

## Quick Reference: Available Fields

### Parent

```typescript
{
  id: string;
  cognitoUserId: string;    // Links to Cognito login
  firstName: string;
  lastName: string;
  phoneNumber: string;
  canEditRecords: boolean;
  students: {               // Their children
    items: [...]
  }
}
```

### Student

```typescript
{
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;      // Format: "YYYY-MM-DD"
  gradeLevel: number;       // e.g., 3
  attendanceRate: number;   // e.g., 100.0
  currentStatus: string;    // e.g., "Present", "Absent"
}
```

### School

```typescript
{
  id: string;
  name: string;
  address: string;
}
```

---

## Quick Reference: All Available Queries

| Query | What it does | Variables needed |
|-------|--------------|------------------|
| `listParents` | Get all parents | None |
| `getParent` | Get one parent | `{ id: "..." }` |
| `listStudents` | Get all students | None |
| `getStudent` | Get one student | `{ id: "..." }` |
| `listSchools` | Get all schools | None |
| `getSchool` | Get one school | `{ id: "..." }` |

---

## Test Data Currently Available

| Type | Data |
|------|------|
| Parent | Hayat Parent (id: `adc1346a-6642-40b9-ad2a-a3b718183dbd`) |
| Student | Darcey Dahraj, Grade 3, 100% attendance, Status: Present |
| Link | Hayat is linked to Darcey |

---

## Common Mistakes to Avoid

1. **Forgetting to run `amplify pull`** - You need the latest types
2. **Not handling the many-to-many structure** - Children are in `parent.students.items[].student`, not directly in `parent.students`
3. **Not wrapping in try/catch** - Always handle errors
4. **Forgetting async/await** - All GraphQL calls are async

---

## Need More Test Data?

Ask Hayat to seed more data in the AppSync console:
- More students with different grades
- Multiple children per parent
- Different attendance rates and statuses

---

## FAQ (Frequently Asked Questions)

### Q1: How do I pull the backend stuff into my machine and start using it?

**Short answer:**
```bash
git pull
amplify pull --appId dnft3ignj8kkv --envName dev
```

**Long answer:**

1. First, make sure you have the Amplify CLI installed:
```bash
npm install -g @aws-amplify/cli
```

2. Pull the latest code from git:
```bash
git pull
```

3. Pull the Amplify backend config (this syncs your local machine with AWS):
```bash
amplify pull --appId dnft3ignj8kkv --envName dev
```

4. If prompted, select these options:
   - Choose your default editor: (pick yours)
   - Choose the type of app: `javascript`
   - What javascript framework: `react-native`
   - Source directory path: `src`
   - Distribution directory path: `build`
   - Build command: `npm run build`
   - Start command: `npm start`
   - Do you plan to modify this backend? `Yes` 

5. Now you have:
   - `src/API.ts` with all TypeScript types
   - `src/graphql/` with all queries and mutations
   - `src/aws-exports.js` with connection config

6. Start using it in your code!

---

### Q2: What is the full setup process from scratch?

If you just cloned the repo for the first time:

```bash
# 1. Clone the repo
git clone <repo-url>
cd project-clara

# 2. Install dependencies
npm install

# 3. Install Amplify CLI globally (if you dont have it)
npm install -g @aws-amplify/cli

# 4. Pull the backend config
amplify pull --appId dnft3ignj8kkv --envName dev

# 5. Start the app
npx expo start
```

That is it. You are connected to the same AWS backend as everyone else.

---

### Q3: Do I use your app ID or make new ones?

**Use the existing one. Do NOT create new ones.**

```bash
amplify pull --appId dnft3ignj8kkv --envName dev
```

This connects you to OUR shared backend. If you run `amplify init` or create a new app, you will have a separate database with no data.

**The IDs:**
- App ID: `dnft3ignj8kkv` (this is our project)
- Environment: `dev` (development environment)

Everyone on the team uses the same App ID. That is how we all share the same database.

---

### Q4: How do I add new fields/attributes to a table?

**Option A: Ask ME (Hayat)**

 tell me what fields you need and I will add them. This prevents conflicts.

**Option B: GUI Method (AppSync Console)**

1. Go to AWS Console: https://console.aws.amazon.com/appsync/
2. Select "projectclara" API
3. Go to "Schema" in the sidebar
4. Find the type you want to edit (e.g., `Student`)
5. Add your field (e.g., `favoriteSubject: String`)
6. Click "Save Schema"
7. Run `amplify pull` locally to get the updated types

**Option C: CLI Method (For Backend Devs)**

1. Open `amplify/backend/api/projectclara/schema.graphql`
2. Add your field:
```graphql
type Student @model ... {
  id: ID!
  firstName: String!
  lastName: String!
  favoriteSubject: String    # <-- new field
}
```
3. Push the changes:
```bash
amplify push
```
4. Tell everyone to run `amplify pull`

**Warning:** If you push schema changes without telling the team, you might break their code. Always coordinate.

---

### Q5: What is the difference between `amplify pull` and `amplify push`?

| Command | What it does | Who uses it |
|---------|--------------|-------------|
| `amplify pull` | Downloads the latest backend config to your machine | Everyone (frontend devs) |
| `amplify push` | Uploads schema changes to AWS |  |

**Frontend devs:** Only use `amplify pull`. Never `push` unless you know what you are doing.

---

### Q6: I got an "Unauthorized" error when querying. What do I do?

This usually means:

1. **You are not logged in** - Some queries require authentication
2. **The auth rules block you** - The table might have restricted access

**Quick fix for testing:**
Make sure Amplify is configured in your app. Check `app/_layout.tsx`:
```typescript
import { Amplify } from "aws-amplify";
import awsconfig from "../src/aws-exports";

Amplify.configure(awsconfig);
```

If you are still getting errors, ask Hayat(me) to check the auth rules in the schema.

---

### Q7: How do I know what fields are available on each table?

**Option A: Check `src/API.ts`**

This file has all the TypeScript types. Search for `type Parent`, `type Student`, etc.

**Option B: Check the schema directly**

Look at `amplify/backend/api/projectclara/schema.graphql`

**Option C: Use this guide**

Scroll up to "Quick Reference: Available Fields" section.

---

### Q8: Can I add test data myself?

**Yes, using AppSync Console:**

1. Run: `amplify console api`
2. Select "GraphQL"
3. It opens the AWS AppSync console
4. Go to "Queries" in the sidebar
5. Run a mutation like:
```graphql
mutation {
  createStudent(input: {
    firstName: "Test"
    lastName: "Student"
    gradeLevel: 5
  }) {
    id
  }
}
```

**Note:** You might need to switch auth mode to "API Key" in the console dropdown.

---

### Q9: What if I need a table that does not exist yet?

If Stuck Tell Hayat(me) what you need. Include:
- Table name (e.g., `Announcement`)
- Fields you need (e.g., `title`, `content`, `date`)
- Relationships (e.g., "each announcement belongs to a school")

He will add it to the schema and push it.

---

### Q10: My types are out of date / TypeScript is complaining

Run:
```bash
amplify pull --appId dnft3ignj8kkv --envName dev
```

This regenerates `src/API.ts` with the latest types.

If it still complains, try:
```bash
rm -rf src/graphql src/API.ts
amplify pull --appId dnft3ignj8kkv --envName dev
```

---

### Q11: How do I see what data is in the database right now?

**Option A: AppSync Console (Recommended)**
```bash
amplify console api
# Select GraphQL
```
Then run queries like:
```graphql
query {
  listStudents {
    items {
      id
      firstName
      lastName
    }
  }
}
```

**Option B: DynamoDB Console (Raw Tables)**
```bash
amplify console
# Select "DynamoDB"
```
You will see the raw tables. Click on one to browse items.

---

### Q12: What is the difference between `listParents` and `getParent`?

| Query | Returns | Use when |
|-------|---------|----------|
| `listParents` | Array of all parents | You want to see everyone |
| `getParent(id: "...")` | One specific parent | You know the ID you want |

Same pattern for all tables: `listStudents` vs `getStudent`, etc.

---

### Q13: The app works but I see no data. Why?

1. **Database might be empty** - Check AppSync console to verify data exists
2. **Auth issues** - You might not have permission to read
3. **Wrong query** - Double check your query syntax
4. **Network issue** - Check your internet connection

Debug by adding console.log:
```typescript
const result = await client.graphql({ query: listParents });
console.log("Raw result:", JSON.stringify(result, null, 2));
```

---

### Q14: Who do I ask if I am stuck?

1. **Backend/Database questions** - Ask Hayat(ME)
2. **Frontend/UI questions** - Ask your frontend team
3. **General React Native questions** - Check the docs or ask in the group chat

---

## Resources

If you prefer reading official docs, here you go:

### AWS Amplify (Our Backend)

- **Amplify Docs (Start Here):** https://docs.amplify.aws/react-native/
- **Amplify API (GraphQL) Guide:** https://docs.amplify.aws/react-native/build-a-backend/data/connect-to-API/
- **Amplify Data Modeling:** https://docs.amplify.aws/react-native/build-a-backend/data/data-modeling/

### GraphQL (Query Language)

- **GraphQL Official Docs:** https://graphql.org/learn/
- **GraphQL Queries and Mutations:** https://graphql.org/learn/queries/
- **AWS AppSync (GraphQL on AWS):** https://docs.aws.amazon.com/appsync/latest/devguide/what-is-appsync.html

### React Native

- **React Native Docs:** https://reactnative.dev/docs/getting-started
- **Expo Docs (Our Framework):** https://docs.expo.dev/
- **Expo Router (Our Navigation):** https://docs.expo.dev/router/introduction/

### TypeScript

- **TypeScript Handbook:** https://www.typescriptlang.org/docs/handbook/intro.html
- **TypeScript with React:** https://react.dev/learn/typescript

### Video Tutorials

- **Amplify in 10 Minutes (YouTube):** https://www.youtube.com/watch?v=kqi4gPfdVHY
- **GraphQL Crash Course (YouTube):** https://www.youtube.com/watch?v=ed8SzALpx1Q
- **AWS Amplify Full Course (freeCodeCamp):** https://www.youtube.com/watch?v=HlAr5XxjBqM

### Quick Cheat Sheets

- **GraphQL Cheat Sheet:** https://devhints.io/graphql
- **React Native Cheat Sheet:** https://github.com/vhpoet/react-native-styling-cheat-sheet
- **TypeScript Cheat Sheet:** https://www.typescriptlang.org/cheatsheets
