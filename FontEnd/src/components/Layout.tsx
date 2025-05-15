import React from "react";
import Header from "./sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
    return (
        <div className="flex" data-theme="black">
        {/* Sidebar */}
        <div className="xl:w-64 w-[80px] min-h-screen">
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