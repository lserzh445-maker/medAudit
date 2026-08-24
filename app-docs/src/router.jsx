import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom'
import useAuditStore from './store/useAuditStore.js'
import LoginScreen from './screens/LoginScreen.jsx'
import ChecklistScreen from './screens/ChecklistScreen.jsx'
import MatrixScreen from './screens/MatrixScreen.jsx'
import RegistryScreen from './screens/RegistryScreen.jsx'
import ChiefScreen from './screens/ChiefScreen.jsx'

function AuthGate() {
  const loggedIn = useAuditStore((s) => s.loggedIn)
  return loggedIn ? <Outlet /> : <Navigate to="/login" replace />
}

const router = createBrowserRouter([
  { path: '/login', element: <LoginScreen /> },
  {
    element: <AuthGate />,
    children: [
      { path: '/checklist', element: <ChecklistScreen /> },
      { path: '/matrix',    element: <MatrixScreen /> },
      { path: '/registry',  element: <RegistryScreen /> },
      { path: '/chief',     element: <ChiefScreen /> },
    ],
  },
  { path: '*', element: <Navigate to="/checklist" replace /> },
])

export default function Router() {
  return <RouterProvider router={router} />
}
