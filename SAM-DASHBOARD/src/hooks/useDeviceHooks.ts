import {
  generateDevice,
  updateDevice,
  deleteDevice,
  getAllDevice,
  storageInfo,
} from "../Redux/slices/deviceSlice";
import type { AppDispatch } from "../Redux/store";
import type { Device, StorageData } from "../../types/types";
import { useState } from "react";
import { useDispatch } from "react-redux";

interface UseDeviceDataProps {
  deviceId?: string;
  closeModal?: () => void;
  value?: Partial<Device>;
  samId?: string;
}
export function useDeviceData({ closeModal }: UseDeviceDataProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [devices, setDevices] = useState<Device[]>([]);
  // const [storage, setStorage] = useState();
  const [storage, setStorage] = useState<StorageData | null>(null);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [warning, setWarning] = useState<string | null>(null);

  const handleGenerateDevice = async (value: Device) => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await dispatch(
        generateDevice({ data: value as Device })
      ).unwrap();

      setDevices((prev) => [...prev, res.data.device as unknown as Device]);
      setSuccess("Device created successfully");

      await fetchAllDevices();
      closeModal?.();
      return res;
    } catch (err) {
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
    } catch (err) {
      setError("Gagal memuat perangkat");
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Update device
  const handleUpdateDevice = async (
    deviceId: string,
    data: Partial<Device>
  ) => {
    console.log(deviceId);

    if (!deviceId) {
      setWarning("Can't find device");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      const res = await dispatch(
        updateDevice({ deviceId, data: data || {} })
      ).unwrap();
      setSuccess("Device updated successfully");

      await fetchAllDevices();
      closeModal?.();
      return res;
    } catch (err) {
      setError("Gagal memperbarui perangkat");
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
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Get all devices
  const getSystemInfo = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await dispatch(storageInfo()).unwrap();
      setStorage(res.data as unknown as StorageData);
      setSuccess("Devices fetched successfully");
      return res;
    } catch (err) {
      setError("Gagal memuat perangkat");
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
    warning,
    setError,
    storage,
    handleGenerateDevice,
    fetchAllDevices,
    handleUpdateDevice,
    handleDeleteDevice,
    getSystemInfo,
  };
}
