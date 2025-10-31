import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Login from "./Pages/Login";

function App() {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <div>
              <Sidebar />
            </div>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
