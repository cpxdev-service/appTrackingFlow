import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="main-layout">
      <header>
        <h1>Welcome to the Main Layout</h1>
      </header>
      <main style={{ marginTop: 80 }}>
        <Outlet />
      </main>
      <footer className="text-center mt-5">
        <p>&copy; {new Date().getFullYear()} CPXDev Studio</p>
      </footer>
    </div>
  );
};

export default AdminLayout;
