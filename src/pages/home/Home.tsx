import { Navigate } from 'react-router-dom';

import ROUTES from '../../routes/routes';

const Home = () => {
  return <Navigate to={ROUTES.TOKEN_NAMES_PAGE} />;
};

export default Home;
