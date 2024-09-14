import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Savings from "./pages/Savings";
import Rank from "./pages/Rank";
import Posts from "./pages/Posts";
import Member from "./pages/Member";
import Error from "./pages/Error";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/savings" element={<Savings />} />
        <Route path="/rank" element={<Rank />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/member" element={<Member />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </Router>
  );
}

export default App;
