import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    const saved = localStorage.getItem("theme");

    if (saved === "dark") {
      html.classList.add("dark");
      setIsDark(true);
    } else if (saved === "light") {
      html.classList.add("light");
      setIsDark(false);
    } else {
      // default system preference
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        html.classList.add("dark");
        setIsDark(true);
      } else {
        html.classList.add("light");
        setIsDark(false);
      }
    }
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    html.classList.toggle("dark");
    html.classList.toggle("light");
    const newTheme = html.classList.contains("dark") ? "dark" : "light";
    setIsDark(newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  return (
    <ul>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/open-ticket">Open Ticket</Link>
      </li>
      <li>
        <Link to="/tickets">Tickets</Link>
      </li>
      <li>
        <Link to="/technician">Technician</Link>
      </li>
      <li>
        <Link to="/admin">Admin</Link>
      </li>
      <li>
        <Link to="/about">About</Link>
      </li>

      <button id="themeToggle" className="btn" onClick={toggleTheme}>
        <FontAwesomeIcon icon={isDark ? faMoon : faSun} />
      </button>
    </ul>
  );
}

export default Navbar;
