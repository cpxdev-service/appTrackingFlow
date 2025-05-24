import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="main-layout">
      <header>
        <h1>Welcome to the Main Layout</h1>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        <p>&copy; 2023 Your Company</p>
      </footer>
    </div>
  );
}

export default AdminLayout;