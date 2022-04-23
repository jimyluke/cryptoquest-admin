import { FC } from 'react';

import ROUTES from './routes';

import Home from '../pages/home/Home';

interface Route {
  path: ROUTES.HOME_PAGE;
  element: FC;
}

const privateRoutes: Route[] = [{ path: ROUTES.HOME_PAGE, element: Home }];

export default privateRoutes;
