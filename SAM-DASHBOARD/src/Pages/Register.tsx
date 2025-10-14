import React, { useState } from "react";
import { MdPersonAddAlt1 } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useUserData } from "../hooks/useUserHooks";

export default function Register() {
  const { registerUser } = useUserData({});
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [credential, setCredential] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username || !password || !credential) {
      setError("Lengkapi semua field!");
      return;
    }

    // Validasi panjang password
    if (password.length < 8) {
      setError("Password harus memiliki minimal 8 karakter.");
      return;
    }

    try {
      await registerUser({ username, password, credential });
      alert("User berhasil ditambahkan!");

      // Reset form
      setUsername("");
      setPassword("");
      setCredential("");
      setError("");

      navigate("/login");
    } catch (error) {
      console.error("Gagal register user", error);
      setError("Terjadi kesalahan saat registrasi. Coba lagi nanti.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-md px-10 py-10 border border-gray-200">
        {/* Header */}
        <div className="flex flex-col items-center text-gray-700 mb-6">
          <div className="bg-gray-300 p-3 rounded-full mb-4 shadow-inner">
            <MdPersonAddAlt1 size={30} className="text-gray-700" />
          </div>
          <h2 className="text-3xl font-bold">Sign Up</h2>
          <p className="text-sm text-gray-500 mt-1">
            Create an account to continue
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="flex flex-col gap-5">
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all duration-200"
            />
          </div>

          {/* Password */}
          <div className="text-black">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (e.target.value.length < 8) {
                  setError("Password harus memiliki minimal 8 karakter.");
                } else {
                  setError("");
                }
              }}
              placeholder="Enter your password"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                error.includes("Password")
                  ? "border-red-500 focus:ring-red-400 bg-red-50"
                  : "border-gray-300 focus:ring-blue-400 bg-gray-100 focus:bg-white"
              }`}
            />
            {error.includes("Password") && (
              <p className="text-red-500 text-xs mt-1 font-medium">{error}</p>
            )}
          </div>

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
            </select>
          </div>

          {/* Error umum */}
          {error && !error.includes("Password") && (
            <p className="text-red-500 text-sm text-center font-medium -mt-2">
              {error}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg shadow transition-all duration-200"
          >
            Register
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="px-3 text-gray-400 text-sm">OR</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        {/* Redirect Login */}
        <p className="text-center text-gray-600 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 font-semibold">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
