### 1. Feature-First Structure (MVVM)
We have moved away from a "Type-Based" organization (grouping all APIs together, all components together) to a **Feature-Based** organization that implements the **MVVM (Model-View-ViewModel)** pattern.

**Why this matters:**
In a large application, related code should sit together. If a developer needs to fix the "Login" feature, they shouldn't have to jump between `src/api`, `src/components`, and `src/screens`. They simply open `src/features/auth`.

**The Anatomy of a Feature Folder:**
Each feature folder (e.g., `src/features/auth/`) is a self-contained module containing three specific sub-directories that map directly to **MVVM**:

* **`api/` (The Model / Messenger)**
    * **Role:** This folder is the *only* place that talks to the outside world (AWS, Databases, APIs).
    * **Rule:** It never contains UI logic. It simply asks for data and hands it back.
    * *Simplified:* "I don't know what a 'Button' is. I just know how to knock on AWS's door and ask for a user token."

* **`logic/` (The ViewModel / Brain)**
    * **Role:** This folder contains Custom Hooks (e.g., `useLogin`). It manages the *state* and *business rules*.
    * **Rule:** It connects the API to the UI. It handles loading states, error catching, and form validation.
    * *Simplified:* "I am the manager. When the user clicks 'Submit', I check if the password is valid. If it is, I tell the API to fetch data. If the API fails, I tell the UI to show a red error message."

* **`ui/` (The View / Face)**
    * **Role:** This folder contains the React Native components (e.g., `LoginForm.tsx`).
    * **Rule:** These are "Dumb Components." They have no logic. They just display what the `logic/` folder tells them to display.
    * *Simplified:* "I am just the pixels. I show a box. If the Brain tells me to spin, I show a spinner. I don't decide anything."

