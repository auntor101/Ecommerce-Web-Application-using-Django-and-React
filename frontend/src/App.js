import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import axios from 'axios'
import 'react-toastify/dist/ReactToastify.css'
import ProductListPage from './pages/ProductsListPage'
import ProductDetailsPage from './pages/ProductDetailsPage'
import CheckoutPage from './pages/CheckoutPage'
import NavBar from './components/Navbar'
import PaymentStatus from './components/PaymentStatus'
import Login from './pages/LoginPage'
import Register from './pages/RegisterPage'
import AccountPage from './pages/AccountPage'
import AccountUpdatePage from './pages/AccountUpdatePage'
import DeleteUserAccountPage from './pages/DeleteUserAccountPage'
import AllAddressesOfUserPage from './pages/AllAddressesOfUserPage'
import AddressUpdatePage from './pages/AddressUpdatePage'
import OrdersListPage from './pages/OrdersListPage'
import ProductCreatePage from './pages/ProductCreatePage'
import ProductUpdatePage from './pages/ProductUpdatePage'
import SiteSettingsPage from './pages/SiteSettingsPage'
import NotFound from './pages/NotFoundPage'
import PasswordResetPage from './pages/PasswordResetPage'
import PasswordResetConfirmPage from './pages/PasswordResetConfirmPage'
// Import payment pages
import PaymentMethodSelection from './pages/PaymentMethodSelection'
import BkashPaymentPage from './pages/BkashPaymentPage'
import CardPaymentPage from './pages/CardPaymentPage'
// Import cart drawer
import CartDrawer from './components/CartDrawer'
import Footer from './components/Footer'
import { defaultSiteSettings } from './utils/defaultSiteSettings'
import { isFrontendOnlyMode } from './utils/appMode'

const App = () => {
  const [siteSettings, setSiteSettings] = useState(defaultSiteSettings)

  useEffect(() => {
    let isMounted = true

    if (isFrontendOnlyMode) {
      return undefined
    }

    axios.get('/api/site-settings/')
      .then(({ data }) => {
        if (isMounted) {
          setSiteSettings((current) => ({ ...current, ...data }))
        }
      })
      .catch(() => {
        // Keep default branding when the API is unavailable.
      })

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div>
      <Router>
        <NavBar siteSettings={siteSettings} />
        <CartDrawer />
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="main-content">
          <Switch>
            <Route path="/" render={(props) => <ProductListPage {...props} siteSettings={siteSettings} />} exact />
            <Route path="/new-product/" component={ProductCreatePage} exact />
            <Route path="/product/:id/" component={ProductDetailsPage} exact />
            <Route path="/product-update/:id/" component={ProductUpdatePage} exact />
            <Route path="/product/:id/checkout/" component={CheckoutPage} exact />
            <Route path="/payment-status" component={PaymentStatus} exact />
            {/* Payment routes */}
            <Route path="/payment-method" component={PaymentMethodSelection} exact />
            <Route path="/payment/bkash" component={BkashPaymentPage} exact />
            <Route path="/payment/:type" component={CardPaymentPage} exact />
            {/* Auth routes */}
            <Route path="/login" component={Login} exact />
            <Route path="/register" component={Register} exact />
            <Route path="/password-reset" component={PasswordResetPage} exact />
            <Route path="/password-reset/:uid/:token" component={PasswordResetConfirmPage} exact />
            <Route path="/account" component={AccountPage} exact />
            <Route path="/account/update/" component={AccountUpdatePage} exact />
            <Route path="/account/delete/" component={DeleteUserAccountPage} exact />
            <Route path="/all-addresses/" component={AllAddressesOfUserPage} exact />
            <Route path="/all-addresses/:id/" component={AddressUpdatePage} exact />
            <Route path="/all-orders/" component={OrdersListPage} exact />
            <Route path="/admin/site-settings/" component={SiteSettingsPage} exact />
            <Route path="*" component={NotFound} />
          </Switch>
        </div>
        <Footer siteSettings={siteSettings} />
      </Router>
    </div >
  )
}

export default App