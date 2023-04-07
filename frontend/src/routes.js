import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SignUp from './pages/auth/SignUp';
import ApplyAsSeller from './pages/seller/ApplyAsSeller';
import Login from './pages/auth/Login';
import Layout from './layouts/layout';
import Home from './pages/home';
import LandingPage from './pages/landing';
import SearchFilter from './pages/product/SearchFilter';
import Overview from './pages/product/Overview';
import { ShoppingCart } from './pages/cart';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/" element={<Layout><LandingPage /></Layout>} />
            <Route path="/applyforseller" element={<Layout><ApplyAsSeller /></Layout>} />
            <Route path="/shop" element={<Layout><Home /></Layout>} />
            <Route path="/search" element={<Layout><SearchFilter /></Layout>} />
            <Route path="/product" element={<Layout><Overview /></Layout>} />
            <Route path="/cart" element={<Layout><ShoppingCart /></Layout>} />
        </Routes>
    );
};

export default AppRoutes;
