# Mini Seller Console

A simple, yet powerful, web application designed as a mini CRM (Customer Relationship Management) console. It allows users to manage sales leads and opportunities through a clean and intuitive tabular interface. This project is built with modern web technologies and demonstrates best practices in React component design and application structure.

## Features

-   **Dual Views:** Seamlessly switch between "Leads" and "Opportunities" tables.
-   **Lead Management:**
    -   View a paginated list of leads.
    -   Filter leads by Name, Company, Email, and Status.
    -   Sort leads by their "Score".
    -   Inline editing of a lead's email and status.
    -   Convert a lead into an opportunity, which moves it to the Opportunities table.
    -   View lead details in a slide-over panel.
-   **Opportunity Management:**
    -   View a paginated list of opportunities.
    -   Filter opportunities by Name and Account Name.
    -   Sort opportunities by "Amount".
    -   Inline editing of an opportunity's stage and amount.
-   **Persistent State:** Table filters, sorting preferences, and current page number are saved to `localStorage`, so your view is preserved across sessions.
-   **Responsive Design:** The tables are designed to be usable on different screen sizes, with a sticky column for key information.
-   **Simulated API:** A mock API layer with simulated latency provides a realistic data fetching experience.

## Tech Stack

-   **Framework:** React
-   **Language:** TypeScript
-   **Build Tool:** Vite
-   **Styling:** Tailwind CSS
-   **Linting:** ESLint

## Getting Started

### Prerequisites

-   Node.js (v18 or later recommended)
-   npm or yarn

### Installation & Setup

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    ```
2.  Navigate to the project directory:
    ```bash
    cd uitify-test
    ```
3.  Install the dependencies:
    ```bash
    npm install
    ```
4.  Run the development server:
    ```bash
    npm run dev
    ```
5.  Open your browser and go to `http://localhost:5173` (or the URL provided by Vite).

## Project Structure

The project is organized to promote modularity and maintainability.

```
/src
├── api/          # Mock API logic and data persistence (localStorage)
├── components/   # Reusable React components
│   ├── Table.tsx # Generic, reusable table component
│   ├── Lead.tsx
│   └── ...
├── util/         # Shared utilities, constants, and TypeScript interfaces
├── App.tsx       # Main application component
└── main.tsx      # Application entry point
```

### Data Management

The application uses a mock API located in `src/api`. On the first load, it initializes data from JSON files (`leads.json`, `opportunities.json`) into the browser's `localStorage`. All subsequent reads and writes (create, update) interact with `localStorage`, simulating a persistent backend and providing a consistent experience across page reloads. API calls are wrapped in Promises with a random delay to simulate network latency.

### Reusable Table Component

The core of the UI is the generic `Table` component (`src/components/Table.tsx`). This component is designed to be highly reusable and encapsulates the logic for:

-   Data fetching
-   Filtering
-   Sorting
-   Pagination
-   Loading and empty states
-   Rendering a slide-over panel for detail views

Both `LeadTable.tsx` and `OpportunityTable.tsx` are thin wrappers around this generic `Table` component, providing specific configurations, row renderers, and table headers.
