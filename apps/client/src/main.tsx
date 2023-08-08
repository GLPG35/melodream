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
import NotFound from './pages/NotFound'
import Categories from './pages/Categories'
import AddCategory from './pages/Dashboard/AddCategory'
import Buy from './pages/Cart/Buy'
import Payment from './pages/Payment'
import SuccessPayment from './pages/Payment/Success'
import Orders from './pages/Orders'
import Order from './pages/Orders/Order'
import RecoverPass from './pages/Login/Recover'
import ResetPass from './pages/Login/Reset'
import Superstar from './pages/Superstar'
import Docs from './pages/Docs'
import DocsHome from './pages/Docs/Home'
import Profile from './pages/Profile'
import Documentation from './pages/Dashboard/Documentation'
import DeleteUsers from './pages/Dashboard/DeleteUsers'
import UpdateUser from './pages/Dashboard/UpdateUser'

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
        path: '/categories/:cid',
        element: <Categories />
      },
      {
        path: '/cart',
        element: <Cart />
      },
      {
        path: '/cart/buy',
        element: <Buy />
      },
      {
        path: '/payment',
        element: <Payment />,
        children: [
          {
            index: true,
            element: <NotFound />
          },
          {
            path: 'success',
            element: <SuccessPayment />
          }
        ]
      },
      {
        path: '/orders',
        element: <Orders />
      },
      {
        path: '/orders/:oid',
        element: <Order />
      },
      {
        path: '/profile',
        element: <Profile />
      },
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/login/recover',
        element: <RecoverPass />
      },
      {
        path: '/login/reset',
        element: <ResetPass />
      },
      {
        path: '/superstar',
        element: <Superstar />
      },
      {
        path: '/dashboard',
        element: <Dashboard />,
        children: [
          {
            index: true,
            element: <AddProduct />
          },
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
            path: 'addCategory',
            element: <AddCategory />
          },
          {
            path: 'addUser',
            element: <AddUser />
          },
          {
            path: 'updateUser',
            element: <UpdateUser />
          },
          {
            path: 'deleteUsers',
            element: <DeleteUsers />
          },
          {
            path: 'documentation',
            element: <Documentation />
          }
        ]
      },
      {
        path: '/docs',
        element: <Docs />,
        children: [
          {
            index: true,
            element: <DocsHome />
          }
        ]
      },
      {
        path: '*',
        element: <NotFound />
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
