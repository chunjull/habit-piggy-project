import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Savings from "./pages/Savings";
import Rank from "./pages/Rank";
import Posts from "./pages/Posts";
import Member from "./pages/Member";
import Error from "./pages/Error";
import Layout from "./Layout/Layout";
import { AuthProvider } from "./utils/AuthContext";
import PrivateRoute from "./utils/PrivateRoute";

function App() {
  return (
    <AuthProvider>
      {/* <AchievementProvider> */}
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route
              path="/home"
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
