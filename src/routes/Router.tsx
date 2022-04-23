import { FC } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import EntireApp from '../pages/entire-app/EntireApp';

import publicRoutes from './publicRoutes';
import privateRoutes from './privateRoutes';
import ROUTES from './routes';
import { useAppSelector } from '../store/store';
import { selectAuthUser } from '../store/authSlice';

const Router: FC = () => {
  const user = useAppSelector(selectAuthUser);

  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.ENTIRE_APP} element={<EntireApp />}>
          {publicRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                route.path === ROUTES.SIGN_IN_PAGE && user ? (
                  <Navigate to={ROUTES.HOME_PAGE} />
                ) : (
                  <route.element />
                )
              }
            />
          ))}
          {privateRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                user ? <route.element /> : <Navigate to={ROUTES.SIGN_IN_PAGE} />
              }
            />
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
