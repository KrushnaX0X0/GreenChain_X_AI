import React, { useEffect, useState } from 'react'
import 'remixicon/fonts/remixicon.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './view/Home'
import Loding from './components/Loding'
import Shop from './view/Shop'
import Login from './view/Login'
import Signup from './view/Signup'
import Dashboard from './view/Dashbord'
import CheckoutForm from './components/Payment/CheckoutForm'
// import Payment from './components/Payment/Payment'
import Cart from './components/Cart'
import OrderDetails from './components/OrderDetails'
import Bill from './components/Payment/Bill'
import Service from './view/Service'
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserDashboard from './view/UserDashboard'
import OAuthSuccess from './view/OAuthSuccess'
import ProtectedRoute from './components/ProtectedRoute'



const App = () => {

  const [loding, setloding] = useState(true);

  const loading = async () => {
    setloding(false)
  }

  useEffect(() => {
    setTimeout(() => {
      loading()
    }, 4000);
  }, []);
  return (
    <BrowserRouter>
      {loding ? (
        <Loding />
      ) : (
        <>

          <ToastContainer
            position="top-right"
            autoClose={3000}
            newestOnTop
            closeOnClick
            pauseOnHover
            style={{
              marginTop: "5px",   // 🔽 push below navbar
              zIndex: 999999       // 🔥 must be very high
            }}
            toastStyle={{
              zIndex: 999999
            }}
          />


          <Toaster
            position="top-right"
            containerStyle={{
              zIndex: 99999,
            }}
            toastOptions={{
              style: {
                borderRadius: "12px",
                background: "#16a34a",
                color: "#fff",
              },
            }}
          />



          <Routes>

            <Route path="/" element={<Home />} />
            <Route path='/shop' element={<Shop />} />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route
              path='/dashbord'
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path='/checkout' element={<CheckoutForm />} />
            {/* <Route path='/payment' element={<Payment/>}/> */}
            <Route path='/cart' element={<Cart />} />
            <Route path='/order' element={<OrderDetails />} />
            <Route path="/bill" element={<Bill />} />
            <Route path="/services" element={<Service />} />
            <Route
              path='/userdashbord'
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/oauth-success" element={<OAuthSuccess />} />




          </Routes>
        </>
      )}
    </BrowserRouter>
  )
}

export default App