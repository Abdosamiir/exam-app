import { SpinnerCustom } from "@/shared/components/ui/spinner";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <SpinnerCustom />
    </div>
  );
}
