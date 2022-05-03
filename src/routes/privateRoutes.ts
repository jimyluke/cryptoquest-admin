import { FC } from 'react';

import ROUTES from './routes';

import Home from '../pages/home/Home';
import TokenNames from '../pages/token-names/TokenNames';
import TokenName from '../pages/token-name/TokenName';

interface Route {
  path: ROUTES.HOME_PAGE | ROUTES.TOKEN_NAMES_PAGE | ROUTES.TOKEN_NAME_PAGE;
  element: FC;
}

const privateRoutes: Route[] = [
  { path: ROUTES.HOME_PAGE, element: Home },
  { path: ROUTES.TOKEN_NAMES_PAGE, element: TokenNames },
  { path: ROUTES.TOKEN_NAME_PAGE, element: TokenName },
];

export default privateRoutes;
