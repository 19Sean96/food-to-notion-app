# Active Issues & Codebase Analysis

This document outlines active issues, potential improvements, and an analysis of the "Food to Notion" application's codebase.

---

## Components & State

### State Management & Re-rendering

-   **Prop-Drilling in `app/page.tsx`**: The main `Home` component in `app/page.tsx` has grown into a large state manager. It fetches data and then passes numerous props and callbacks down to child components like `SearchModal`, `NotionSetupModal`, and `NavigationSidebar`. This pattern, known as "prop-drilling," makes the code harder to read, maintain, and debug. Any state update in the `Home` component could trigger re-renders in all child components, even if they don't use the updated state.
-   **Inter-dependent Hooks**: The `useFoodSearch` hook depends on `notionDatabaseId`, which is managed in the `Home` component. This creates a tight coupling between the component's state and the hook's internal logic. This can lead to complex data flows and make it difficult to isolate and test the hook's functionality.
-   **Complex State in `FoodCard.tsx`**: The `FoodCard` component manages a significant amount of its own state, including serving size, editable titles, and UI visibility toggles. While this encapsulation is good, the component has become complex. The `isDirty` logic, which checks for changes, is manually implemented and could be a source of bugs.

### Hydration Issues

-   **No Server-Side Rendering (SSR) or Static Site Generation (SSG)**: The entire application is rendered client-side (`'use client'`). This means the user sees a blank page until all the JavaScript loads and executes. For a data-driven application like this, it would be beneficial to render the initial state on the server to improve perceived performance and SEO.
-   **No Obvious Hydration Mismatches**: While there are no clear hydration errors, the lack of SSR means the application is not taking full advantage of Next.js's capabilities. A future refactor could introduce server-side data fetching for the initial page load.

### Recommendations:

-   **Refactor State Management**:
    -   **Introduce a Global State Manager**: Instead of passing props down through multiple levels, consider using a global state management library like Zustand or React Context with `useReducer`. This would allow components to access the state they need directly, reducing prop-drilling and unnecessary re-renders.
    -   **Decouple Hooks from Component State**: Refactor the `useFoodSearch` hook to be more self-contained. Instead of passing `notionDatabaseId` as an argument, the hook could fetch it from the global state.
    -   **Simplify `FoodCard`**: Offload some of the complex state logic from `FoodCard` to a custom hook (e.g., `useFoodCardState`). This would make the component more focused on rendering UI and easier to test.
-   **Adopt SSR or SSG**: For the main page, consider fetching the initial data on the server using `getServerSideProps` or generating it at build time with `getStaticProps`. This would provide a faster initial load and improve the user experience.

--- 