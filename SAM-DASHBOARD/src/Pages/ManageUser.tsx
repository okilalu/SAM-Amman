import { useEffect, useState } from "react";
import CustomTable from "../components/CustomTable";
import CustomButton from "../components/CustomButton";
import CustomModal from "../components/CustomModal";
import { useUserData } from "../hooks/useUserHooks";
import { CustomInputs } from "@/components/CustomInputs";
import { CustomSelects } from "@/components/CustomSelects";
import { CustomPagination } from "@/components/CustomPagination";
import { CustomAlert } from "@/components/CustomAlert";
import { MdErrorOutline } from "react-icons/md";
import { FaCheckCircle, FaEye, FaEyeSlash } from "react-icons/fa";
import { IoWarningOutline } from "react-icons/io5";

export default function ManageUser() {
  const {
    allUsers,
    validateAllUsers,
    registerUser,
    updateUsers,
    deleteUsers,
    success,
    error,
    setError,
    setSuccess,
  } = useUserData({});
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [credential, setCredential] = useState("");
  const [filter, setFilter] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [loading, setLoading] = useState<boolean>(false);
  const [selectOption, setSelectOption] = useState<string>("asc");
  const [warning, setWarning] = useState<string | null>(null);
  const [show, setShow] = useState("false");

  const handleShowPass = () => {
    setShow(!show);
  };

  const filteredUsers = (allUsers ?? [])
    .filter((u) =>
      (u.username ?? "").toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) =>
      selectOption === "asc"
        ? (a.username ?? "").localeCompare(b.username ?? "")
        : (b.username ?? "").localeCompare(a.username ?? "")
    );

  const paginatedUsers = filteredUsers.slice(
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

  const isValid =
    username.length >= 8 &&
    username.length <= 30 &&
    /^[A-Za-z][A-Za-z0-9-]*$/.test(username);

  // 🔸 Checkbox handler
  const handleSelectUser = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Pagination
  const handlePageCHange = (page: number) => {
    setCurrentPage(page);
  };

  // create
  const handleRegister = async () => {
    if (!username || !password || !credential) {
      setWarning("Lengkapi semua field!");
      return;
    }

    if (password.length < 8) {
      setWarning("Password Harus memiliki minimal 8 karakter");
      return;
    }

    try {
      setLoading(true);
      await registerUser({
        username,
        password,
        credential,
      });
      handleCloseModal("modal_register");

      setUsername("");
      setPassword("");
      setCredential("");
      validateAllUsers();
    } catch (error) {
      console.error("Gagal register user", error);
    } finally {
      setLoading(false);
    }
  };

  // Update
  const handleUpdate = async () => {
    if (selectedIds.length !== 1) {
      setWarning("Choose at least one user");
      return;
    }
    const selectedId = selectedIds[0];
    const selectedUser = allUsers?.find((u) => u.userId === selectedId);

    if (!selectedUser) {
      setWarning("User not found");
      return;
    }

    if (password.length < 8) {
      setWarning("Password Harus memiliki minimal 8 karakter");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        username,
        // password,
        credential,
      };
      await updateUsers(String(selectedUser.userId!), payload);

      handleCloseModal("modal_update");
      await validateAllUsers();
      setSelectedIds([]);
    } catch (error) {
      // alert("Gagal memperbarui user");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Delete
  const handleDelete = async () => {
    if (selectedIds.length === 0) {
      setWarning("Choose at least one user");
      return;
    }
    try {
      setLoading(true);
      await deleteUsers({ id: String(selectedIds) });

      setSuccess("Successfuly deleted user");
      handleCloseModal("modal_delete");
      setSelectedIds([]);
      await validateAllUsers();
    } catch (error) {
      setError("Failed to deleted user");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await validateAllUsers();
      setLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (warning) {
      const timer = setTimeout(() => setWarning(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [warning]);

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

  const optionCredentials = [
    {
      label: "Admin",
      value: "Admin",
    },
    {
      label: "Operator",
      value: "Operator",
    },
  ];

  const handlePrefillUpdate = () => {
    if (selectedIds.length !== 1) {
      setWarning("Choose at least one user");
      return;
    }
    const selectedUser = allUsers?.find((u) => u.userId === selectedIds[0]);
    if (!selectedUser) return;

    setUsername(selectedUser.username || "");
    setPassword(selectedUser.password || "");
    setCredential(selectedUser.credential || "");
    handleOpenModal("modal_update");
  };

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
          <div className="flex flex-col gap-5 flex-1">
            <CustomInputs
              label="Filter users"
              placeholder="Cari users"
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

          {loading ? (
            <div className="flex flex-col justify-center items-center h-64">
              <span className="loading loading-bars loading-xl text-blue-400"></span>
              <p className="ml-3 text-gray-700 text-lg">
                Memuat data pengguna...
              </p>
            </div>
          ) : (
            <>
              <div className="pt-5 min-h-[270px] ">
                <CustomTable
                  headers={[
                    "Select",
                    "UserId",
                    "Username",
                    "Password",
                    "Privilage",
                  ]}
                >
                  {paginatedUsers.length > 0 ? (
                    paginatedUsers.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 text-center">
                        <td>
                          <input
                            type="checkbox"
                            className="checkbox checkbox-error"
                            checked={selectedIds.includes(item.userId!)}
                            onChange={() => handleSelectUser(item.userId!)}
                          />
                        </td>
                        <td>{idx + 1}</td>
                        <td>{item.username}</td>
                        <td>{item.password}</td>
                        <td>{item.credential}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
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
                totalItems={allUsers ? allUsers!.length : 0}
                onPageChange={handlePageCHange}
              />

              <div className="pt-5 flex gap-3 justify-end">
                <CustomButton
                  text="Add User"
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
                  title="Register User"
                  id="modal_register"
                  confirmText="Register"
                  onSubmit={handleRegister}
                >
                  <div className="flex flex-col">
                    <label className="input validator w-full bg-gray-200 rounded-md p-2">
                      <input
                        type="text"
                        placeholder="Enter Username"
                        required
                        minLength={8}
                        maxLength={30}
                        title="Only letters, numbers or dash"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={`transition-all duration-300 ${
                          username && !isValid
                            ? "border-red-400 focus:ring-red-300"
                            : "border-gray-300"
                        }`}
                      />
                    </label>
                    <p
                      className={`text-xs mt-1 transition-all duration-300 ${
                        username && !isValid
                          ? "text-red-600 opacity-100 translate-y-0"
                          : "opacity-0 -translate-y-2"
                      }`}
                    >
                      Must be 8–30 characters and contain only letters, numbers,
                      or dashes.
                    </p>

                    <div className="mb-2">
                      <div className="flex">
                        <input
                          type={`${show ? "password" : "text"}`}
                          placeholder="Enter Password (min 8 karakter)"
                          className={`mb-2 w-full rounded-md p-2 ${
                            password.length > 0 && password.length < 8
                              ? "bg-red-100 "
                              : "bg-gray-200"
                          }`}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        {password.length > 0 && (
                          <button
                            type="button"
                            onClick={handleShowPass}
                            className="rounded-lg text-gray-700 px-3 py-2 items-center"
                          >
                            {show ? <FaEye /> : <FaEyeSlash />}
                          </button>
                        )}
                      </div>
                    </div>
                    {password.length > 0 && password.length < 8 && (
                      <span className="text-red-500 text-sm mb-2 -mt-2">
                        Password harus memiliki minimal 8 karakter
                      </span>
                    )}

                    <CustomSelects
                      value={
                        optionCredentials.find(
                          (opt) => opt.value === credential
                        ) || null
                      }
                      onChange={(val) => setCredential(val)}
                      options={optionCredentials}
                      flex="flex-row"
                      background="bg-gray-200 border-none text-black"
                    />
                  </div>
                </CustomModal>

                {/* UPDATE MODAL */}
                <CustomModal
                  title="Update User"
                  id="modal_update"
                  confirmText="Update"
                  onSubmit={handleUpdate}
                >
                  <div className="flex flex-col">
                    <label className="input validator w-full mb-2 bg-gray-200 rounded-md p-2">
                      <input
                        type="text"
                        placeholder="Enter Username"
                        required
                        pattern="[A-Za-z][A-Za-z0-9\-]*"
                        minLength={8}
                        maxLength={30}
                        title="Only letters, numbers or dash"
                        className="mb-4 w-full bg-gray-200 rounded-md p-2"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </label>
                    {username.length < 8 && (
                      <p className="validator-hint mb-2">
                        Must be 8 to 30 characters containing only letters,
                        numbers, or dash
                      </p>
                    )}
                    {/* <input
                      type="password"
                      placeholder="Enter Password (min 8 karakter)"
                      className={`mb-2 w-full rounded-md p-2 ${
                        password.length > 0 && password.length < 8
                          ? "bg-red-100 border border-red-500"
                          : "bg-gray-200"
                      }`}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    {password.length > 0 && password.length < 8 && (
                      <span className="text-red-500 text-sm mb-2">
                        Password harus memiliki minimal 8 karakter
                      </span>
                    )} */}
                    <CustomSelects
                      value={
                        optionCredentials.find(
                          (opt) => opt.value === credential
                        ) || null
                      }
                      onChange={(val) => setCredential(val)}
                      options={optionCredentials}
                      flex="flex-row"
                      background="bg-gray-200 border-none text-black"
                    />
                  </div>
                </CustomModal>

                {/* DELETE MODAL */}
                <CustomModal
                  title="Delete User"
                  id="modal_delete"
                  confirmText="Delete"
                  onSubmit={handleDelete}
                >
                  <div className="flex flex-col px-3 py-2">
                    <p>
                      Apakah anda yakin ingin menghapus{" "}
                      <strong>{selectedIds.length}</strong> user?
                    </p>
                  </div>
                </CustomModal>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
