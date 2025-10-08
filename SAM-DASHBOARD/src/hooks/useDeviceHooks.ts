import {
  generateDevice,
  updateDevice,
  deleteDevice,
  getAllDevice,
} from "../Redux/slices/deviceSlice";
import type { AppDispatch } from "../Redux/store";
import type { Device } from "../../types/types";
import { useState } from "react";
import { useDispatch } from "react-redux";

interface UseDeviceDataProps {
  deviceId?: string;
  closeModal?: () => void;
  value?: Partial<Device>;
  samId?: string;
}
export function useDeviceData({
  deviceId,
  closeModal,
  value,
}: UseDeviceDataProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [devices, setDevices] = useState<Device[]>([]);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleGenerateDevice = async (value: Device) => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await dispatch(
        generateDevice({ data: value as Device })
      ).unwrap();

      setDevices((prev) => [...prev, res.data.device as Device]);
      alert("Berhasil menambahkan perangkat");
      setSuccess("Device created successfully");

      await fetchAllDevices();
      closeModal?.();
      return res;
    } catch (err: any) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };
  // Get all devices
  const fetchAllDevices = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await dispatch(getAllDevice()).unwrap();
      setDevices(res.data.device || []);
      setSuccess("Devices fetched successfully");
      return res;
    } catch (err: any) {
      setError(err?.message || "Gagal memuat perangkat");
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Update device
  const handleUpdateDevice = async () => {
    if (!deviceId) {
      alert("Device ID tidak ditemukan");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const res = await dispatch(
        updateDevice({ deviceId, data: value || {} })
      ).unwrap();
      alert("Berhasil memperbarui perangkat");
      setSuccess("Device updated successfully");

      await fetchAllDevices();
      closeModal?.();
      return res;
    } catch (err: any) {
      const msg = err?.message || "Gagal memperbarui perangkat";
      setError(msg);
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete device
  const handleDeleteDevice = async ({ id }: { id: string }) => {
    if (!id) {
      alert("samId tidak tidak ditemukan");
      return;
    }
    setIsLoading(true);
    try {
      await dispatch(deleteDevice({ samId: id })).unwrap();
      alert("Berhasil Menghapus data");
      await fetchAllDevices();
      closeModal?.();
    } catch (err: any) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    devices,
    isLoading,
    error,
    success,
    handleGenerateDevice,
    fetchAllDevices,
    handleUpdateDevice,
    handleDeleteDevice,
  };
}
