"use client";
import Link from "next/link";
import Image from "next/image";
import { IHouse } from "@/models/House";

// Define a specific prop type instead of using any
interface HouseCardProps {
  house: IHouse;
}

export default function HouseCard({ house }: HouseCardProps) {
  return (
    <Link href={`/houses/${house._id}`}>
      <div className="rounded shadow p-4">
        <Image
          src={house.image || "/placeholder.jpg"}
          alt={house.name}
          width={400}
          height={250}
          className="rounded object-cover w-full h-48"
          unoptimized // needed for base64 images
        />
        <h2 className="text-xl font-semibold mt-2">{house.name}</h2>
        <p className="text-sm text-gray-600">{house.city}</p>
      </div>
    </Link>
  );
}
