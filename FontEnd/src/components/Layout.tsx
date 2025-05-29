import React, { useState } from "react";
import Header from "./sidebar";
import { Outlet, useLocation } from "react-router-dom";

const Layout = () => {
    const path = useLocation();
    return (
        <div className="flex" data-theme="black">
        {/* Sidebar */}
        <div className={`w-[80px] ${path.pathname === "/message" || path.pathname === "/Message" || path.pathname.split("/")[1] === "message" ? "w-[80px]" : "xl:w-64"} min-h-screen`}>
            <Header />
        </div>

        {/* Nội dung chính */}
        <div className="flex-1">
            <Outlet />
        </div>
    </div>
    )
}

export default Layout;