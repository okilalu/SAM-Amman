import type { AppDispatch } from "../Redux/store";
import type { User } from "../../types/types";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  createUser,
  currentUser,
  getAllUser,
  login,
  logout,
  updateUser,
  deleteUser,
} from "../Redux/slices/userSlice";

interface UserDataProps {
  id?: number;
  closeModal?: () => void;
}

export function useUserData({ closeModal }: UserDataProps) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [allUsers, setAllUsers] = useState<User[]>();
  const [user, setUsers] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const registerUser = async (payload: {
    username: string;
    password: string;
    credential: string;
  }) => {
    setIsLoading(true);
    setSuccess(null);
    setError(null);
    try {
      const res = await dispatch(createUser(payload)).unwrap();
      setAllUsers((prev) => [...prev!, res?.data?.user]);
      setSuccess("User created successfully");
      return res.data as User;
    } catch (error) {
      console.log("Failed to registered", error);
      setError("Failed to registered user");
    } finally {
      setIsLoading(false);
    }
  };

  const updateUsers = async (userId: string, data: Partial<User>) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    setWarning(null);

    if (!userId) {
      setWarning("User not found");
      return;
    }
    try {
      const result = await dispatch(updateUser({ userId, data })).unwrap();
      setSuccess("Successfully updated user");
      return result;
    } catch (err) {
      console.error("Failed to update user:", err);
      setError("Failed to updated user");
      throw err;
    }
  };

  const deleteUsers = async ({ id }: { id: string }) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    if (!id) {
      setWarning("User not found");
      return;
    }

    try {
      await dispatch(deleteUser({ data: id })).unwrap();
      setSuccess("Successfuly deleted user");
      await validateAllUsers();
      closeModal?.();
    } catch (err: any) {
      console.log(err);
      setError("Failed to deleted user");
    } finally {
      setIsLoading(false);
    }
  };

  const loginUser = async (payload: {
    username: string;
    password: string;
    credential: string;
  }) => {
    setIsLoading(true);
    try {
      const res = await dispatch(login(payload)).unwrap();
      alert("Login berhasil");
      setIsLoggedIn(true);
      return res.data as User;
    } catch (error) {
      console.log("Failed to login user", error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateUser = async () => {
    try {
      const res = await dispatch(currentUser()).unwrap();
      setUsers(res?.data?.user ?? null);
    } catch (error) {
      console.log(error);
    }
  };

  const validateAllUsers = async () => {
    console.log("Dispatch getAllUsers jalan");

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await dispatch(getAllUser()).unwrap();
      setAllUsers(res.data?.user ?? null);
      setSuccess("User fetched successfully");
    } catch (error) {
      console.log(error);
      setError("Error to fetched user");
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await dispatch(logout()).unwrap();
      setSuccess("Successfully logout");
    } catch (error) {
      console.log(error);
      setError("Failed to logout");
    } finally {
      closeModal?.();
      navigate("/home");
    }
  };
  return {
    validateUser,
    validateAllUsers,
    user,
    allUsers,
    isLoading,
    error,
    success,
    warning,
    setWarning,
    setError,
    setSuccess,
    isLoggedIn,
    handleLogout,
    registerUser,
    updateUsers,
    deleteUsers,
    loginUser,
  };
}
