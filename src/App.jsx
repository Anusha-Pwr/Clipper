import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AppLayout from "./layouts/app-layout";
import LandingPage from "./pages/LandingPage";
import DashBoard from './pages/DashBoard';
import AuthPage from './pages/AuthPage';
import LinkPage from './pages/LinkPage';
import RedirectLink from './pages/RedirectLink';

function App() {

  const router = createBrowserRouter([
    {
      element: <AppLayout />,
      children: [
        {
          path: "/",
          element: <LandingPage />
        },
        {
          path: "/dashboard",
          element: <DashBoard />
        },
        {
          path: "/auth",
          element: <AuthPage />
        },
        {
          path: "/link/:id",
          element: <LinkPage />
        },
        {
          path: "/:id",
          element: <RedirectLink />
        }
      ]
    }
  ])

  return <RouterProvider router={router} />
}

export default App;
