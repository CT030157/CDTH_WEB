import React, { Suspense } from 'react';
import { Route, Switch } from "react-router-dom";
import Auth from "../hoc/auth";
import LandingPage from "./views/LandingPage/LandingPage.js";
import LoginPage from "./views/LoginPage/LoginPage.js";
import RegisterPage from "./views/RegisterPage/RegisterPage.js";
import NavBar from "./views/NavBar/NavBar";
import Footer from "./views/Footer/Footer";
import ShopPage from './views/ShopPage/ShopPage';
import UploadProductPage from './views/UploadProductPage/UploadProductPage';
import DetailProductPage from './views/DetailProductPage/DetailProductPage';
import CartPage from './views/CartPage/CartPage';
import HistoryPage from './views/HistoryPage/HistoryPage';
import SoldHistoryPage from './views/SoldHistoryPage/SoldHistoryPage';
import PendingPage from './views/PendingPage/PendingPage.js';
import AdminDashboardPage from './views/AdminPage/AdminDashboardPage.js';
import AdminUserPage from './views/AdminPage/AdminUserPage.js';
import AdminProductPage from './views/AdminPage/AdminProductPage.js';
import AdminPaymentPage from './views/AdminPage/AdminPaymentPage.js';

function App() {
  return (
    <Suspense fallback={(<div>Loading...</div>)}>
      <NavBar />
      <div style={{ paddingTop: '70px', minHeight: 'calc(100vh - 80px)' }}>
        <Switch>
          <Route exact path="/" component={Auth(LandingPage, null)} />
          <Route exact path="/login" component={Auth(LoginPage, false)} />
          <Route exact path="/register" component={Auth(RegisterPage, false)} />
          <Route exact path="/shop" component={Auth(ShopPage, true)} />
          <Route exact path="/sold" component={Auth(SoldHistoryPage, true)} />
          <Route exact path="/product/upload" component={Auth(UploadProductPage, true)} />
          <Route exact path="/product/:productId" component={Auth(DetailProductPage, null)} />
          <Route exact path="/user/cart" component={Auth(CartPage, true)} />
          <Route exact path="/history" component={Auth(HistoryPage, true)} />
          <Route exact path="/pending" component={Auth(PendingPage, true)} />
          <Route exact path="/dashboard" component={Auth(AdminDashboardPage, true, true)} />
          <Route exact path="/admin/users" component={Auth(AdminUserPage, true, true)} />
          <Route exact path="/admin/products" component={Auth(AdminProductPage, true, true)} />
          <Route exact path="/admin/payments" component={Auth(AdminPaymentPage, true, true)} />
          <Route exact path="/admin/product/:productId" component={Auth(DetailProductPage, null, true)} />
        </Switch>
      </div>
      <Footer />
    </Suspense>
  );
}

export default App;
