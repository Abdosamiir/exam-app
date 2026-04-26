import Link from "next/link";
import { IDiploma } from "../types/diploma";
import Image from "next/image";

interface DiplomaCardProps {
  diploma: IDiploma;
}

const DiplomaCard = ({ diploma }: DiplomaCardProps) => {
  return (
    <Link
      href={`/diplomas/${diploma.id}`}
      className="group relative rounded-none border bg-white h-120  shadow-sm flex flex-col gap-3 hover:shadow-md transition-shadow"
    >
      {diploma.image && (
        <Image
          src={diploma.image}
          alt={diploma.title}
          className="w-full h-full object-cover"
          width={400}
          height={260}
        />
      )}
      <div className="flex flex-col gap-1 absolute bottom-0 left-0 right-0 px-5 pb-5 pt-4 bg-blue-600/75 text-white overflow-hidden max-h-25 group-hover:max-h-40 transition-all duration-300">
        <h3 className="text-lg font-semibold ">
          {diploma.title}
        </h3>
        <p className="text-sm line-clamp-1 text-ellipsis group-hover:line-clamp-none " >
          {diploma.description}
        </p>
      </div>
    </Link>
  );
};

export default DiplomaCard;
