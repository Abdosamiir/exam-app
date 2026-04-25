import SubmissionResults from "@/features/submissions/components/submission-results";

export default async function SubmissionResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <SubmissionResults id={id} />;
}
