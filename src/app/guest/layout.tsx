import Warning from "@/components/template/guest/main/Warning";
import Navbar from "@/components/template/guest/navbar/Navbar";

export default async function IndexLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <div className="container">
      <main>
        <Navbar />
        <Warning />
        {children}
      </main>
    </div>
  );
}
