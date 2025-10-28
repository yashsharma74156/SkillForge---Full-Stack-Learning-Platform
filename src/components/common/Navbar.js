import React, { useEffect, useState } from "react";
import { Link, useLocation, matchPath } from "react-router-dom";
import { useSelector } from "react-redux";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { IoIosArrowDown } from "react-icons/io";
import { RxHamburgerMenu } from "react-icons/rx";
import logo from "../../assets/Logo/Logo-Full-Light.png";
import ProfileDropDown from "../core/Auth/ProfileDropDown";
import { apiConnector } from "../../services/apiconnector";
import { categories } from "../../services/apis";
import { NavbarLinks } from "../../data/navbar-links";
import "./loader.css";

const Navbar = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);
  const location = useLocation();
  const [subLinks, setSubLinks] = useState([]);

  useEffect(() => {
    const fetchSublinks = async () => {
      try {
        const result = await apiConnector("GET", categories.CATEGORIES_API);
        if (result.data && result.data.data) {
          setSubLinks(result.data.data);
        } else {
          setSubLinks([]); // Ensure an empty array if data is missing
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setSubLinks([]); // Handle API failure by setting an empty array
      }
    };
    fetchSublinks();
  }, []);

  const matchRoute = (route) => matchPath({ path: route }, location.pathname);

  return (
    <div className="flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700">
      <div className="flex w-11/12 max-w-maxContent items-center justify-between">
        <Link to="/">
          <img src={logo} width={160} height={42} loading="lazy" alt="Logo" />
        </Link>

        <nav>
          <ul className="hidden md:flex gap-x-6 text-richblack-25">
            {NavbarLinks.map((link, index) => (
              <li key={index}>
                {link.title === "Catalog" ? (
                  <div className="relative flex items-center gap-2 group">
                    <p>{link.title}</p>
                    <IoIosArrowDown />
                    <div
                      className={`absolute left-[50%] translate-x-[-49%] ${
                        subLinks?.length > 0 ? "translate-y-[15%]" : "translate-y-[40%]"
                      } top-[50%] z-50 flex flex-col rounded-md bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 lg:w-[300px]`}
                    >
                      <div className="absolute left-[50%] top-0 translate-x-[80%] translate-y-[-45%] h-6 w-6 rotate-45 rounded bg-richblack-5"></div>
                      {Array.isArray(subLinks) && subLinks.length > 0 ? (
                        subLinks.map((subLink, idx) => (
                          <Link
                            className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                            to={`catalog/${subLink.name}`}
                            key={idx}
                          >
                            <p>{subLink.name}</p>
                          </Link>
                        ))
                      ) : (
                        <span className="loader"></span>
                      )}
                    </div>
                  </div>
                ) : (
                  <Link to={link?.path}>
                    <p className={matchRoute(link?.path) ? "text-yellow-25" : "text-richblack-25"}>
                      {link.title}
                    </p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden md:flex gap-x-4 items-center">
          {user && user?.accountType !== "Instructor" && (
            <Link to="/dashboard/cart" className="relative pr-2">
              <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
              {totalItems > 0 && (
                <span className="absolute -bottom-2 -right-0 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                  {totalItems}
                </span>
              )}
            </Link>
          )}
          {!token ? (
            <>
              <Link to="/login">
                <button className="border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md">
                  Log in
                </button>
              </Link>
              <Link to="/signup">
                <button className="border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md">
                  Sign Up
                </button>
              </Link>
            </>
          ) : (
            <ProfileDropDown />
          )}
        </div>

        <div className="mr-4 md:hidden text-[#AFB2BF] scale-150">
          <RxHamburgerMenu />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
