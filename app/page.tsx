import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/sections/Hero";
import { Stays } from "@/components/sections/Stays";
import { Valley } from "@/components/sections/Valley";
import { Experiences } from "@/components/sections/Experiences";
import { Journal } from "@/components/sections/Journal";
import { Reserve } from "@/components/sections/Reserve";

export default function HomePage() {
  return (
    <div className="vs-app">
      <Nav />
      <main>
        <Hero />
        <Stays />
        <Valley />
        <Experiences />
        <Journal />
        <Reserve />
      </main>
      <Footer />
    </div>
  );
}
