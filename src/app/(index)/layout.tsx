export default function IndexLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return <div className="container">{children}</div>;
}
