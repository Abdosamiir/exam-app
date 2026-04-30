import Link from "next/link";
import { IDiploma } from "../types/diploma";
import Image from "next/image";

interface DiplomaCardProps {
  diploma: IDiploma;
  href?: string;
}

const DiplomaCard = ({
  diploma,
  href = `/diplomas/${diploma.id}`,
}: DiplomaCardProps) => {
  return (
    <Link
      href={href}
      className="group relative rounded-none border bg-white h-120 shadow-sm flex flex-col gap-3 hover:shadow-md transition-shadow overflow-hidden"
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
      {!diploma.image && (
        <div className="h-full w-full bg-gradient-to-br from-blue-50 via-white to-blue-100" />
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
