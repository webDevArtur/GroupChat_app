import { AppBar, Box, Toolbar, Typography, Button, Avatar, useMediaQuery } from '@mui/material';
import TelegramIcon from '@mui/icons-material/Telegram';
import { useNavigate } from 'react-router-dom';
import { signOut } from "firebase/auth";
import { useContext } from 'react';
import { Context } from '../app/App.tsx';
import { useAuthState } from "react-firebase-hooks/auth";
import LogoutIcon from '@mui/icons-material/Logout';
import { styled } from '@mui/system';

const TitleContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
        justifyContent: 'center',
    },
}));

const UserContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    marginLeft: 'auto',
    [theme.breakpoints.down('sm')]: {
        display: 'none',
    },
}));

const LogoutButton = styled(Button)(({ theme }) => ({
    marginLeft: 'auto',
    [theme.breakpoints.down('sm')]: {
        marginLeft: 'unset',
    },
}));

const Header = () => {
    const navigate = useNavigate();
    const { auth } = useContext(Context);
    const [user] = useAuthState(auth);
    const isMobile = useMediaQuery('(max-width:600px)');

    const Logout = async () => {
        await signOut(auth);
        localStorage.removeItem('isAuth');
        navigate('/login')
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <TitleContainer>
                        <TelegramIcon fontSize='small' />
                        <Typography variant="h5" sx={{ padding: '5px', fontWeight: 'bold' }} >SocialNet</Typography>
                    </TitleContainer>
                    {!isMobile && (
                        <UserContainer>
                            {user?.photoURL ? (
                                <Avatar alt={user.displayName || undefined} src={user.photoURL} sx={{ marginRight: 1 }} />
                            ) : (
                                <Avatar alt={user?.displayName?.charAt(0) || undefined} sx={{ marginRight: 1 }} />
                            )}
                            <Typography variant="h6" sx={{ paddingLeft: 1, paddingRight: 2 }}>{user?.displayName}</Typography>
                            <LogoutButton variant="contained" color="error" onClick={() => Logout()} endIcon={<LogoutIcon />}>Выйти</LogoutButton>
                        </UserContainer>
                    )}
                    {isMobile && (
                        <Button variant="contained" color="error" sx={{ marginLeft: 'auto' }} onClick={() => Logout()} endIcon={<LogoutIcon/>}>Выйти</Button>
                    )}
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default Header;
