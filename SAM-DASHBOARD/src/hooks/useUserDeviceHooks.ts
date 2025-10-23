import type { AppDispatch } from "../Redux/store";
import type { UserDevice } from "../../types/types";
import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  addPermission,
  deletePermission,
  getAllPermissionsByUserId,
  getAllPermissionsByDeviceId,
  getAccessibleDevice,
} from "../Redux/slices/userDeviceSlice";

interface UserDeviceDataProps {
  closeModal?: () => void;
}
export function useUserDeviceData({ closeModal }: UserDeviceDataProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [permissions, setPermissions] = useState<UserDevice[]>([]);
  const [accessible, setAccessible] = useState<UserDevice[]>([]);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [warning, setWarning] = useState<string | null>(null);
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

      setPermissions((prev) => [...prev, res.data] as UserDevice[]);
      setSuccess("Permissions created successfully");

      await getAllPermissionsByUserId({ userId });

      closeModal?.();
      return res;
    } catch (err: any) {
      setError("Failed to add permissions");
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
    deviceId: string | string[];
  }) => {
    if (!userId) return alert("❌ UserId tidak ditemukan");

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      await dispatch(deletePermission({ userId, deviceId })).unwrap();
      setSuccess("Successfully deleted permission");
      await getAllPermissionsByUserId({ userId });
      closeModal?.();
    } catch (err: any) {
      console.error("❌ Delete Location Error:", err);
      setError(err?.message || "Failed to deleted permission");
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
      setError(err?.message || "Failed to fetching all permissions");
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
      setError(err?.message || "Failed to fetching all permissions");
      return undefined;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllAccessible = async () => {
    setIsLoading(true);
    setError("");
    setSuccess("");
    setAccessible([]);

    try {
      const res = await dispatch(getAccessibleDevice()).unwrap();

      if (res && Array.isArray(res.data)) {
        setAccessible(res.data);
      } else {
        setAccessible([]);
      }
      setSuccess(res?.message ?? "Fetched");

      return res;
    } catch (err: any) {
      console.error("❌ Fetch Locations Error:", err);
      setError(err?.message || "Failed to fetching all permissions");
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
    warning,
    setError,
    setWarning,
    setSuccess,
    handleAddPermission,
    fetchAllPermissionsByUserId,
    handleDeletePermission,
    fetchAllPermissionsByDeviceId,
    fetchAllAccessible,
    accessible,
  };
}
