import React from "react";
import connectDB from "@/utils/db";
import HouseModel from "@/models/House";
import SubjectModel from "@/models/Subject";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { SubjectType, HouseType } from "../types";

export default async function HouseDetailPage({
  params,
}: {
  params: { id: string };
}) {
  await connectDB();

  // Fetch the house and assert its type
  const house = await HouseModel.findById(params.id).lean<HouseType | null>();
  if (!house) notFound();

  // Fetch subjects for this house
  const subjects = await SubjectModel.find({ house: params.id }).lean<
    SubjectType[]
  >();

  return (
    <div className="p-6">
      <Image
        src={house.image || "/placeholder.jpg"}
        alt={house.name}
        width={600}
        height={400}
        className="object-cover w-full h-64 rounded"
      />
      <h1 className="text-3xl font-bold mt-4">{house.name}</h1>
      <p className="mt-2">{house.description}</p>
      <p className="mt-2 font-medium">
        {house.address}, {house.city}
      </p>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold">Subjects</h2>
        {subjects.map((sub) => (
          <Link
            key={sub._id}
            href={`/houses/${params.id}/subjects/${sub._id}`}
            className="block py-2 hover:underline"
          >
            {sub.title}
          </Link>
        ))}
      </section>

      {/* TODO: integrate Chat component for message threads and approval UI */}
    </div>
  );
}
