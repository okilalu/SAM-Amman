import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Login from "./Pages/Login";
import Register from "./Pages/Register";

function App() {
  return (
    <div className="min-h-screen">
      <Routes>
        {/* Route untuk halaman login */}
        <Route path="/login" element={<Login />} />

        {/* Route untuk halaman register */}
        <Route path="/register" element={<Register />} />

        {/* Route default (misalnya dashboard) */}
        <Route
          path="/*"
          element={
            <div>
              <Sidebar />
              {/* konten utama bisa kamu isi di sini */}
            </div>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
