"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/shared/components/ui/button";
import { USER_ROLES } from "@/features/auth/constants/user.constant";
import { useSeedDatabase } from "../hooks/use-admin";

const SeedButton = () => {
  const { data: session } = useSession();
  const [confirmed, setConfirmed] = useState(false);
  const [done, setDone] = useState(false);
  const { mutate, isPending } = useSeedDatabase();

  if (session?.user.role !== USER_ROLES.superAdmin) return null;

  if (done) {
    return <span className="text-sm text-green-600">Database seeded.</span>;
  }

  if (!confirmed) {
    return (
      <Button variant="outline" onClick={() => setConfirmed(true)}>
        Seed Database
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">This will seed the database. Continue?</span>
      <Button
        variant="destructive"
        disabled={isPending}
        onClick={() =>
          mutate(undefined, {
            onSuccess: () => {
              setConfirmed(false);
              setDone(true);
            },
            onError: () => setConfirmed(false),
          })
        }
      >
        {isPending ? "Seeding…" : "Yes, seed"}
      </Button>
      <Button variant="outline" onClick={() => setConfirmed(false)}>
        Cancel
      </Button>
    </div>
  );
};

export default SeedButton;
