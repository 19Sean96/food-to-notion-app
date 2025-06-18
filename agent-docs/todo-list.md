# TO-DO LIST: Application Refactor & Bug Fixes

## Preface / Usage Instructions

This document outlines the sequential tasks required to refactor the application's state management, improve the component architecture, and resolve known bugs.

### Order of Approach

The tasks are designed to be completed **sequentially**, as listed. Each phase builds upon the previous one, starting with foundational state management changes and progressively moving to component-level refactoring and bug fixes. Please follow the order to ensure a smooth implementation process.

### Completing a Task

1.  Read the task description and the specific implementation details carefully.
2.  Implement the changes as described in the relevant files.
3.  After completing and verifying a task, mark it as complete.

### Documenting Completed Tasks

When a task is completed, you can add implementation notes under it. These notes should be concise and highlight any important decisions, alternative approaches considered, or potential follow-up actions.

---

## TO-DO LIST - TASK LIST

### Phase 1: Foundational State Management Refactor (Zustand Setup)

**Objective:** Introduce a global state manager (Zustand) to centralize UI state, data from APIs, and user interactions. This will eliminate prop-drilling and create a single source of truth.

-   **[x] Task 1.1: Install Zustand**
    -   **Action:** Add `zustand` to the project dependencies.
    -   **Command:** `npm install zustand`

-   **[x] Task 1.2: Create the Global Store**
    -   **Action:** Create a new directory `store/`. Inside it, create a file named `appStore.ts`.
    -   **File:** `store/appStore.ts`
    -   **Details:** Define a Zustand store that will manage the entire application state. The initial state should include slices for UI modals, Notion integration, and food search data.

-   **[x] Task 1.3: Define Store State and Actions**
    -   **File:** `store/appStore.ts`
    -   **Action:** Define the state shape and actions within the store. This will replace the logic currently managed by `useState` in `app/page.tsx` and the custom hooks `useFoodSearch` and `useNotionIntegration`.
    -   **State to Centralize:**
        -   `searchModalOpen`, `notionModalOpen`, `sidebarCollapsed`
        -   `notionDatabaseId`, `databaseInfo`, `databaseLoading`
        -   `queries`, `results`, `loading` (for search)
        -   `existingFdcIds`, `pageIds`, `savingItems`
    -   **Actions to Create:**
        -   `toggleSearchModal`, `toggleNotionModal`, `toggleSidebar`
        -   `setNotionDatabaseId`, `loadDatabaseInfo` (will contain the logic from `handleLoadDatabase` in `page.tsx`)
        -   `addQuery`, `removeQuery`, `updateQuery`, `searchAllFoods`
        -   `saveToNotion`, `updateNotionPage`

### Phase 2: Integrate Zustand into the Application

**Objective:** Refactor existing pages, components, and hooks to use the new Zustand store, removing old state management logic.

-   **[x] Task 2.1: Refactor `app/page.tsx`**
    -   **File:** `app/page.tsx`
    -   **Action:** Remove all `useState` and `useEffect` hooks related to the state now managed by Zustand. Replace them with calls to the `useAppStore` hook to select state and actions.
    -   **Details:** The component should become much leaner, primarily responsible for layout and passing down only essential, non-state props if any. The handler functions (`handleLoadDatabase`, `handleSaveFood`, `handleSearch`) will now just call the corresponding actions from the store.

-   **[x] Task 2.2: Deprecate Old Hooks**
    -   **Files:** `hooks/useFoodSearch.ts`, `hooks/useNotionIntegration.ts`
    -   **Action:** The logic from these hooks will have been moved into the Zustand store. These files can now be deleted.

-   **[x] Task 2.3: Refactor Modals (`SearchModal` & `NotionSetupModal`)**
    -   **Files:** `components/SearchModal.tsx`, `components/NotionSetupModal.tsx`
    -   **Action:** Update these components to get their state and props directly from the `useAppStore` hook.

-   **[x] Task 2.4: Refactor `Header` and `NavigationSidebar`**
    -   **Files:** `components/Header.tsx`, `components/NavigationSidebar.tsx`
    -   **Action:** Connect these components to the `useAppStore` hook to get their state and dispatch actions.

### Phase 3: Address Specific Issues & Bugs

**Objective:** With the new state management in place, resolve the specific issues outlined in `additional-issue-details.md`.

-   **[x] Task 3.1: Fix UI Routing & Shared Layout (Issue #3)**
    -   **File:** `app/layout.tsx`
    -   **Action:** Move the `<NavigationSidebar />` and `<Header />` components from `app/page.tsx` into the root `app/layout.tsx`.
    -   **File:** `components/NavigationSidebar.tsx`
    -   **Action:** Add logic to determine the active route using the `usePathname` hook.

-   **[x] Task 3.2: Fix Conditional Logic in `FoodCard` (Issue #1)**
    -   **File:** `components/FoodCard.tsx`
    -   **Action:** Refactor the component's logic to correctly determine whether the "Save to Notion" or "Update Page" button should be displayed.

-   **[x] Task 3.3: Fix Incorrect Data Rendering (Issue #2)**
    -   **Action:** Ensure that when `saveToNotion` or `updatePage` actions are successful, the state in the Zustand store is updated immediately.

-   **[x] Task 3.4: Fix Miscellaneous UI Issues (Issue #4)**
    -   **File:** `components/NotionSetupModal.tsx`
    -   **Action:** Add a max height and `overflow-y-auto` to the modal's content area.
    -   **File:** `components/FoodCard.tsx`
    -   **Action:** Adjust the CSS to remove the unwanted focus ring on child button clicks.

-   **[x] Task 3.5: Resolve Double Toast Notifications**
    -   **Action:** The state refactor in Phase 1 & 2 should prevent the redundant re-renders that cause this. Task was to verify the fix.