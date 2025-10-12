import React from "react";

// interface CustomCardProps {
//   title?: string;
//   data?: string;
//   className?: string;
// }

export default function CustomCard() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {/* <div className={className}>
         <h2 className={className}>{title}</h2>
         <p className={className}>{data}</p>
    </div> */}

      <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
        <h2 className="text-lg font-semibold text-gray-700">Storage</h2>
        <p className="text-3xl font-bold text-blue-600 mt-2">0</p>
      </div>

      <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
        <h2 className="text-lg font-semibold text-gray-700">Total Record</h2>
        <p className="text-3xl font-bold text-red-600 mt-2">0</p>
      </div>

      <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
        <h2 className="text-lg font-semibold text-gray-700">Average Speed</h2>
        <p className="text-3xl font-bold text-green-600 mt-2">0 km/h</p>
      </div>

      <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
        <h2 className="text-lg font-semibold text-gray-700">Over Speed</h2>
        <p className="text-3xl font-bold text-orange-500 mt-2">0 km/h</p>
      </div>
    </div>
  );
}
