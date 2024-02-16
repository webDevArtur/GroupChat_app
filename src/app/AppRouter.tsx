import { Routes, Route } from "react-router-dom";
import { Outlet } from "react-router-dom";
import Layout from "../components/Layout";
import RequireAuth from "../processes/RequireAuth";
import LoginPage from "../pages/LoginPage";
import ChatPage from "../pages/ChatPage";
import Page404 from "../assets/Page404";
import RegisterPage from "../pages/RegisterPage";
import { Navigate } from "react-router-dom";
const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={
                <RequireAuth>
                    <Layout>
                        <Outlet/>
                    </Layout>
                </RequireAuth>
            }>
                <Route path="/chat" element={<ChatPage />} />
            </Route>
            <Route path="*" element={<Page404 />} />
        </Routes>
    );
};

export default AppRouter;