// app/houses/[id]/page.tsx
import HouseModel from "@/models/House";
import SubjectModel from "@/models/Subject";
import connectDB from "@/utils/db";
import { serializeDoc } from "@/utils/serializeDoc";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HouseType, SubjectType } from "../types";
import CreateSubjectForm from "@/app/components/CreateSubjectForm";
import AdminEditLink from "@/app/components/AdminEditLink";
interface HouseDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function HouseDetailPage({
  params,
}: HouseDetailPageProps) {
  const { id: houseId } = await params;
  await connectDB();
  // Fetch the house and assert its type
  const house = await HouseModel.findById(houseId).lean<HouseType | null>();
  if (!house) notFound();

  // Fetch subjects for this house
  const subjects = await SubjectModel.find({ house: houseId })
    .populate({
      path: "createdBy",
      select: "firstName lastName avatarUrl email role", // select only the fields you want
    })
    .lean<SubjectType[]>();

  // Serialize before rendering/passing to any client component
  const serializedHouse = serializeDoc(house);
  const serializedSubjects = serializeDoc(subjects);

  return (
    <div className="p-6">
      <AdminEditLink houseId={houseId} />
      <Image
        src={serializedHouse.image || "/placeholder.jpg"}
        alt={serializedHouse.name}
        width={600}
        height={400}
        className="object-cover w-full h-64 rounded"
        unoptimized
      />
      <h1 className="text-3xl font-bold mt-4">{serializedHouse.name}</h1>
      <p className="mt-2">{serializedHouse.description}</p>
      <p className="mt-2 font-medium">
        {serializedHouse.address}, {serializedHouse.city}
      </p>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold">Chat Rooms</h2>
        {serializedSubjects.map((sub: SubjectType) => (
          <Link
            key={sub._id}
            href={`/houses/${houseId}/subjects/${sub._id}`}
            className="block py-2 border-b border-gray-300 hover:border-primary hover:text-primary transition duration-150"
          >
            {sub.title} - Started by{" "}
            <span className="inline-block px-2 py-1 ml-1 rounded-full bg-accent text-white text-xs">
              {sub.createdBy.role}
            </span>{" "}
            {sub.createdBy.firstName} {sub.createdBy.lastName}
            {sub.createdBy.avatarUrl && (
              <Image
                src={sub.createdBy.avatarUrl}
                alt={`${sub.createdBy.firstName} avatar`}
                width={30}
                height={30}
                className="inline-block ml-2 rounded-full"
                unoptimized
              />
            )}
          </Link>
        ))}
      </section>

      <CreateSubjectForm houseId={houseId} />
    </div>
  );
}
