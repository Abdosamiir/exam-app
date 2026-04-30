"use client";

import { useState } from "react";
import { useDiplomas } from "../../hooks/use-diplomas";
import { IDiploma } from "../../types/diploma";
import DeleteDiplomaButton from "./delete-diploma-button";
import EditDiplomaForm from "./edit-diploma-form";
import ToggleDiplomaImmutableButton from "./toggle-diploma-immutable-button";

const DiplomasAdminTable = () => {
  const { data, isLoading, isError } = useDiplomas();
  const [editingId, setEditingId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 animate-pulse rounded bg-gray-100" />
        ))}
      </div>
    );
  }

  if (isError || !data?.status) {
    return (
      <p className="text-sm text-destructive">
        Failed to load diplomas. Please try again.
      </p>
    );
  }

  const diplomas: IDiploma[] = data.payload?.data ?? [];

  if (diplomas.length === 0) {
    return <p className="text-sm text-gray-500">No diplomas yet.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-left text-xs font-semibold uppercase text-gray-500">
          <tr>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Description</th>
            <th className="px-4 py-3">Immutable</th>
            <th className="px-4 py-3">Created</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y bg-white">
          {diplomas.map((diploma) => (
            <>
              <tr key={diploma.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{diploma.title}</td>
                <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                  {diploma.description}
                </td>
                <td className="px-4 py-3">
                  <ToggleDiplomaImmutableButton id={diploma.id} immutable={diploma.immutable} />
                </td>
                <td className="px-4 py-3 text-gray-400">
                  {new Date(diploma.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      className="text-blue-600 hover:underline text-xs"
                      onClick={() =>
                        setEditingId(editingId === diploma.id ? null : diploma.id)
                      }
                    >
                      {editingId === diploma.id ? "Close" : "Edit"}
                    </button>
                    <DeleteDiplomaButton id={diploma.id} />
                  </div>
                </td>
              </tr>
              {editingId === diploma.id && (
                <tr key={`edit-${diploma.id}`}>
                  <td colSpan={5} className="bg-gray-50 px-4 py-4">
                    <EditDiplomaForm
                      diploma={diploma}
                      onClose={() => setEditingId(null)}
                    />
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DiplomasAdminTable;
