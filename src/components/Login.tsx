import { useState, useContext } from "react";
import { TextField, Button, Typography, Container, Grid, Box, Paper, Hidden } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { Context } from "../app/App";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { NavLink } from 'react-router-dom';


const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const AuthForm = ({ isLogin }: { isLogin: boolean }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [errorMessage, setErrorMessage] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [displayNameError, setDisplayNameError] = useState<string | null>(null)
    const { auth } = useContext(Context);

    const MAX_FILE_SIZE_BYTES = 1024;

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Проверяем размер файла
            if (file.size > MAX_FILE_SIZE_BYTES) {
                setErrorMessage("Превышен максимальный размер файла (1 KB)");
                e.target.value = '';
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {

                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setEmailError(null);
        setPasswordError(null);

        if (!isLogin && !displayName) {
            setDisplayNameError("Пожалуйста, введите имя.");
            return;
        }

        if (!email) {
            setEmailError("Пожалуйста, введите адрес электронной почты.");
            return;
        }

        if (!email.includes("@")) {
            setEmailError("Пожалуйста, введите корректный адрес электронной почты.");
            return;
        }

        if (!password) {
            setPasswordError("Пожалуйста, введите пароль.");
            return;
        }

        if (password.length < 6) {
            setPasswordError("Пожалуйста, введите пароль длиной не менее 6 символов.");
            return;
        }

        setEmailError(null);
        setPasswordError(null);

        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
                localStorage.setItem('isAuth', 'true');
                navigate('/chat');
            } else {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await updateProfile(userCredential.user, {
                    displayName: displayName,
                    photoURL: image
                });
                localStorage.setItem('isAuth', 'true');
                navigate('/chat');
            }

        } catch (error) {
            console.error(error);
            if (isLogin) {
                setEmailError('Ошибка входа. Пожалуйста, попробуйте еще раз.');
                setPasswordError('');
            } else {
                setEmailError('Ошибка регистрации. Пожалуйста, попробуйте еще раз.');
                setPasswordError('');
            }
        }
    };


    return (
        <Container maxWidth="lg" style={{ marginTop: "10rem" }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Box p={2}>
                        <Hidden mdDown>
                            <img
                                src="/login.png"
                                alt="Login Image"
                                style={{ width: "100%", height: "auto" }}
                            />
                        </Hidden>
                    </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Box p={3} boxShadow={3} component={Paper}>
                        <Typography variant="h4" align="center" gutterBottom>
                            {isLogin ? 'Вход' : 'Регистрация'}
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            {!isLogin && (
                                <TextField
                                    label="Имя пользователя"
                                    fullWidth
                                    variant="outlined"
                                    margin="normal"
                                    value={displayName}
                                    error={Boolean(displayNameError)}
                                    helperText={displayNameError}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                />
                            )}
                            <TextField
                                label="Email"
                                type="email"
                                fullWidth
                                variant="outlined"
                                margin="normal"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                error={Boolean(emailError)}
                                helperText={emailError}
                            />
                            <TextField
                                label="Пароль"
                                type="password"
                                fullWidth
                                variant="outlined"
                                margin="normal"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                error={Boolean(passwordError)}
                                helperText={passwordError}
                            />
                            {!isLogin && (
                                <Box sx={{width: '100%', display: "flex", alignItems: "center", justifyContent: "center", marginTop: "5px" }}>
                                    <Button
                                        component="label"
                                        role={undefined}
                                        variant="contained"
                                        tabIndex={-1}
                                        startIcon={<CloudUploadIcon />}
                                        sx={{ display: "flex", alignItems: "center" }}
                                    >
                                        Загрузить аватарку
                                        <VisuallyHiddenInput type="file" onChange={handleImageChange} />
                                    </Button>
                                    {errorMessage && <Typography variant="caption" color="error">{errorMessage}</Typography>}
                                </Box>
                            )}
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                size="large"
                                style={{ marginTop: "1rem" }}
                            >
                                {isLogin ? 'Войти' : 'Зарегистрироваться'}
                            </Button>
                            {!isLogin ? (
                                <Typography variant="body2" align="center" style={{ marginTop: "1rem" }}>
                                    Уже есть аккаунт? <NavLink to="/login">Войти</NavLink>
                                </Typography>
                            ) : (
                                <Typography variant="body2" align="center" style={{ marginTop: "1rem" }}>
                                    Ещё нет аккаунта? <NavLink to="/register">Зарегистрироваться</NavLink>
                                </Typography>
                            )}
                        </form>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
};

export default AuthForm;
