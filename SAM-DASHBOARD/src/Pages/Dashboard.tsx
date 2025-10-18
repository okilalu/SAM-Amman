import CustomGrafik from "../components/CustomGrafik";
import CustomCard from "../components/CustomCard";

export default function Dashboard() {
  return (
    <div className="flex gap-3">
      <div className="flex-1 text-sm text-black">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <CustomCard
            title="Storage"
            value={85}
            color="text-blue-600"
            unit="%"
          />
          <CustomCard title="Total Record" value={1250} color="text-red-600" />
          <CustomCard
            title="Average Speed"
            value={43}
            color="text-green-600"
            unit="km/h"
          />
          <CustomCard
            title="Over Speed"
            value={15}
            color="text-orange-500"
            unit="km/h"
          />
        </div>

        <div className="mb-10">
          <CustomGrafik />
        </div>
      </div>
    </div>
  );
}
