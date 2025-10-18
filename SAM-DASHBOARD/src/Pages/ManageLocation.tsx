import { useEffect, useState } from "react";
import CustomButton from "../components/CustomButton";
import CustomModal from "../components/CustomModal";
import CustomTable from "../components/CustomTable";
import { useLocationData } from "../hooks/useLocationHooks";
import { CustomInputs } from "@/components/CustomInputs";
import { CustomPagination } from "@/components/CustomPagination";
import { CustomSelects } from "@/components/CustomSelects";

export default function ManageLocation() {
  const {
    locations,
    fetchAllLocations,
    handleCreateLocation,
    handleUpdateLocation,
    handleDeleteLocation,
  } = useLocationData({});
  const [filter, setFilter] = useState("");
  const [location, setLocation] = useState<string>("");
  const [sort, setSort] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectOption, setSelectOption] = useState<string>("asc");
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [loading, setLoading] = useState<boolean>(false);

  const filteredLocation = (locations ?? [])
    .filter((item) =>
      (item.location ?? "").toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) =>
      selectOption === "asc"
        ? (a.id ?? 0) - (b.id ?? 0)
        : (b.id ?? 0) - (a.id ?? 0)
    );

  const paginatedUsers =
    filteredLocation &&
    filteredLocation!.slice(
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

  // Pagination
  const handlePageCHange = (page: number) => {
    setCurrentPage(page);
    console.log("Pindah ke halaman: ", page);
  };

  const handleRegister = async () => {
    if (!location) {
      alert("Lengkapi semua field!");
      return;
    }
    await handleCreateLocation({ value: location });
    handleCloseModal("modal_register");
  };

  const handleUpdate = async () => {
    if (selectedIds.length !== 1) {
      alert("Pilih tepat satu user untuk diupdate!");
      return;
    }
    const selectedId = selectedIds[0];
    const selectedLoc = locations?.find((d) => d.id === Number(selectedId));
    console.log(selectedLoc);

    try {
      setLoading(true);
      await handleUpdateLocation(selectedLoc!.id!, location);

      handleCloseModal("modal_update");
      fetchAllLocations();
      setSelectedIds([]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (selectedIds.length === 0) {
      alert("Pilih user yang ingin dihapus terlebih dahulu!");
      return;
    }
    try {
      setLoading(true);
      await handleDeleteLocation(Number(selectedIds));

      handleCloseModal("modal_delete");
      setSelectedIds([]);
      fetchAllLocations();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllLocations();
  }, []);

  const handleSelectOption = (selected: string) => {
    setSelectOption(selected);
  };

  const option = [
    {
      label: "Asc",
      value: "asc",
    },
    {
      label: "Desc",
      value: "desc",
    },
  ];

  const handlePrefillUpdate = () => {
    if (selectedIds.length !== 1) {
      alert("Pilih satu email untuk diupdate");
      return;
    }
    const selectedLoc = locations?.find((u) => u.id === Number(selectedIds[0]));
    if (!selectedLoc) return alert("User tidak ditemukan");
    setLocation(selectedLoc.location || "");
    handleOpenModal("modal_update");
  };

  return (
    <div className="flex gap-3">
      <div className="flex-1 text-sm text-black">
        <div className="flex items-center gap-5 justify-between p-3">
          <div className="flex flex-col gap-5 flex-1">
            <CustomInputs
              label="Filter"
              placeholder="Masukkan username"
              onChange={(val) => setFilter(val)}
              helperText="x"
              helper={() => setFilter("")}
              value={filter}
            />

            <CustomSelects
              value={option.find((opt) => opt.value === selectOption) || null}
              onChange={handleSelectOption}
              options={option}
              label="Sort"
              flex="flex-row"
              labelClass="items-center gap-3"
            />
          </div>
          <div className="flex flex-col gap-5 flex-1">
            <CustomInputs
              label="Sort"
              placeholder="Masukkan device portable"
              onChange={(val) => setSort(val)}
              helperText="x"
              helper={() => setSort("")}
              value={sort}
            />
            <CustomInputs
              label="Per Page"
              placeholder="Masukkan jumlah page"
              onChange={(val) => setItemsPerPage(Number(val))}
              value={Number(itemsPerPage)}
              type="number"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center h-64">
            <span className="loading loading-bars loading-xl text-blue-400 "></span>
            <p className="ml-3 text-gray-700 text-lg">
              Memuat data perangkat...
            </p>
          </div>
        ) : (
          <>
            <div className="pt-5 min-h-[270px] ">
              <CustomTable headers={["Select", "LocationId", "LocationName"]}>
                {paginatedUsers && paginatedUsers.length > 0 ? (
                  paginatedUsers.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 text-center">
                      <td>
                        <input
                          type="checkbox"
                          className="checkbox checkbox-error"
                          checked={selectedIds.includes(String(item.id!))}
                          onChange={() =>
                            handleSelectLocation(String(item.id!))
                          }
                        />
                      </td>
                      <td>{item.id}</td>
                      <td>{item.location}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center text-gray-500 py-4">
                      Tidak ada data ditemukan
                    </td>
                  </tr>
                )}
              </CustomTable>
            </div>

            <CustomPagination
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              totalItems={locations ? locations!.length : 0}
              onPageChange={handlePageCHange}
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

            <div className="pt-5">
              <CustomModal
                title="Register New Location"
                id="modal_register"
                confirmText="Register"
                onSubmit={handleRegister}
              >
                <div className="flex flex-col">
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="bg-gray-200 w-full rounded-md p-2"
                    placeholder="Location"
                  />
                </div>
              </CustomModal>

              <CustomModal
                title="Update Location"
                id="modal_update"
                confirmText="Update"
                onSubmit={handleUpdate}
              >
                <div className="flex flex-col">
                  <input
                    type="text"
                    placeholder="Update Location"
                    className="mb-4 w-full bg-gray-200 rounded-md p-2 "
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </CustomModal>

              <CustomModal
                title="Delete Location"
                id="modal_delete"
                confirmText="Delete"
                onSubmit={handleDelete}
              >
                <div className="flex flex-col">
                  <p className="">
                    Apakah anda yakin ingin menghapus data ini?
                  </p>
                </div>
              </CustomModal>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
