import React from "react";
import quiblyLogoDark from "@/assets/main-logo/Quibly.png";
import quiblyLogo from "@/assets/main-logo/Quibly-dark.png";
import { useSelector } from "react-redux";

function Logo({ width = "100px" }) {
  const mode = useSelector((state) => state.theme.mode);
  const isDarkMode = mode === "dark";

  return (
    <div
      className="overflow-hidden flex items-center"
      style={{ width, height: "40px" }}
    >
      <img
        src={quiblyLogoDark}
        alt="Quibly"
        className="hidden dark:block h-full w-full object-contain object-center"
      />
      <img
        src={quiblyLogo}
        alt="Quibly"
        className="block dark:hidden h-full w-full object-contain object-center"
      />
    </div>
  );
}

export default Logo;
