import React from "react";
import { MdLockOutline } from "react-icons/md";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center px-6 pl-60">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-md px-10 py-10 border border-gray-200">
        <div className="flex flex-col items-center text-gray-700 mb-6">
          <div className="bg-gray-300 p-3 rounded-full mb-4 shadow-inner">
            <MdLockOutline size={30} className="text-gray-700" />
          </div>
          <h2 className="text-3xl font-bold">Sign In</h2>
          <p className="text-sm text-gray-500 mt-1">
            Login to see activity of SAM device
          </p>
        </div>

        <form className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter your username"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all duration-200"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg shadow transition-all duration-200"
          >
            Login
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="px-3 text-gray-400 text-sm">OR</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

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
