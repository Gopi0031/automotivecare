import { Suspense } from "react";
import SpecialServicesClient from "./SpecialServicesClient";

export default function Page() {
  return (
    <Suspense fallback={
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">
          Loading Special Services...
        </div>
      </div>
    }>
      <SpecialServicesClient />
    </Suspense>
  );
}