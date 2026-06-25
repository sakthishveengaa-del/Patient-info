import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./MainLayout.scss";

const MainLayout = () => {
  return (
    <div className="layout">
      <Sidebar />

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;