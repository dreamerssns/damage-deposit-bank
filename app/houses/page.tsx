import React from "react";
import connectDB from "@/utils/db";
import HouseModel from "@/models/House";
import HouseCard from "@/app/components/HouseCard";
import { IHouse } from "@/models/House";
import { serializeDoc } from "@/utils/serializeDoc";

export default async function HousesPage() {
  await connectDB();

  // Fetch published houses as plain JS objects
  const rawHouses = await HouseModel.find({ isPublished: true }).lean<
    IHouse[]
  >();

  // Serialize ObjectId and Date fields to primitives
  const serializedHouses = serializeDoc(rawHouses);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {serializedHouses.length > 0 ? (
        serializedHouses.map((h: IHouse) => {
          return h._id ? <HouseCard key={h._id.toString()} house={h} /> : null;
        })
      ) : (
        <p className="col-span-full text-center text-lg">
          No houses available yet.
        </p>
      )}
    </div>
  );
}
