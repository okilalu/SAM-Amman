import type { AppDispatch } from "../Redux/store";
import type { UserDevice } from "../../types/types";
import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  addPermission,
  deletePermission,
  getAllPermissionsByUserId,
  getAllPermissionsByDeviceId,
} from "../Redux/slices/userDeviceSlice";

interface UserDeviceDataProps {
  closeModal?: () => void;
}
export function useUserDeviceData({ closeModal }: UserDeviceDataProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [permissions, setPermissions] = useState<UserDevice[]>([]);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleAddPermission = async ({
    userId,
    deviceId,
  }: {
    userId: string;
    deviceId: string | string[];
  }) => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await dispatch(addPermission({ deviceId, userId })).unwrap();

      setPermissions((prev) => [...prev, res.data]);
      alert("Berhasil menambahkan permission");
      setSuccess("Permissions created successfully");

      await getAllPermissionsByUserId({ userId });
      console.log(res);

      closeModal?.();
      return res;
    } catch (err: any) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePermission = async ({
    userId,
    deviceId,
  }: {
    userId: string;
    deviceId: string;
  }) => {
    if (!userId) return alert("❌ UserId tidak ditemukan");

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      await dispatch(deletePermission({ userId, deviceId })).unwrap();
      setSuccess("Lokasi berhasil dihapus");
      await getAllPermissionsByUserId({ userId });
      closeModal?.();
    } catch (err: any) {
      console.error("❌ Delete Location Error:", err);
      setError(err?.message || "Gagal menghapus lokasi");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllPermissionsByUserId = async (userId: string) => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await dispatch(
        getAllPermissionsByUserId({ userId })
      ).unwrap();
      console.log(res);

      if (res && Array.isArray(res.data)) {
        setPermissions(res.data);
      } else {
        setPermissions([]);
      }
      setSuccess(res?.message ?? "Fetched");

      return res;
    } catch (err: any) {
      console.error("❌ Fetch Locations Error:", err);
      setError(err?.message || "Gagal memuat daftar lokasi");
      return undefined;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllPermissionsByDeviceId = async (deviceId: string) => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await dispatch(
        getAllPermissionsByDeviceId({ deviceId })
      ).unwrap();
      console.log(res);

      if (res && Array.isArray(res.data)) {
        setPermissions(res.data);
      } else {
        setPermissions([]);
      }
      setSuccess(res?.message ?? "Fetched");

      return res;
    } catch (err: any) {
      console.error("❌ Fetch Locations Error:", err);
      setError(err?.message || "Gagal memuat daftar lokasi");
      return undefined;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    permissions,
    isLoading,
    error,
    success,
    handleAddPermission,
    fetchAllPermissionsByUserId,
    handleDeletePermission,
    fetchAllPermissionsByDeviceId,
  };
}
