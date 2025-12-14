import React from "react";
import { Container, Logo, LogoutBtn } from "..";
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
    <header className="py-4 bg-[#2a2d31] border-b border-[#3f4347]">
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
                  className="inline-block px-4 py-2 text-sm font-sans cursor-pointer text-[#c5c3bf] hover:text-[#a8956b] transition-colors duration-150 ease-out rounded-md hover:bg-white/5"
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
          </ul>
        </nav>
      </Container>
    </header>
  );
}

export default Header;
