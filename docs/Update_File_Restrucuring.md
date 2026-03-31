
# Message for Team - From Hayat


Hey everyone! Big backend update - please read

So I have been working on restructuring the codebase and setting up the actual database for the Parent Portal. Here is what has been happening:

---

**Architecture Changes (MVVM)**

I refactored our code into a "Feature-Based MVVM" structure. Basically, instead of having random files scattered everywhere, each feature now has its own folder with 3 layers:

```
src/features/
├── auth/                      <- Login feature
│   ├── api/authRepo.ts        <- MODEL: Talks to AWS (Cognito)
│   ├── logic/useLogin.ts      <- VIEWMODEL: Form state, validation, business logic
│   └── ui/LoginForm.tsx       <- VIEW: Just the UI (buttons, inputs, styling)
│
└── school-selection/          <- School picker feature
    ├── api/schoolRepo.ts      <- MODEL: Fetches schools from database
    ├── logic/useSchoolSelection.ts <- VIEWMODEL: Search/filter state
    └── ui/SchoolPicker.tsx    <- VIEW: Just the visual UI
```

**What is MVVM?**
- **Model (api/)** = Talks to backend. Does not know what a button is. Just fetches data.
- **ViewModel (logic/)** = The brain. Manages state, validation, decides what to do.
- **View (ui/)** = Just pixels. Shows what the ViewModel tells it to show. No decisions.

**Why does this matter?**
- Everything related to a feature is in ONE folder
- If you need to fix login -> go to `src/features/auth/`
- If you need to fix school picker -> go to `src/features/school-selection/`
- No more jumping between 5 different folders to understand one feature

---

**Database is LIVE**

I pushed a GraphQL schema to AWS. We now have real DynamoDB tables:

| Table | What it stores |
|-------|---------------|
| School | Schools for the picker |
| Parent | Parent accounts (linked to Cognito login) |
| Student | Kids profiles (name, grade, attendance, status) |
| ParentStudents | Links parents to their children |

**The relationship:**
```
Parent -> has many -> Students
```

So when a parent logs in, we can query their record and get `parent.students.items` which returns ONLY their kids.

---

**Test Data Seeded**

I created test data so you can build UI against real responses:

- Parent: "Hayat"
- Student: "Darcey" (Grade 3, 100% attendance, status: "Present")
- They are linked together

When you query listParents, you will get:
```json
{
  "firstName": "Hayat",
  "students": {
    "items": [
      {
        "student": {
          "firstName": "Darcey",
          "gradeLevel": 3,
          "currentStatus": "Present"
        }
      }
    ]
  }
}
```

---

**For Frontend Devs - How to Use This**

**Step 1:** Pull the latest
```bash
git pull
amplify pull
```

**Step 2:** Check out the generated types in `src/API.ts` - you will see Parent, Student, etc.

**Step 3:** To fetch a parent's children:
```typescript
import { generateClient } from 'aws-amplify/api';
import { listParents } from '@/src/graphql/queries';

const client = generateClient();

const result = await client.graphql({ query: listParents });
const parents = result.data.listParents.items;

// Each parent has .students.items with their kids
const firstParentKids = parents[0].students.items;
```

**Step 4:** Use that data to populate the Home Screen, Student Info screen, etc.

---

**What About Login Routing? (Parent vs Teacher)**

This is still on MY plate. Here is how it will work:

1. User logs in with Cognito -> gets a unique ID
2. App queries: "Is there a Parent record with this ID?"
3. If yes -> route to /(parent) and show their kids
4. If no -> route to /(teacher)

I will implement this in useLogin.ts next. For now, the debug logins still work (parent_debug / debug).

---


Questions? Let me know if anything is confusing or if you need me to seed more test data (like multiple kids, different grades, etc.)

Lets gooo
