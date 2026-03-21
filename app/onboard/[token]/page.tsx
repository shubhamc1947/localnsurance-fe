import EmployeeOnboarding from "@/views/EmployeeOnboarding";

export default async function OnboardPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return <EmployeeOnboarding token={token} />;
}
