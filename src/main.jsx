import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ClerkProvider } from '@clerk/clerk-react'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Passwords from './routes/Passwords.jsx'
import { Provider } from 'react-redux'
import store from './store/store.js'
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

const router = createBrowserRouter([
  {
    path: "/",
    element:
      <App />
  },
  {
    path: "/passwords",
    element: <Passwords />
  },
]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </ClerkProvider>
  </React.StrictMode>,
)
