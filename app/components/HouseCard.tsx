"use client";
import Link from "next/link";
import Image from "next/image";

// Define a specific prop type instead of using any
interface HouseCardProps {
  house: {
    _id: string;
    name: string;
    image?: string;
  };
}

export default function HouseCard({ house }: HouseCardProps) {
  return (
    <Link href={`/houses/${house._id}`}>
      <div className="border rounded-lg overflow-hidden hover:shadow-lg transition p-4">
        <Image
          src={house.image || "/placeholder.jpg"}
          alt={house.name}
          width={300}
          height={200}
          className="object-cover w-full h-48"
        />
        <h2 className="mt-2 text-xl font-semibold">{house.name}</h2>
      </div>
    </Link>
  );
}
