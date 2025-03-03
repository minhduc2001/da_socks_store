import "./index.scss";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import { Layout } from "antd";

function LayoutWrapper() {
  return (
    <Layout className='!min-h-screen'>
      <Sidebar />
      <Layout>
        <Navbar />
        <Layout.Content className='mx-4 mt-4'>
          <Outlet />
        </Layout.Content>
      </Layout>
    </Layout>
  );
}

export default LayoutWrapper;
