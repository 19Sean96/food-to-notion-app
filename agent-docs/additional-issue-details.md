# 📌 Context / Recent Changes
Significant progress has been made recently. Please review commit history for details. Notable enhancements include:
- Customizing food entry titles and serving sizes (measurement, unit, display name).
- View and edit functionality for all saved food entries via UI.
- General UI improvements.

# 🛠️ Current Issues
Below are clearly articulated issues affecting functionality, requiring debugging and resolution:

## 🔴 Issue 1: Conditional Logic (Food Entry Editing/Adding)

Current Behavior:
- Editing the title and serving size of an unsaved food entry incorrectly changes the CTA from "Save to Notion" to "Update Page".
- Clicking "Update Page" incorrectly adds the food entry to Notion with default title/nutrient data, serving size as "Not specified", and no Toast notification.
- If only the serving size is edited (without editing the title), it correctly maintains CTA as "Save to Notion" and posts correct data with proper toast notification. Subsequent edits to the title also behave correctly afterward.

Expected Behavior:
- CTA should stay "Save to Notion" until the entry is initially saved.
- Data posted should match user-edited fields for title and serving size.
- Consistent and correct Toast notifications must appear when saving data.

Cause Hypothesis:
- Incorrect or insufficient conditional logic/state handling within <FoodCard> or associated components.

## 🔴 Issue 2: Incorrect Rendering of Updated Data

Current Behavior:
- When searching USDA API, entries already stored in Notion display the original USDA data, not updated values saved in Notion.
- Similarly, the /saved-items route displays default USDA values instead of updated Notion data.

Expected Behavior:
- All instances of <FoodCard> (homepage search results, /saved-items) should display updated data from Notion if available.

Cause Hypothesis:
- State-management logic or data-fetching mechanisms incorrectly handling data sync between USDA API and Notion database.

## 🔴 Issue 3: UI Routing & Navigation Structure

Current Behavior:
- New /saved-items route lacks Header and Sidebar components when accessed manually via URL.
- Header/Sidebar unnecessarily re-render or vanish when navigating between pages.
- Navigation Sidebar lacks active route state indication, and direct links to / (Home) and /saved-items.

Expected Behavior:
- Implement a shared layout.tsx component containing the <NavigationSidebar> and <Header>. Only page content should re-render on route changes (soft routing via Next.js).
- Navigation Sidebar should include clearly marked routes (Home, Saved Items) with active/inactive state UI.

Cause Hypothesis:
- Misconfigured Next.js routing/layout structure or incorrect component placement.

## 🔴 Issue 4: Miscellaneous UI Issues

Identified issues:
- "Setup Notion" modal is too tall and can exceed viewport height.
- Unwanted "focus" state animation on <FoodCard> when internal buttons are clicked.

Expected Resolution:
- Reduce modal size, ensuring responsive height.
- Remove or adjust the focus state animation to activate only on card-level interactions, not button clicks.

# 📋 Additional Symptoms/Indicators
- Double Toast notifications (e.g., "No results found..." incorrectly following a correct "Found X results..." message), suggesting possible redundant renders or race conditions.
- Suspicion of anti-patterns or inefficient logic (API calls, state management) contributing to or potentially causing future issues.

# ✅ Requested Actions (Clear Task List)
For each identified issue above:
1. Investigate and clearly document root causes by referencing specific files and line numbers in the codebase.
2. Provide clear and specific fixes for each cause, preserving or improving intended functionality.
3. Implement the proposed fixes for each of the stated issues. 

Additionally:
- Audit the codebase proactively to identify and document other hidden or potential problems (logic redundancy, anti-patterns, unnecessary complexity).
- Clearly format additional findings in the same structured manner as above (Problem → Current Behavior → Expected Behavior → Cause → Tasks/Fix).

# 🎯 Summary of Required Outcomes
1. Correct CTA logic and data posting behavior for FoodCards.
2. Accurate UI data display from Notion.
3. Proper component routing and layout structure (layout.tsx implementation).
4. Clean, consistent UI and UX.
5. Resolution of double-toast notification issue.
6. Additional proactive audits for potential future issues.
7. Ensure each deliverable is actionable, with precise, contextually linked references to affected code segments.
