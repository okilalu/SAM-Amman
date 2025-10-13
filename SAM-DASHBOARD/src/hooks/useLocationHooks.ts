import { useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../Redux/store";
import type { Location } from "../../types/types";
import {
  createLocation,
  updateLocation,
  deleteLocation,
  getAllLocation,
} from "../Redux/slices/locationSlice";

interface UseLocationProps {
  closeModal?: () => void;
}

export function useLocationData({ closeModal }: UseLocationProps = {}) {
  const dispatch = useDispatch<AppDispatch>();
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleCreateLocation = async ({ value }: { value: string }) => {
    setLoading(true);
    setError("");
    setSuccess("");

    console.log(value);
    try {
      const res = await dispatch(createLocation({ data: value })).unwrap();
      console.log("📦 Response:", res);
      setLocations((prev) => [...prev, res.data as Location]);
      setSuccess("Location created successfully");

      await fetchAllLocations();
      closeModal?.();
      return res;
    } catch (err: any) {
      console.error("❌ Create Location Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLocation = async (id: number, location: string) => {
    if (!id) return alert("❌ ID lokasi tidak ditemukan");

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await dispatch(updateLocation({ id, location })).unwrap();
      if (res.status) {
        setSuccess(res.message || "Lokasi berhasil diperbarui");
        await fetchAllLocations();
        closeModal?.();
      } else {
        setError(res.message || "Gagal memperbarui lokasi");
      }
      return res;
    } catch (err: any) {
      console.error("❌ Update Location Error:", err);
      setError(err?.message || "Gagal memperbarui lokasi");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLocation = async (id: number) => {
    if (!id) return alert("❌ ID lokasi tidak ditemukan");

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await dispatch(deleteLocation({ id })).unwrap();
      setSuccess("Lokasi berhasil dihapus");
      await fetchAllLocations();
      closeModal?.();
    } catch (err: any) {
      console.error("❌ Delete Location Error:", err);
      setError(err?.message || "Gagal menghapus lokasi");
    } finally {
      setLoading(false);
    }
  };

  // ✅ GET ALL
  const fetchAllLocations = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await dispatch(getAllLocation()).unwrap();
      console.log(res);

      if (res && Array.isArray(res.data)) {
        setLocations(res.data);
      } else {
        setLocations([]);
      }
      setSuccess(res?.message ?? "Fetched");

      return res;
    } catch (err: any) {
      console.error("❌ Fetch Locations Error:", err);
      setError(err?.message || "Gagal memuat daftar lokasi");
      return undefined;
    } finally {
      setLoading(false);
    }
  };

  return {
    locations,
    loading,
    error,
    success,
    handleCreateLocation,
    handleUpdateLocation,
    handleDeleteLocation,
    fetchAllLocations,
  };
}
