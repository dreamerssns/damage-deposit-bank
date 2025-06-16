import React from "react";
import connectDB from "@/utils/db";
import HouseModel from "@/models/House";
import HouseCard from "@/app/components/HouseCard";
import { HouseType } from "./types";

export default async function HousesPage() {
  await connectDB();

  // Use lean generics or cast to ensure TS knows this is HouseType[]
  const houses = await HouseModel.find({ isPublished: true }).lean<
    HouseType[]
  >();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {houses.length > 0 ? (
        houses.map((h) => <HouseCard key={h._id} house={h} />)
      ) : (
        <p className="col-span-full text-center text-lg">
          No houses available yet.
        </p>
      )}
    </div>
  );
}
