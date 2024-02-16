import {FC, PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";

const RequireAuth: FC<PropsWithChildren> = ({ children }) => {
    const isAuth = localStorage.getItem('isAuth');

    if (!isAuth) {
        return <Navigate to="/login" />;
    }

    return (
        <div>
            { children }
        </div>
    );
};

export default RequireAuth;