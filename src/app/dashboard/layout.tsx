export default function DashBoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <section className="bg-blue-600">{children}</section>
  );
}
