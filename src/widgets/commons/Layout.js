import { useState } from "react";
import Sidebar from "./Sidebar";
import "./Layout.css";

const Layout = ({ children }) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <div className="app-layout">
            <Sidebar onCollapse={setIsSidebarCollapsed} />
            <main className={`main-content ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                {children}
            </main>
        </div>
    );
};

export default Layout;
