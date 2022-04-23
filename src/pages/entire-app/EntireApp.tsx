import { Outlet } from 'react-router-dom';

import Header from '../../components/header/Header';
import { selectAuthUser } from '../../store/authSlice';
import { useAppSelector } from '../../store/store';

const EntireApp = () => {
  const user = useAppSelector(selectAuthUser);

  return (
    <>
      {user && <Header />}
      <main className="main">
        <Outlet />
      </main>
    </>
  );
};

export default EntireApp;
