import React from "react";
import { useSelector } from "react-redux";
import { Routes, Route,Navigate } from "react-router-dom";
import Login from "../Pages/Login";
import Home from "../Pages/Home";
import FilesPage from "../Pages/Files";


function UserRoute() {
    const IsUserAuth = useSelector((state) => state.user?.Token);
    return (
        <>
            <Routes>
            <Route path="/login" element={IsUserAuth ? <Navigate to="/" />  : <Login />} />    
            <Route path="/" element={<Home />} />  
            <Route path="/files" element={IsUserAuth ? <FilesPage />  : <Navigate to="/login" />} />   
            </Routes>
        </>
    );
}

export default UserRoute;