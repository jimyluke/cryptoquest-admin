import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { IconButton, Container } from '@mui/material';
import { Link } from 'react-router-dom';

import ROUTES from '../../routes/routes';
import { logoutCurrentUser } from '../../store/authSlice';
import { useAppDispatch } from '../../store/store';

const Header = () => {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logoutCurrentUser());
    localStorage.removeItem('token');
  };

  return (
    <div className="header">
      <Container>
        <div className="header__container">
          <nav className="header-nav">
            <ul className="header-nav__list">
              <li className="header-nav__item">
                <Link className="header-nav__link" to={ROUTES.TOKEN_NAMES_PAGE}>
                  Home
                </Link>
              </li>
            </ul>
          </nav>
          <IconButton onClick={handleLogout}>
            <ExitToAppIcon style={{ color: 'white' }} fontSize="large" />
          </IconButton>
        </div>
      </Container>
    </div>
  );
};

export default Header;
