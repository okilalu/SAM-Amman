import { useEffect, useState } from "react";
import CustomModal from "../components/CustomModal";
import CustomTable from "../components/CustomTable";
import { useLocationData } from "../hooks/useLocationHooks";
import { CustomInputs } from "@/components/CustomInputs";
import { CustomPagination } from "@/components/CustomPagination";
import { CustomSelects } from "@/components/CustomSelects";
import { CustomAlert } from "@/components/CustomAlert";
import { MdErrorOutline } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";
import { IoWarningOutline } from "react-icons/io5";
import { CustomButton } from "@/components/CustomButton";
import { CustomMainLoading } from "@/components/CustomMainLoading";

export default function ManageLocation() {
  const {
    locations,
    fetchAllLocations,
    handleCreateLocation,
    handleUpdateLocation,
    handleDeleteLocation,
    error,
    success,
    setError,
  } = useLocationData({});

  const [filter, setFilter] = useState("");
  const [location, setLocation] = useState("");
  const [sort, setSort] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectOption, setSelectOption] = useState<"asc" | "desc">("asc");
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [loading, setLoading] = useState<boolean>(true);
  const [warning, setWarning] = useState<string | null>(null);

  const filteredLocations = (locations ?? [])
    .filter((item) =>
      (item.location ?? "").toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) =>
      selectOption === "asc"
        ? (a.id ?? 0) - (b.id ?? 0)
        : (b.id ?? 0) - (a.id ?? 0)
    );

  const paginatedLocations = filteredLocations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenModal = (id: string) => {
    const modal = document.getElementById(id) as HTMLDialogElement;
    modal?.showModal();
  };

  const handleCloseModal = (id: string) => {
    const modal = document.getElementById(id) as HTMLDialogElement;
    modal?.close();
  };

  const handleSelectLocation = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handleRegister = async () => {
    if (!location.trim()) {
      setWarning("Lengkapi semua field!");
      return;
    }
    try {
      setLoading(true);
      await handleCreateLocation({ value: location.trim() });
      setLocation("");
      handleCloseModal("modal_register");
      await fetchAllLocations();
    } catch {
      setError("Gagal menambahkan lokasi baru");
    } finally {
      setLoading(false);
    }
  };

  const handlePrefillUpdate = () => {
    if (selectedIds.length !== 1) {
      setWarning("Pilih tepat satu lokasi untuk diperbarui");
      return;
    }
    const selectedLoc = locations?.find(
      (loc) => loc.id === Number(selectedIds[0])
    );
    if (!selectedLoc) return;
    setLocation(selectedLoc.location || "");
    handleOpenModal("modal_update");
  };

  const handleUpdate = async () => {
    if (selectedIds.length !== 1) {
      setWarning("Pilih tepat satu lokasi untuk diperbarui");
      return;
    }
    const selectedId = Number(selectedIds[0]);
    if (!location.trim()) {
      setWarning("Nama lokasi tidak boleh kosong");
      return;
    }

    try {
      setLoading(true);
      await handleUpdateLocation(selectedId, location.trim());
      handleCloseModal("modal_update");
      setLocation("");
      await fetchAllLocations();
      setSelectedIds([]);
    } catch {
      setError("Gagal memperbarui lokasi");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (selectedIds.length === 0) {
      setWarning("Pilih minimal satu lokasi untuk dihapus");
      return;
    }
    try {
      setLoading(true);
      for (const id of selectedIds) {
        await handleDeleteLocation(Number(id));
      }
      handleCloseModal("modal_delete");
      await fetchAllLocations();
      setSelectedIds([]);
    } catch {
      setError("Gagal menghapus lokasi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await fetchAllLocations();
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (warning) {
      const timer = setTimeout(() => setWarning(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [warning]);

  const sortOptions = [
    { label: "Ascending", value: "asc" },
    { label: "Descending", value: "desc" },
  ];

  return (
    <>
      {error && (
        <CustomAlert
          title={error}
          status="alert-error"
          icon={<MdErrorOutline />}
        />
      )}
      {success && (
        <CustomAlert
          title={success}
          status="alert-success"
          icon={<FaCheckCircle />}
        />
      )}
      {warning && (
        <CustomAlert
          title={warning}
          status="alert-warning"
          icon={<IoWarningOutline />}
        />
      )}

      <div className="flex gap-3">
        <div className="flex-1 text-sm text-black">
          <div className="flex items-center gap-5 justify-between p-3">
            <div className="flex flex-col gap-5 flex-1">
              <CustomInputs
                label="Filter"
                placeholder="Cari lokasi..."
                onChange={(val) => setFilter(val)}
                helperText="x"
                helper={() => setFilter("")}
                value={filter}
              />

              <CustomSelects
                value={
                  sortOptions.find((opt) => opt.value === selectOption) || null
                }
                onChange={(selected) =>
                  setSelectOption(selected as "asc" | "desc")
                }
                options={sortOptions}
                label="Urutkan"
                flex="flex-row"
                labelClass="items-center gap-3"
              />
            </div>

            <div className="flex flex-col gap-5 flex-1">
              <CustomInputs
                label="Sort Field"
                placeholder="(opsional)"
                onChange={(val) => setSort(val)}
                helperText="x"
                helper={() => setSort("")}
                value={sort}
              />
              <CustomInputs
                placeholder=""
                label="Per Page"
                type="number"
                onChange={(val) => setItemsPerPage(Number(val) || 5)}
                value={itemsPerPage}
              />
            </div>
          </div>

          {loading ? (
            <CustomMainLoading
              variant="table"
              headerLines={3}
              contents="email"
              menuLines={itemsPerPage}
            />
          ) : (
            <>
              <div className="pt-5 min-h-[270px]">
                <CustomTable
                  headers={["Select", "Location ID", "Location Name"]}
                >
                  {paginatedLocations.length > 0 ? (
                    paginatedLocations.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-50 text-center"
                      >
                        <td>
                          <input
                            type="checkbox"
                            className="checkbox checkbox-error"
                            checked={selectedIds.includes(String(item.id))}
                            onChange={() =>
                              handleSelectLocation(String(item.id))
                            }
                          />
                        </td>
                        <td>{item.id}</td>
                        <td>{item.location}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={3}
                        className="text-center text-gray-500 py-4"
                      >
                        Tidak ada data ditemukan
                      </td>
                    </tr>
                  )}
                </CustomTable>
              </div>

              <CustomPagination
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                totalItems={filteredLocations.length}
                onPageChange={handlePageChange}
              />

              <div className="pt-5 flex gap-3 justify-end">
                <CustomButton
                  text="Add Location"
                  onClick={() => handleOpenModal("modal_register")}
                  className="btn-success"
                />
                <CustomButton
                  text="Update"
                  onClick={handlePrefillUpdate}
                  className="btn-info"
                />
                <CustomButton
                  text="Delete"
                  onClick={() => handleOpenModal("modal_delete")}
                  className="btn-error"
                />
              </div>

              {/* ===== MODALS ===== */}
              <div className="pt-5">
                <CustomModal
                  title="Register New Location"
                  id="modal_register"
                  confirmText="Register"
                  onSubmit={handleRegister}
                >
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="bg-gray-200 w-full rounded-md p-2"
                    placeholder="Location Name"
                  />
                </CustomModal>

                <CustomModal
                  title="Update Location"
                  id="modal_update"
                  confirmText="Update"
                  onSubmit={handleUpdate}
                >
                  <input
                    type="text"
                    placeholder="Update Location"
                    className="mb-4 w-full bg-gray-200 rounded-md p-2"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </CustomModal>

                <CustomModal
                  title="Delete Location"
                  id="modal_delete"
                  confirmText="Delete"
                  onSubmit={handleDelete}
                >
                  <p>Apakah anda yakin ingin menghapus lokasi yang dipilih?</p>
                </CustomModal>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
