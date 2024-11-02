import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Layout from "./Layout/Layout";
import Error from "./pages/Error";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Member from "./pages/Member";
import Posts from "./pages/Posts";
import Rank from "./pages/Rank";
import Savings from "./pages/Savings";
import { AuthProvider } from "./utils/AuthContext";
import PrivateRoute from "./utils/PrivateRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route
              path="/Home"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route
              path="/savings"
              element={
                <PrivateRoute>
                  <Savings />
                </PrivateRoute>
              }
            />
            <Route
              path="/rank"
              element={
                <PrivateRoute>
                  <Rank />
                </PrivateRoute>
              }
            />
            <Route
              path="/posts"
              element={
                <PrivateRoute>
                  <Posts />
                </PrivateRoute>
              }
            />
            <Route
              path="/member"
              element={
                <PrivateRoute>
                  <Member />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Error />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
