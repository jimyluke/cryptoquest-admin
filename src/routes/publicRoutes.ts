import { FC } from 'react';

import ROUTES from './routes';

import SignIn from '../pages/auth/SignIn';
import PageNotFound from '../pages/page-not-found/PageNotFound';

interface Route {
  path: ROUTES.SIGN_IN_PAGE | ROUTES.PAGE_NOT_FOUND;
  element: FC;
}

const publicRoutes: Route[] = [
  { path: ROUTES.SIGN_IN_PAGE, element: SignIn },
  { path: ROUTES.PAGE_NOT_FOUND, element: PageNotFound },
];

export default publicRoutes;
