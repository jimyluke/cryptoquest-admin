import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import BadgeIcon from '@mui/icons-material/Badge';
import CachedIcon from '@mui/icons-material/Cached';
import { IconButton, Container } from '@mui/material';
import { Link } from 'react-router-dom';

import ROUTES from '../../routes/routes';
import { logoutCurrentUser } from '../../store/authSlice';
import { useAppDispatch } from '../../store/store';
import { LOCAL_STORAGE_TOKEN } from '../../variables/global';

const Header = () => {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logoutCurrentUser());
    localStorage.removeItem(LOCAL_STORAGE_TOKEN);
  };

  return (
    <div className="header">
      <Container>
        <div className="header__container">
          <nav className="header-nav">
            <ul className="header-nav__list">
              <li className="header-nav__item">
                <Link className="header-nav__link" to={ROUTES.TOKEN_NAMES_PAGE}>
                  <BadgeIcon style={{ color: 'white' }} fontSize="large" />{' '}
                  Token Names
                </Link>
              </li>
              <li className="header-nav__item">
                <Link className="header-nav__link" to={ROUTES.UPDATE_NFT_PAGE}>
                  <CachedIcon style={{ color: 'white' }} fontSize="large" />{' '}
                  Update NFT
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
