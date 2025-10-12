import React, { useState } from "react";
import CustomGrafik from "../components/CustomGrafik";
import CustomCard from "../components/CustomCard";

export default function Dashboard() {
  return (
    <div className="p-16 flex gap-3 min-h-screen pt-7 pl-72 bg-gray-100 ">
      <div className="flex-1 p-10 pt-12 text-sm text-black">
        {/* Breadcrumbs */}
        <div className="breadcrumbs bg-gray-200 p-3">
          <div className="divider divider-horizontal" />
          <ul>
            <li>
              <a href="#" className="text-blue-600">
                Home
              </a>
            </li>
            <li>
              <a href="#">Dashboard</a>
            </li>
          </ul>
        </div>

        <h2 className="text-3xl font-bold mb-6 text-gray-800 pt-5">
          Dashboard
        </h2>

        {/* Statistik Card */}
        <CustomCard />

        {/* Grafik Pelanggaran */}
        <div className="mb-10">
          <CustomGrafik />
        </div>
        <div className="mb-10">
          <CustomGrafik />
        </div>
      </div>
    </div>
  );
}
