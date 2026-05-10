import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/sections/Hero";
import { Stays } from "@/components/sections/Stays";
import { Valley } from "@/components/sections/Valley";
import { Experiences } from "@/components/sections/Experiences";
import { Journal } from "@/components/sections/Journal";
import { Reserve } from "@/components/sections/Reserve";
import { listProperties } from "@/lib/db";

export const revalidate = 60;

export default async function HomePage() {
  const properties = await listProperties();
  const featured = properties.find((p) => p.is_featured) || properties[0] || null;
  const homeStays = properties.slice(0, 6);

  return (
    <div className="vs-app">
      <Nav />
      <main>
        <Hero featured={featured} />
        <Stays properties={homeStays} />
        <Valley />
        <Experiences />
        <Journal />
        <Reserve />
      </main>
      <Footer />
    </div>
  );
}
