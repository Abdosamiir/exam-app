import {
  Brain,
  BookOpenCheck,
  FolderCode,
  RectangleEllipsis,
} from "lucide-react";

const Reusable = () => {
  return (
    <div className="text-blue-600">
      {/* logo  */}
      <div className="flex items-center gap-2 font-bold">
        <FolderCode />
        Exam App
      </div>
      <h1 className="text-black">
        Empower your learning journey with our smart exam platform.
      </h1>

      <div className="">
        <div className="flex  items-start gap-4">
          <Brain />
          <div className="flex flex-col gap-2">
            <h3> Tailored Diplomas</h3>
            <p className="text-black">
              Choose from specialized tracks like Frontend, Backend, and Mobile
              Development.
            </p>
          </div>
        </div>
        <div className="flex  items-start gap-4">
          <BookOpenCheck />
          <div className="flex flex-col gap-2">
            <h3>Focused Exams</h3>
            <p className="text-black">
              Access topic-specific tests including HTML, CSS, JavaScript, and
              more.
            </p>
          </div>
        </div>
        <div className="flex  items-start gap-4">
          <RectangleEllipsis />
          <div className="flex flex-col gap-2">
            <h3>Smart Multi-Step Forms</h3>
            <p className="text-black">
              Choose from specialized tracks like Frontend, Backend, and Mobile
              Development.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reusable;
