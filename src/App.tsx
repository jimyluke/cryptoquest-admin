import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import Container from '@mui/material/Container';

import 'react-toastify/dist/ReactToastify.css';
import Router from './routes/Router';
import { useAppDispatch } from './store/store';
import { loginUserByToken } from './store/authSlice';

const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (localStorage.getItem('token')) dispatch(loginUserByToken(null));
  }, [dispatch]);

  return (
    <Container>
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="dark"
      />
      <Router />
    </Container>
  );
};

export default App;
