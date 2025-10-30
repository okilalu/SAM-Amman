import { useState } from "react";
import { MdPersonAddAlt1 } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useUserData } from "../hooks/useUserHooks";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { CustomSelects } from "@/components/CustomSelects";

export default function Register() {
  const { registerUser, isLoading } = useUserData({});
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [credential, setCredential] = useState("");
  const [errorUsername, setErrorUsername] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [errorGeneral, setErrorGeneral] = useState("");
  const [show, setShow] = useState(false);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trimStart();
    setUsername(value);

    if (value.length < 8) {
      setErrorUsername("Username harus memiliki minimal 8 karakter.");
    } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      setErrorUsername(
        "Username hanya boleh berisi huruf, angka, dan underscore (_)."
      );
    } else {
      setErrorUsername("");
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);

    if (value.length < 8) {
      setErrorPassword("Password harus memiliki minimal 8 karakter.");
    } else {
      setErrorPassword("");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorGeneral("");

    if (!username || !password || !credential) {
      setErrorGeneral("Lengkapi semua field!");
      return;
    }

    if (errorUsername || errorPassword) {
      setErrorGeneral("Periksa kembali input Anda.");
      return;
    }

    try {
      await registerUser({ username, password, credential });

      setUsername("");
      setPassword("");
      setCredential("");
      setErrorGeneral("");

      navigate("/login");
    } catch (error) {
      console.error("Gagal register user", error);
      setErrorGeneral("Terjadi kesalahan saat registrasi. Coba lagi nanti.");
    }
  };

  const option = [
    {
      label: "Admin",
      value: "Admin",
    },
    {
      label: "Operator",
      value: "Operator",
    },
  ];

  if (isLoading) {
    return (
      <div className="bg-white flex flex-1 flex-col justify-center items-center h-screen">
        <span className="loading loading-spinner loading-xl text-blue-400"></span>
        <p className="ml-3 text-gray-700 text-lg">Loading...</p>
      </div>
    );
  }

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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={handleUsernameChange}
              placeholder="Masukkan username Anda"
              autoComplete="username"
              className={`w-full px-4 py-2 border rounded-lg bg-gray-100 focus:outline-none transition-all duration-200 ${
                errorUsername
                  ? "border-red-500 focus:ring-2 focus:ring-red-400"
                  : "border-gray-300 focus:ring-2 focus:ring-blue-400 focus:bg-white"
              }`}
            />
            {errorUsername ? (
              <p className="text-red-500 text-xs mt-1">{errorUsername}</p>
            ) : (
              <p className="text-gray-400 text-xs mt-1">
                Gunakan minimal 8 karakter (huruf/angka diperbolehkan)
              </p>
            )}
          </div>

          {/* Password */}
          <div className="text-black">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Password
            </label>
            <div
              className={`border rounded-lg flex items-center transition-all duration-200 ${
                errorPassword
                  ? "border-red-500 focus-within:ring-2 focus-within:ring-red-400 bg-red-50"
                  : "border-gray-300 focus-within:ring-2 focus-within:ring-blue-400 bg-gray-100 focus-within:bg-white"
              }`}
            >
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
                placeholder="Masukkan password Anda"
                className="w-full px-4 py-2 focus:outline-none bg-transparent"
              />
              {password && (
                <button
                  type="button"
                  onClick={() => setShow((prev) => !prev)}
                  className="px-3 py-2 text-gray-600 hover:text-gray-800 transition"
                >
                  {show ? <FaEyeSlash /> : <FaEye />}
                </button>
              )}
            </div>
            {errorPassword && (
              <p className="text-red-500 text-xs mt-1">{errorPassword}</p>
            )}
          </div>

          {/* Credential */}
          <div className="text-black">
            <CustomSelects
              value={option.find((opt) => opt.value === credential) || null}
              onChange={(val) => setCredential(val)}
              options={option}
              label="Credential"
              flex="flex-col"
              items="items-start"
              gap="gap-2"
              labelClass="items-center gap-3"
              background="bg-gray-100"
            />
          </div>

          {/* Error umum */}
          {errorGeneral && (
            <p className="text-red-500 text-sm text-center font-medium -mt-2">
              {errorGeneral}
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
