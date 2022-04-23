import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { IconButton } from '@mui/material';
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
      <IconButton onClick={handleLogout}>
        <ExitToAppIcon fontSize="large" />
      </IconButton>
    </div>
  );
};

export default Header;
