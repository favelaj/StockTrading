import { useState } from "react";
import Navbar from "../components/Navbar";
import HomeComp from "../components/HomeComp";

export default function Home({ darkMode, toggleDarkMode }) {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <div className="h-screen flex flex-col">
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} setIsRegister={setIsRegister} />
      <div className="flex-1 overflow-auto">
        <HomeComp isRegister={isRegister} setIsRegister={setIsRegister} />
      </div>
    </div>
  );
}
