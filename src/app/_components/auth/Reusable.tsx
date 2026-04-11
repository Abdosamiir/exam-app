import {
  Brain,
  BookOpenCheck,
  FolderCode,
  RectangleEllipsis,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Tailored Diplomas",
    description:
      "Choose from specialized tracks like Frontend, Backend, and Mobile Development.",
  },
  {
    icon: BookOpenCheck,
    title: "Focused Exams",
    description:
      "Access topic-specific tests including HTML, CSS, JavaScript, and more.",
  },
  {
    icon: RectangleEllipsis,
    title: "Smart Multi-Step Forms",
    description:
      "Navigate guided workflows that adapt to your progress and goals.",
  },
];

const Reusable = () => {
  return (
    <div className="relative flex flex-col justify-center w-1/2 min-h-screen overflow-hidden  select-none">
      {/* ── decorative blur blobs ── */}
      <div className="pointer-events-none absolute -top-32 -right-32 h-105 w-105 rounded-full bg-blue-200 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-95 w-95 rounded-full bg-blue-200 blur-[100px]" />

      {/* ── content ── */}
      <div className="relative z-10 flex items-start flex-col container mx-auto w-2/3 gap-30 h-full text-black">
        {/* logo */}
        <div className="flex items-center text-primary  gap-2.5 text-xl font-bold tracking-tight">
          <FolderCode className="h-6 w-6 " />
          Exam App
        </div>

        {/* headline */}
        <div className="flex flex-col gap-10">
          <h1 className="text-3xl font-bold leading-snug">
            Empower your learning journey with our smart exam platform.
          </h1>

          {/* feature list */}
          <ul className="flex flex-col gap-6">
            {features.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex text-primary items-start gap-4">
                {/* icon badge */}
                <div className="border border-primary p-1.5">
                  <Icon className="h-4.5 w-4.5 " />
                </div>

                <div className="flex flex-col gap-0.5">
                  <h3 className="text-xl font-semibold">{title}</h3>
                  <p className="text-base text-main max-w-md leading-relaxed">
                    {description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Reusable;
