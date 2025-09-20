# Library Management System

A modern web application built with Angular Material for managing books and their categories. The system provides a clean interface for performing CRUD operations on books and categories with features like pagination.

## Author: **Mohammad Alfayoume**

## Time Estimation: One Day

## Actual Time: One Day

## Challenges faced
* Switch between GitHub accounts

## AI Tools:
* ChatGPT 4o
* Copilot Claude Sonnet 3.5

## Prompt
```
You are an expert Angular developer.
Generate code for a library management system with the following specifications:

Pages

Books Page

List of books with Angular Material table.

Pagination included.

Each book has: id, name, and categories.

CRUD operations.

For Create and Update, open a modal (Angular Material Dialog) with a form:

name (text field).

categories (multi-select dropdown populated from Categories).

Categories Page

List of categories with Angular Material table.

Pagination included.

Each category has: id, name.

CRUD operations.

For Create and Update, open a modal with a form:

name (text field).

DTOs

For each entity (Book, Category) generate:

Create DTO.

Update DTO.

Brief DTO (for list view).

Services

Generate Angular services that handle HTTP communication with backend (/api/books and /api/categories).

Include methods for getAll, getById, create, update, and delete.

Routing

Add Angular routes:

/books → BooksPageComponent.

/categories → CategoriesPageComponent.

Design

Use Angular Material for table, pagination, buttons, dialogs, and form controls.

I already installed it in the application. don't install it.

Make UI clean and responsive.

📌 Output should include:

Angular components (BooksPage, CategoriesPage).

Dialog components (BookFormDialog, CategoryFormDialog).

Services.

DTO definitions.

Example routing module updates.

Example module declarations for Material imports.
```

## Features

- **Books Management**
  - View list of books with pagination
  - Create, edit, and delete books
  - Assign multiple categories to books

- **Categories Management**
  - View list of categories with pagination
  - Create, edit, and delete categories
  - View books associated with each category

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16.x or later)
- [npm](https://www.npmjs.com/) (v8.x or later)
- [Angular CLI](https://angular.io/cli) (v16.x)

## Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/mohammadalfayoume/Library-Management-System.git
   cd library-management-system
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run the Application**
   ```bash
   ng serve
   ```

4. **Access the Application**
   - Open your browser and navigate to `http://localhost:4200`
   - The application should be up and running

## Project Structure

```
src/
├── app/
│   ├── core/                 # Core functionality
│   ├── features/            
│   │   ├── books/           # Books feature module
│   │   └── categories/      # Categories feature module
│   └── shared/              # Shared components and services
├── assets/                  # Static assets
└── styles.css               # Global styles
```

## Key Components

1. **Books Module**
   - `BookListComponent`: Displays paginated list of books
   - `BookFormComponent`: Handles book creation and editing
   - `BookService`: Manages book-related API calls

2. **Categories Module**
   - `CategoryListComponent`: Shows paginated categories
   - `CategoryFormComponent`: Manages category creation/editing
   - `CategoryService`: Handles category-related operations

3. **Shared Components**
   - `LoadingSpinnerComponent`: Shows loading state
   - Error handling components
   - Reusable UI elements

## Development Guidelines

1. **Code Style**
   - Follow Angular style guide
   - Use TypeScript features appropriately
   - Maintain clean component separation

2. **State Management**
   - Utilize RxJS for state management
   - Implement proper error handling
   - Use loading indicators for async operations

