# Front-End for CRUD Blog (Next.js + Tailwind + shadcn/ui)

This is the front-end application for a simple blog system. It interfaces with a Laravel back-end (CRUD Blog API) via REST endpoints. The application allows users to register, log in, create/edit/delete posts, and create/edit/delete comments, all with JWT authentication and RBAC.

## Features

- **Next.js 13+** (App Router or Pages Router, depending on your structure)  
- **Tailwind CSS** for styling  
- **shadcn/ui** components for a consistent UI design  
- **JWT Authentication** (communicates with the Laravel API)  
- **Create, Update, Delete, and View Posts**  
- **Create, Update, Delete, and View Comments**  
- **Toast notifications** with [Sonner](https://github.com/emilkowalski/sonner)

## Prerequisites

- **Node.js** >= 16  
- **npm** or **yarn**  
- A running **back-end** (Laravel API) providing routes for registration, login, posts, and comments.

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/manuelamonteiro/CrudBlog---Front.git
   ```
2. **Navigate to the project folder**:
   ```bash
   cd front_crud_blog
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
   or
   ```bash
   yarn
   ```
4. **Configure environment variables** in `.env.local`:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   ```
   - This URL points to your Laravel back-end’s API routes.
   - Adjust according to the actual port/URL your back-end runs on.

5. **Run the development server**:
   ```bash
   npm run dev
   ```
   or
   ```bash
   yarn dev
   ```
   The app will be available at **http://localhost:3000** by default.

## Usage

1. **Registration**: Access `/register` to sign up a new user.  
2. **Login**: Access `/login` to authenticate. A JWT token is stored (e.g., in localStorage).  
3. **Creating Posts**: On the `/posts` page, click "Create Post" to add a new post (requires being logged in).  
4. **Editing/Deleting Posts**: Only the post owner can edit or delete.  
5. **Comments**: Toggle a post’s comments and create/edit/delete them if you’re the comment owner.  

### Environment Variables

- **`NEXT_PUBLIC_API_URL`** (Required)  
  Points to your Laravel back-end API base URL (e.g., `http://localhost:8000/api`).  
  - The front-end uses this to make requests like `POST /login` or `GET /posts`.

## Scripts

- **`npm run dev`**: Starts the development server.  
- **`npm run build`**: Builds the production-ready app.  
- **`npm run start`**: Runs the built app in production mode.  
- **`npm run lint`**: Lints your code with ESLint.

## Authentication Flow

1. **User logs in** at `/login`.  
2. The server returns a **JWT** token.  
3. The front-end saves the token (usually in `localStorage`).  
4. For protected routes (creating/editing/deleting posts/comments), the token is included in the `Authorization` header as `Bearer <token>`.  

## Styling & Components

- **Tailwind CSS**: The site layout and styling are primarily done via utility classes.  
- **shadcn/ui**: Prebuilt components (Button, Dialog, DropdownMenu, etc.) for a consistent design system.  
- **Custom Scrollbars**: You can style scrollbars globally in `globals.css` or using the shadcn `ScrollArea` subcomponents.

## Known Issues or Limitations

- Ensure the back-end properly returns **JSON** for all requests (including errors). If you see an HTML `<!DOCTYPE html>` error, your request might be unauthorized or misconfigured.  
- JWT tokens should be handled securely (e.g., expiry checks, refresh tokens, etc., if needed).

## Contributing

1. **Fork** the repository.  
2. **Create** a new feature branch: `git checkout -b feature/my-new-feature`.  
3. **Commit** changes: `git commit -m "feat: implement X"`.  
4. **Push** to the branch: `git push origin feature/my-new-feature`.  
5. **Create** a Pull Request.

## License

This project is licensed under the [MIT License](LICENSE).