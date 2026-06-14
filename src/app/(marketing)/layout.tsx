import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { PageReveal } from "@/components/PageReveal";
import { AnnouncementModal } from "@/components/AnnouncementModal";
import { Preloader } from "@/components/Preloader";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Preloader />
      <NavBar />
      <PageReveal>
        {children}
        <Footer />
      </PageReveal>
      <AnnouncementModal />
    </>
  );
}
