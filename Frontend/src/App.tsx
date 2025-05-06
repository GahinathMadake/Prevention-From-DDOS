import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

// Authentication 
import LandigPage from "./pages/LandigPage"
import AuthenticateLayout from "./pages/Auth/AuthLayout"
import Login from "./pages/Auth/Login"
import Register from "./pages/Auth/Register"
import ForgotPassword from "./pages/Auth/ForgotPassword"
import NotFound from "./pages/NotFound"
import ContactForm from "./pages/ContactForm"




function App() {
  

  return (
    <>
      <Router>
        <Routes>
          <Route index element={<LandigPage />} />
          <Route path="/login" element={<AuthenticateLayout><Login /></AuthenticateLayout>} />
          <Route path="/register" element={<AuthenticateLayout><Register /></AuthenticateLayout>} />
          <Route path="/login/forgotPassword" element={<AuthenticateLayout><ForgotPassword /></AuthenticateLayout>} />

          <Route path="/demo" element={<ContactForm />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
