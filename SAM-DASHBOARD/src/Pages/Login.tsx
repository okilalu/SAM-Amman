import { MdLockOutline } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useUserData } from "../hooks/useUserHooks";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const { loginUser } = useUserData({});
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [credential, setCredential] = useState("");
  const [error, setError] = useState("");
  const [show, setShow] = useState("false");

  const handleLogin = async (e) => {
    e.preventDefault(); // ✅ cegah reload halaman

    if (!username || !password || !credential) {
      setError("Lengkapi semua field!");
      return;
    }

    if (password.length < 8) {
      setError("Password harus memiliki minimal 8 karakter.");
      return;
    }

    try {
      const response = await loginUser({ username, password, credential });

      if (response) {
        setError("");
        navigate("/"); // ✅ arahkan ke dashboard
      } else {
        setError("Username atau password salah");
      }
    } catch (err) {
      console.error("Gagal login:", err);
      setError("Terjadi kesalahan saat login. Coba lagi nanti.");
    }
  };

  const handleShowPass = () => {
    setShow(!show);
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center px-6">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-md px-10 py-10 border border-gray-200">
        {/* Header */}
        <div className="flex flex-col items-center text-gray-700 mb-6">
          <div className="bg-gray-300 p-3 rounded-full mb-4 shadow-inner">
            <MdLockOutline size={30} className="text-gray-700" />
          </div>
          <h2 className="text-3xl font-bold">Sign In</h2>
          <p className="text-sm text-gray-500 mt-1">
            Login to see activity of SAM device
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          {/* Username */}
          <div className="text-black">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                error.includes("Username")
                  ? "border-red-500 focus:ring-red-400 bg-red-50"
                  : "border-gray-300 focus:ring-blue-400 bg-gray-100 focus:bg-white"
              }`}
            />
          </div>

          {/* Password */}
          <div className="text-black">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Password
            </label>
            <div
              className={`focus:ring-2 border rounded-lg flex items-center ${
                error.includes("Password")
                  ? "border-red-500 focus:ring-red-400 bg-red-50"
                  : "border-gray-300 focus:ring-blue-400 bg-gray-100 focus:bg-white"
              }`}
            >
              <input
                type={`${show ? "password" : "text"}`}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (e.target.value.length < 8) {
                    setError("Password harus memiliki minimal 8 karakter.");
                  } else {
                    setError("");
                  }
                }}
                className="w-full px-4 py-2 focus:outline-none transition-all duration-200"
                placeholder="Enter your password"
              />
              {password.length > 0 && (
                <button
                  type="button"
                  onClick={handleShowPass}
                  className="rounded-lg text-gray-700 px-3 py-2 items-center"
                >
                  {show ? <FaEye /> : <FaEyeSlash />}
                </button>
              )}
            </div>
          </div>

          {/* Pesan Error */}
          {error && (
            <p className="text-red-500 text-sm text-center font-medium -mt-2">
              {error}
            </p>
          )}

          {/* Credential */}
          <div className="text-black">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Credential
            </label>
            <select
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all duration-200"
            >
              <option value="">Pilih Credential</option>
              <option value="Admin">Admin</option>
              <option value="Operator">Operator</option>
              <option value="Superadmin">Superadmin</option>
            </select>
          </div>

          {/* Tombol Login */}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg shadow transition-all duration-200"
          >
            Login
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="px-3 text-gray-400 text-sm">OR</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        {/* Redirect ke Register */}
        <p className="text-center text-gray-600 text-sm">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-500 font-semibold">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
