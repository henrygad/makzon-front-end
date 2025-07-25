# Makzon – Social Blogging Web App (Frontend)

Makzon is a modern **social blogging platform** built for creators across any field. With Makzon, authors can write, edit, draft, and publish rich blog content using a custom editor, while readers can follow authors, like and comment on posts, and explore trending topics.

This is the **frontend** part of the application, built with **React**, **TypeScript**, **TailwindCSS**, and powered by **MakzonTextEditor**. It communicates with the Makzon backend via secure, cookie-based authentication.

---

## ✨ Features

### 👤 Author Features
- Create, edit, re-edit, draft, publish, unpublish, and delete blog posts
- Manage uploaded media (images, videos)
- Preview unpublished and drafted content
- Use the built-in `MakzonTextEditor` for rich content creation

### 🌍 Social Features
- Follow and unfollow authors
- Like, unlike, and comment on posts
- Like and reply to comments
- Share and view posts
- Personalized feed from followed authors

### 📄 Pages Overview
- **Landing / Trending Page**: View trending posts
- **Feed Page**: See posts from authors you follow
- **Add Post Page**: Contains sub-tabs for media, drafts, and editor
- **Search Result Page**: Search and explore authors/posts
- **Profile Page**: Displays author's info and list of their posts
- **Edit Profile Page**: Update your name, bio, link, image, and more
- **Notification Page**
- **Settings & Security Pages**
- **Authentication**: Login/Signup via Email or Google

### 🔐 Authentication
- Cookie-based auth with auto-expiration (24 hours)
- Logout and delete account (password confirmation required)

---

## 📁 Folder Structure

```
src/
├── assets/                  # Static images & icons
├── components/              # Reusable UI components
├── config/                  # App configuration
├── constants/               # Static constants
├── hooks/                   # Custom React hooks
├── layout/                  # Layout components (e.g., sidebar, header)
├── loaders/                 # Loaders/skeletons for UI
├── pages/                   # Full page components (feed, profile, etc.)
├── redux/                   # Redux setup and slices
├── routes/                  # Application routes
├── sections/               # Page sections (smaller UI blocks)
├── subpages/                # Nested pages like settings, edit profile
├── types/                   # TypeScript types
├── validators/              # Form validations using yup
├── App.tsx
├── main.tsx
└── index.css
```

---

## 🧰 Technologies Used

- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **Redux Toolkit**
- **React Router DOM**
- **React Hook Form + Yup**
- **Axios**
- **TanStack React Query**
- **MakzonTextEditor**
- **JS-Cookie** for cookie handling
- **Dompurify + HE** for HTML sanitization
- **Google Auth Integration**

---

## 🚀 Getting Started

### 1. Clone the Repo
```bash
git clone https://github.com/henrygad/makzon-front-end.git
cd makzon-frontend
```

### 2. Install Dependencies
```bash
yarn install
```

### 3. Start Development Server
```bash
yarn dev
```

### 4. Build for Production
```bash
yarn build
```

---

## ✅ Scripts

| Command       | Description                        |
|---------------|------------------------------------|
| `yarn dev`    | Start the Vite development server  |
| `yarn build`  | Build the app for production       |
| `yarn preview`| Preview the production build       |
| `yarn test`   | Run Vitest tests                   |
| `yarn lint`   | Run ESLint to check code quality   |

---

## ⚠️ Notes

- Ensure your **backend server** is running and allows cross-origin cookies.
- This app assumes cookies are **HttpOnly** and expire in 24 hours.
- The app uses **React Query** for background data fetching and caching.
- Form validation uses **Yup** with `react-hook-form`.

---

## 📸 Demo & Screenshots

_(You can add screenshots or gifs here)_

---

## 🧪 Testing

This project uses:
- **Vitest** for unit testing
- **React Testing Library** for component tests

```bash
yarn test
```

---

## 👤 Author Profile

- 👨‍💻 Built by: Henry Orji
- 💼 Profession: Fullstack Dev
- 📫 Email: henrygad.orji@gmail.com

---

## 🪄 Disclaimer

This project was built for learning and experimentation purposes. It is not intended for commercial deployment.

---

## 📜 License

MIT License
