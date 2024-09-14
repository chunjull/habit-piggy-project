import { Link } from "react-router-dom";

import PropTypes from "prop-types";

function Layout({ children }) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <nav className="fixed inset-x-0 bottom-0 md:static md:w-1/4 pt-2 pb-3 px-4 border bg-white z-10">
        <ul className="flex gap-14 md:flex-col">
          <li>
            <Link to="/">Habit Piggy</Link>
          </li>
          <li>
            <Link to="/home">Home</Link>
          </li>
          <li>
            <Link to="/savings">Savings</Link>
          </li>
          <li>
            <Link to="/rank">Rank</Link>
          </li>
          <li>
            <Link to="/posts">Posts</Link>
          </li>
          <li>
            <Link to="/member">Member</Link>
          </li>
        </ul>
      </nav>
      <div className="flex-1 mt-16 md:mt-0 p-4">{children}</div>
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node,
};

export default Layout;
