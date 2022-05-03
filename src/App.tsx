import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';

import Router from './routes/Router';

import { useAppDispatch } from './store/store';
import { loginUserByToken } from './store/authSlice';

import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (localStorage.getItem('token')) dispatch(loginUserByToken());
  }, [dispatch]);

  return (
    <>
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
    </>
  );
};

export default App;
