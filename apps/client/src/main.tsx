import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { IconContext } from 'react-icons'
import './global.scss'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import AddProduct from './pages/Dashboard/AddProduct'
import UpdateProduct from './pages/Dashboard/UpdateProduct'
import DeleteProduct from './pages/Dashboard/DeleteProduct'
import ViewProduct from './pages/ViewProduct'
import Cart from './pages/Cart'
import AddUser from './pages/Dashboard/AddUser'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/product/:pid',
        element: <ViewProduct />
      },
      {
        path: '/cart',
        element: <Cart />
      },
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/dashboard',
        element: <Dashboard />,
        children: [
          {
            path: 'add',
            element: <AddProduct />
          },
          {
            path: 'update',
            element: <UpdateProduct />
          },
          {
            path: 'delete',
            element: <DeleteProduct />
          },
          {
            path: 'addUser',
            element: <AddUser />
          }
        ]
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <IconContext.Provider value={{ size: '1.4em', style: { verticalAlign: 'middle' } }}>
      <RouterProvider router={router} />
    </IconContext.Provider>
  </React.StrictMode>
)
