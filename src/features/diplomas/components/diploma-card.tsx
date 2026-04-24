import Link from "next/link";
import { IDiploma } from "../types/diploma";

interface DiplomaCardProps {
  diploma: IDiploma;
}

const DiplomaCard = ({ diploma }: DiplomaCardProps) => {
  return (
    <Link
      href={`/diplomas/${diploma.id}`}
      className="group rounded-lg border bg-white p-5 shadow-sm flex flex-col gap-3 hover:shadow-md transition-shadow"
    >
      {diploma.image && (
        <img
          src={diploma.image}
          alt={diploma.title}
          className="h-40 w-full rounded object-cover"
        />
      )}
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold group-hover:text-blue-600 transition-colors">
          {diploma.title}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-3">{diploma.description}</p>
      </div>
      <p className="text-xs text-gray-400">
        {new Date(diploma.createdAt).toLocaleDateString()}
      </p>
    </Link>
  );
};

export default DiplomaCard;
