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

  const registerUser = async (payload: {
    username: string;
    password: string;
    credential: string;
  }) => {
    setIsLoading(true);
    try {
      const res = await dispatch(createUser(payload)).unwrap();
      setAllUsers((prev) => [...prev!, res?.data?.user]);
      alert("Registrasi Berhasil");
      return res.data as User;
    } catch (error) {
      console.log("Failed to registered", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUsers = async (userId: string, data: Partial<User>) => {
    try {
      const result = await dispatch(updateUser({ userId, data })).unwrap();
      return result;
    } catch (err) {
      console.error("Failed to update user:", err);
      throw err;
    }
  };

  const deleteUsers = async ({ id }: { id: string }) => {
    if (!id) {
      alert("samId tidak tidak ditemukan");
      return;
    }
    setIsLoading(true);

    try {
      await dispatch(deleteUser({ data: id })).unwrap();
      alert("Berhasil Menghapus data");
      await validateAllUsers();
      closeModal?.();
    } catch (err: any) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const loginUser = async (payload: { username: string; password: string }) => {
    setIsLoading(true);
    try {
      const res = await dispatch(login(payload)).unwrap();
      alert("Login berhasil");
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
      navigate("/home");
    }
  };

  const validateAllUsers = async () => {
    console.log("Dispatch getAllUsers jalan");
    try {
      const res = await dispatch(getAllUser()).unwrap();
      setAllUsers(res.data?.user ?? null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      alert("Berhasil Logout");
    } catch (error) {
      console.log(error);
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
    handleLogout,
    registerUser,
    updateUsers,
    deleteUsers,
    loginUser,
  };
}
