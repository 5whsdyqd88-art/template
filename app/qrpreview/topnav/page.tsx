import TopNav from "@/components/relay/TopNav";

export const dynamic = "force-dynamic";

export default function QrPreviewTopNav() {
  return (
    <>
      <TopNav />
      <main id="top" style={{ minHeight: "300vh", paddingTop: "120px" }}>
        <div style={{ padding: "2rem", maxWidth: "60rem", margin: "0 auto" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 700 }}>QR Preview — TopNav</h1>
          <p>Long page so the scroll-aware frosted state activates.</p>
        </div>
      </main>
    </>
  );
}
