import React, { useState } from "react";
import CustomInput from "../components/CustomInput";
import Pagination from "../components/Pagination";
import CustomButton from "../components/CustomButton";
import CustomModal from "../components/CustomModal";
import CustomTable from "../components/CustomTable";

export default function ControlDevice() {
  const dummyData = [
    {
      PortableDeviceId: "SAM01",
      LocationName: "Supra",
    },
    {
      PortableDeviceId: "SAM02",
      LocationName: "KM 01",
    },
    {
      PortableDeviceId: "SAM03",
      LocationName: "Mataram",
    },
  ];
  const dummyDataUser = [
    {
      UserId: "1",
      UserName: "admin",
    },
    {
      UserId: "2",
      UserName: "guest",
    },
    {
      UserId: "3",
      UserName: "admin",
    },
    {
      UserId: "4",
      UserName: "safety_speed",
    },
    {
      UserId: "5",
      UserName: "safety_ops",
    },
  ];

  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("");
  const [sortDirection, SetSortDirection] = useState<"asc" | "desc">("asc");
  const [perPage, setPerPage] = useState(10);

  const filteredDevice = dummyDataUser
    .filter((item) => item.UserId.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) =>
      sortDirection === "asc"
        ? a.UserId.localeCompare(b.UserId)
        : b.UserId.localeCompare(a.UserId)
    );

  const handleOpenModalAdd = ({ id }: { id: string }) => {
    document.getElementById(id)!.showModal();
  };
  const handleOpenModalUpdate = ({ id }: { id: string }) => {
    document.getElementById(id)!.showModal();
  };
  const handleOpenModalDelete = ({ id }: { id: string }) => {
    document.getElementById(id)!.showModal();
  };
  return (
    <div className="p-16 flex gap-3 min-h-screen pt-7 pl-72 bg-gray-100 ">
      <div className="flex-1 p-10 pt-12  text-sm text-black">
        <div className="breadcrumbs bg-gray-200 p-3">
          <div className="divider divider-horizontal" />
          <ul>
            <li>
              <a href="" className="text-blue-600">
                Home
              </a>
            </li>
            <li>
              <a href="">Control Device</a>
            </li>
          </ul>
        </div>
        <h2 className="text-3xl font-bold mb-6 text-gray-800 pt-5">
          Control Device
        </h2>

        <div className="pt-5 bg-white shadow  rounded-sm p-3">
          <CustomInput
            filter={filter}
            setFilter={setFilter}
            sort={sort}
            setSort={setSort}
            sortDirection={sortDirection}
            setSortDirection={SetSortDirection}
            perPage={perPage}
            setPerPage={setPerPage}
            labels={{
              filter: "Filter",
              sort: " Sort",
              sortDirection: "Sort Direction",
              perPage: "Per Page",
            }}
            placeholder={{
              filter: "Masukkan ID Device",
              sort: "Contoh: PortableDeviceId",
            }}
          />

          <div className="pt-5">
            <CustomTable headers={["Select", "UserId", "UserName"]}>
              {filteredDevice.length > 0 ? (
                filteredDevice.map((item) => (
                  <tr className="hover:bg-gray-50 text-center">
                    <td>
                      <input
                        type="checkbox"
                        className="checkbox checkbox-neutral"
                        // checked={selectedIds.includes(item.id)}
                        // onChange={() => handleSelectUser(item.id)}
                      />
                    </td>
                    <td>{item.UserId}</td>
                    <td>{item.UserName}</td>
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

            <Pagination />
          </div>
        </div>

        <div className="p-3 mt-6">
          <CustomTable headers={["Select", "PortableDeviceId", "LocationName"]}>
            {dummyData.length > 0 ? (
              dummyData.map((item) => (
                <tr className="hover:bg-gray-50 text-center">
                  <td>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-error"
                      // checked={selectedIds.includes(item.id)}
                      // onChange={() => handleSelectUser(item.id)}
                    />
                  </td>
                  <td>{item.PortableDeviceId}</td>
                  <td>{item.LocationName}</td>
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

          <div className="pt-5 flex gap-3 justify-end">
            <CustomButton
              text="Add Location"
              onClick={() => handleOpenModalAdd({ id: "my_modal_1" })}
              className="btn-success"
            />
            <CustomButton
              text="Delete"
              onClick={() => handleOpenModalDelete({ id: "my_modal_3" })}
              className="btn-error"
            />
          </div>

          <div>
            <CustomModal title="Register New Location" id="my_modal_1">
              <div className="flex flex-col">
                <input
                  type="text"
                  name=""
                  id=""
                  placeholder="Enter You Username"
                  className="mb-4 w-full bg-gray-200 rounded-md p-2 "
                />
                <input
                  type="text"
                  name=""
                  id=""
                  placeholder="Enter You Password"
                  className="mb-4 w-full bg-gray-200 rounded-md p-2 "
                />

                <div className="dropdown dropdown-center">
                  <input
                    type="text"
                    placeholder="Choose One Options"
                    className="w-full bg-gray-200 rounded-md p-2"
                  />
                  <ul className="dropdown-content menu z-1 w-full p-2 shadow-sm rounded-b-md bg-gray-50">
                    <li>
                      <a>Admin</a>
                    </li>
                    <li>
                      <a>Guest</a>
                    </li>
                  </ul>
                </div>
              </div>
            </CustomModal>
            <CustomModal title="Delete" id="my_modal_3">
              <div className="flex flex-col">
                <p className="">Apakah anda yakin ingin menghapus data ini?</p>
                <div className="flex gap-3 justify-end mt-6">
                  <CustomButton
                    text="Hapus"
                    className="btn-error"
                    onClick={() => handleOpenModalUpdate({ id: "my_modal_2" })}
                  />
                  <CustomButton
                    text="Cancel"
                    className="btn-active"
                    onClick={() => handleOpenModalUpdate({ id: "my_modal_2" })}
                  />
                </div>
              </div>
            </CustomModal>
          </div>
        </div>
      </div>
    </div>
  );
}
