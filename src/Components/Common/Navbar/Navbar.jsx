import {useLocation,useNavigate } from "react-router-dom";
import MaxWidthWrapper from '../MaxWidthWrapper/MaxWidthWrapper'
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { useState,useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { userLogout } from "../../../Redux/userAuth";

const Navbar = () => {
  
    const user = useSelector((state) => state.user?.Token);
    const [isTopOfPage, setIsTopOfPage] = useState(true);
    const [isMenuToggled, setIsMenuToggled] = useState(false)
    const navigate=useNavigate()
    const location = useLocation();
    const currentEndpoint = location.pathname;
    console.log(currentEndpoint)
    const flexBetween = "flex items-center justify-between";
    const navbarBackground = isTopOfPage ? "" : "bg-primary-100 drop-shadow";
    const dispatch = useDispatch();
    const logout = () => {
        dispatch(userLogout());
        navigate("/login");
    };
    useEffect(() => {
    const handleScroll = () => {
     
      if (window.scrollY === 0) {
        setIsTopOfPage(true);
      }
      if (window.scrollY !== 0) setIsTopOfPage(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <>
    {console.log(isTopOfPage)}
      <nav
        className={`${navbarBackground} ${flexBetween} fixed top-0 z-30 w-full py-6`}
      >
      <MaxWidthWrapper className={`${flexBetween} mx-auto`}>
      <div className={`${flexBetween} w-full gap-16`}>
            {/* LEFT SIDE */}
            <h4 className="italic tracking-wider">PDF</h4>

            {/* RIGHT SIDE */}
            
              <div className={` hidden sm:flex sm:${flexBetween} w-full`}>
                <div className={`${flexBetween} gap-8 text-sm`}>
                  
                  <p  className={`${currentEndpoint === "/" ? "text-primary-500" : ""}
        transition duration-500 hover:text-primary-300 cursor-pointer
      `}
      onClick={() => navigate("/")}
    >
      Home
    </p>
    <p  className={`${currentEndpoint === "/files" ? "text-primary-500" : ""}
        transition duration-500 hover:text-primary-300 cursor-pointer
      `}
      onClick={() => navigate("/files")}
    >
      Files
    </p>
                  
                </div>
                {!user?
                <div className={`${flexBetween} gap-8`}>
                  <p className="cursor-pointer" onClick={() => navigate("/login")}>Sign In</p>
                  <button className="rounded-md bg-secondary-500 px-10 py-2 hover:bg-primary-500 hover:text-white" onClick={() => navigate("/login")}>
                    Become a Member
                  </button>
                </div>:
                <div className={`${flexBetween} gap-8 `}>
                <p onClick={logout}>Logout</p>
                <button className="rounded-md bg-secondary-500 px-10 py-2 hover:bg-primary-500 hover:text-white">
                  Get Started
                </button>
              </div>
}
              </div>
            
              <button
                className=" sm:hidden rounded-full bg-secondary-500 p-2"
                onClick={() => setIsMenuToggled(!isMenuToggled)}
              >
                <Bars3Icon className="h-6 w-6 text-white" />
              </button>
            
          </div>
      </MaxWidthWrapper>
      </nav>
      {/* MOBILE MENU MODAL */}
      { isMenuToggled && (
        <div className="fixed right-0 bottom-0 z-40 h-full w-[300px] bg-primary-100 drop-shadow-xl">
          {/* CLOSE ICON */}
          <div className="flex justify-end p-12">
            <button onClick={() => setIsMenuToggled(!isMenuToggled)}>
              <XMarkIcon className="h-6 w-6 text-gray-400" />
            </button>
          </div>

          {/* MENU ITEMS */}
          <div className="ml-[33%] flex flex-col gap-10 text-2xl">
          <p  className={`${currentEndpoint === "/" ? "text-primary-500" : ""}
        transition duration-500 hover:text-primary-300
      `}
      onClick={() => navigate("/")}
    >
      Home
    </p>
    <p  className={`${currentEndpoint === "/files" ? "text-primary-500" : ""}
        transition duration-500 hover:text-primary-300
      `}
      onClick={() => navigate("/files")}
    >
      Files
    </p>
    <p  className={`
        transition duration-500 hover:text-primary-300
      `}
      onClick={() => navigate("/login")}
    >
      Login
    </p>
    <p  className={`
        transition duration-500 hover:text-primary-300
      `}
      onClick={() => navigate("/login")}
    >
      Signup
    </p>
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar