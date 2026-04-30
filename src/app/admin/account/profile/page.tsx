import ProfileForm from "@/features/profile/components/profile/profile-form";

export default function AdminProfilePage() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Profile</h2>
      <ProfileForm />
    </div>
  );
}
