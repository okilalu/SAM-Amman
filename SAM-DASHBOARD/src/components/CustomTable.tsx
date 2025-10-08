import React from "react";

type CustomTableProps = {
  headers: string[];
  children: React.ReactNode;
};
export default function CustomTable({ headers, children }: CustomTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="table bg-white shadow rounded-2xl">
        <thead className="text-black bg-gray-200 text-center">
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
