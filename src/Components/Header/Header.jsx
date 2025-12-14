import React from "react";
import { Container, Logo, LogoutBtn } from "..";
import ThemeToggle from "@/Components/ToggleThemeButton";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();

  const navItems = [
    // { name: "Home", slug: "/", active: true },
    { name: "Home", slug: "/all-posts", active: authStatus },
    { name: "Login", slug: "/login", active: !authStatus },
    { name: "Signup", slug: "/signup", active: !authStatus },
    { name: "Add Post", slug: "/add-post", active: authStatus },
  ];

  return (
    <header className="py-4 bg-[#eeebe4] text-[#1f2226] border-b border-[#e0ded8] dark:bg-[#2a2d31] dark:text-[#e8e6e3] dark:border-[#3f4347]">
      <Container>
        <nav className="flex items-center">
          <div className="mr-4">
            <Link to="/all-posts">
              <Logo width="100px" />
            </Link>
          </div>
          <ul className="flex ml-auto items-center gap-2">
            {navItems.map((item) => 
            item.active ? (
              <li key={item.name}>
                <button
                  onClick={() => navigate(item.slug)}
                  className="inline-block px-4 py-2 text-sm font-sans cursor-pointer text-[#4f5358] hover:text-[#8c7a57] dark:text-[#c5c3bf] dark:hover:text-[#a8956b] transition-colors duration-150 ease-out rounded-md hover:bg-black/5 dark:hover:bg-white/5"
                >
                  {item.name}
                </button>
              </li>
            ) : null)}
            {authStatus && (
              <li>
                <LogoutBtn />
              </li>
            )}
            {authStatus && (
              <li className="mr-1">
                <ThemeToggle />
              </li>
            )}
          </ul>
        </nav>
      </Container>
    </header>
  );
}

export default Header;
