# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```

<!-- 
-Entry point is main.tsx, Sets up React Router, Defines all routes and their respective components. Renders everything inside <Layout> via <Outlet />.
-Layout.tsx Provides a consistent structure (e.g., header, footer).
-App.tsx is the homepage. Loads via <Outlet /> in main.tsx.  Consists of just several ui components that make up the home page.
-All other pages(e.g., Product.tsx, Cart.tsx) also load via <Outlet /> in main.tsx
-Product.tsx is SHOP, Cart.tsx is CART, Orders.tsx is ORDERS, Profile.tsx is MY ACCOUNT page
-The entire React app is injected into <div id="root"></div> inside index.html to display all content.

Back End:
-index.mjs sets up an Express.js server with dynamic route loading
-constants/index.mjs has all the constant static product info seen on homepage (highlights, categories, products, blogs)
-routes folder has a file for each of those handling the get requests from front end for that product info.
-routes folder also has checkout.mjs which handles all the stripe activity.
-index.html just displays all the backend folders at localhost 8000.
-->