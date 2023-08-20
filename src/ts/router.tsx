import { ROUTE_PATH } from '@/constants/constant';
import LoginPage from '@/pages-auth/LoginPage';
import NotFoundPage from '@/pages/404';
import HomePage from '@/pages/Home';
import Introduce from '@/pages/Introduce';
import ListPrice from '@/pages/ListPrice';
import Training from '@/pages/Training';
import ProductPage from '@/pages-auth/ProductPage';
import SchedulePage from '@/pages-auth/SchedulePage';
import UserPage from '@/pages-auth/UserPage';
import DefaultPage from '@/pages-auth/DefaultPage';
import { createBrowserRouter, RouteObject } from 'react-router-dom';
import { PrivateAdmin, PrivateRouteLogin } from '@/private/private_router';

const router: RouteObject[] = [
  { path: ROUTE_PATH.index, element: <HomePage /> },
  { path: ROUTE_PATH.introduce, element: <Introduce /> },
  { path: ROUTE_PATH.listprice, element: <ListPrice /> },
  { path: ROUTE_PATH.training, element: <Training /> },
  {
    path: ROUTE_PATH.login,
    element: (
      <PrivateRouteLogin>
        <LoginPage />
      </PrivateRouteLogin>
    ),
  },
  {
    path: ROUTE_PATH.dashboard,
    element: (
      <PrivateAdmin>
        <DefaultPage />
      </PrivateAdmin>
    ),
  },

  {
    path: ROUTE_PATH.product,
    element: (
      <PrivateAdmin>
        <ProductPage />
      </PrivateAdmin>
    ),
  },
  {
    path: ROUTE_PATH.schedule,
    element: (
      <PrivateAdmin>
        <SchedulePage />
      </PrivateAdmin>
    ),
  },
  {
    path: ROUTE_PATH.user,
    element: (
      <PrivateAdmin>
        <UserPage />
      </PrivateAdmin>
    ),
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

// myRouter use provider
export const myRouter = createBrowserRouter(router);

// go to next router global
export const goTo = myRouter.navigate;
