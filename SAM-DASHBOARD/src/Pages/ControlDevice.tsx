import { useEffect, useState } from "react";
import CustomModal from "../components/CustomModal";
import CustomTable from "../components/CustomTable";
import { useDeviceData } from "../hooks/useDeviceHooks";
import { useUserData } from "../hooks/useUserHooks";
import { useUserDeviceData } from "../hooks/useUserDeviceHooks";
import { CustomPagination } from "@/components/CustomPagination";
import { CustomInputs } from "@/components/CustomInputs";
import { CustomSelects } from "@/components/CustomSelects";
import { CustomAlert } from "@/components/CustomAlert";
import { MdErrorOutline } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";
import { IoWarningOutline } from "react-icons/io5";
import { CustomButton } from "@/components/CustomButton";
import { CustomMainLoading } from "@/components/CustomMainLoading";

export default function ControlDevice() {
  const { devices, fetchAllDevices } = useDeviceData({});
  const { allUsers, validateAllUsers } = useUserData({});
  const {
    handleAddPermission,
    handleDeletePermission,
    error,
    success,
    setError,
    setSuccess,
  } = useUserDeviceData({});

  const [userId, setUserId] = useState<string>("");
  const [deviceId, setDeviceId] = useState<string[]>([]);
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("");
  // const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [selectOption, setSelectOption] = useState<string>("asc");
  const [warning, setWarning] = useState<string | null>(null);
  const [isDeviceLoading, setIsDeviceLoading] = useState(true);
  const [isUserLoading, setIsUserLoading] = useState(true);

  // Filter & sort
  const filteredUsers =
    allUsers
      ?.filter((u) =>
        (u.username ?? "").toLowerCase().includes(filter.toLowerCase())
      )
      .sort((a, b) =>
        selectOption === "asc"
          ? (a.username ?? "").localeCompare(b.username ?? "")
          : (b.username ?? "").localeCompare(a.username ?? "")
      ) || [];

  const filteredDevices =
    devices
      ?.filter((d) =>
        (d.samId ?? "").toLowerCase().includes(filter.toLowerCase())
      )
      .sort((a, b) =>
        selectOption === "asc"
          ? (a.samId ?? "").localeCompare(b.samId ?? "")
          : (b.samId ?? "").localeCompare(a.samId ?? "")
      ) || [];

  const handlePageChange = (page: number) => setCurrentPage(page);

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenModal = (id: string) =>
    (document.getElementById(id) as HTMLDialogElement)?.showModal();

  const handleCloseModal = (id: string) =>
    (document.getElementById(id) as HTMLDialogElement)?.close();

  const handleSelectDevice = (id: string) => {
    setDeviceId((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handlePermission = async () => {
    if (!userId) {
      setWarning("Choose a user first!");
      return;
    }
    if (deviceId.length === 0) {
      setWarning("Choose at least one device!");
      return;
    }
    setIsProcessing(true);
    try {
      await handleAddPermission({ userId, deviceId });
      setSuccess("Permissions created successfully");
      handleCloseModal("modal_register");
      setDeviceId([]);
      setUserId("");
    } catch (error) {
      setError("Failed to add permissions" + error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRevokePermission = async () => {
    if (!userId) {
      setWarning("Choose a user first!");
      return;
    }
    if (deviceId.length === 0) {
      setWarning("Choose at least one device!");
      return;
    }
    setIsProcessing(true);
    try {
      await handleDeletePermission({ userId, deviceId });
      setSuccess("Successfully revoked permissions");
      handleCloseModal("modal_delete");
      setDeviceId([]);
      setUserId("");
    } catch (error) {
      setError("Failed to revoke permissions" + error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Load data
  useEffect(() => {
    const loadDevices = async () => {
      setIsDeviceLoading(true);
      try {
        await fetchAllDevices();
      } catch {
        setIsDeviceLoading(false);
      } finally {
        setIsDeviceLoading(false);
      }
    };
    loadDevices();
  }, []);

  useEffect(() => {
    const loadUsers = async () => {
      setIsUserLoading(true);
      try {
        await validateAllUsers();
      } catch {
        setIsUserLoading(false);
      } finally {
        setIsUserLoading(false);
      }
    };
    loadUsers();
  }, []);

  useEffect(() => {
    if (warning) {
      const timer = setTimeout(() => setWarning(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [warning]);

  const handleSelectOption = (selected: string) => setSelectOption(selected);

  const option = [
    { label: "Asc", value: "asc" },
    { label: "Desc", value: "desc" },
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

      <div className="flex gap-3 text-sm text-black overflow-auto">
        <div className="flex-1 bg-white shadow rounded-sm p-3 pt-0">
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

          {isUserLoading && isDeviceLoading ? (
            <CustomMainLoading
              variant="table"
              headerLines={3}
              contents="user"
              menuLines={itemsPerPage}
            />
          ) : (
            <>
              <div className="pt-5 min-h-[250px]">
                <CustomTable headers={["Select", "UserId", "UserName"]}>
                  {paginatedUsers.length > 0 ? (
                    paginatedUsers.map((item, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-gray-50 text-center cursor-pointer"
                      >
                        <td>
                          <input
                            type="checkbox"
                            className="checkbox checkbox-neutral"
                            checked={userId === item.userId}
                            onChange={() =>
                              setUserId((prev) =>
                                prev === item.userId ? "" : item.userId!
                              )
                            }
                          />
                        </td>
                        <td>{idx + 1}</td>
                        <td>{item.username}</td>
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
                totalItems={allUsers?.length || 0}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>

        <div className="flex-1 bg-white shadow rounded-sm p-3 pt-0">
          {isDeviceLoading && isUserLoading ? (
            <CustomMainLoading
              variant="table"
              headerLines={3}
              contents="device"
              menuLines={itemsPerPage}
            />
          ) : (
            <>
              <div className="min-h-[250px]">
                <CustomTable
                  headers={["Select", "PortableDeviceId", "LocationName"]}
                >
                  {filteredDevices.length > 0 ? (
                    filteredDevices.map((item, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-gray-50 text-center cursor-pointer"
                      >
                        <td>
                          <input
                            type="checkbox"
                            className="checkbox checkbox-error"
                            checked={deviceId.includes(item.deviceId!)}
                            onChange={() => handleSelectDevice(item.deviceId!)}
                          />
                        </td>
                        <td>{item.samId}</td>
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

              <div className="pt-5 flex gap-3 justify-end">
                <CustomButton
                  text="Add Access"
                  onClick={() => handleOpenModal("modal_register")}
                  className="btn-success"
                  disabled={isProcessing}
                />
                <CustomButton
                  text="Delete"
                  onClick={() => handleOpenModal("modal_delete")}
                  className="btn-error"
                  disabled={isProcessing}
                />
              </div>

              {/* === MODALS === */}
              <CustomModal
                title="Add Access Control"
                id="modal_register"
                confirmText={isProcessing ? "Processing..." : "OK"}
                onSubmit={handlePermission}
              >
                <div className="px-3 py-2">
                  <p>
                    Apakah anda akan memberikan akses ke user{" "}
                    <strong>{userId}</strong> untuk device{" "}
                    <strong>{deviceId.join(", ")}</strong>?
                  </p>
                </div>
              </CustomModal>

              <CustomModal
                title="Delete Access Control"
                id="modal_delete"
                confirmText={isProcessing ? "Processing..." : "Delete"}
                onSubmit={handleRevokePermission}
              >
                <div className="px-3 py-2">
                  <p>
                    Apakah anda akan mencabut akses user{" "}
                    <strong>{userId}</strong> dari device{" "}
                    <strong>{deviceId.join(", ")}</strong>?
                  </p>
                </div>
              </CustomModal>
            </>
          )}
        </div>
      </div>
    </>
  );
}
