import React from "react";

interface CustomCardProps {
  title: string;
  value: number | string;
  color?: string; // warna teks value
  unit?: string;
  className?: string; // untuk tambahan style custom
}

export default function CustomCard({
  title,
  value,
  color = "text-blue-600",
  unit = "",
  className = "",
}: CustomCardProps) {
  return (
    <div
      className={`bg-white rounded-xl shadow p-6 hover:shadow-lg transition ${className}`}
    >
      <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
      <p className={`text-3xl font-bold mt-2 ${color}`}>
        {value} {unit}
      </p>
    </div>
    // <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

    // </div>
  );
}
