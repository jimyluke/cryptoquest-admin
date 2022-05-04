import { Outlet } from 'react-router-dom';
import { Container } from '@mui/material';

import Header from '../../components/header/Header';

import { selectAuthUser } from '../../store/authSlice';
import { useAppSelector } from '../../store/store';

const EntireApp = () => {
  const user = useAppSelector(selectAuthUser);

  return (
    <>
      {user && <Header />}
      <Container>
        <main className="main">
          <Outlet />
        </main>
      </Container>
    </>
  );
};

export default EntireApp;
