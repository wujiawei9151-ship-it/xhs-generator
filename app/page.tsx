import Hero from "./components/Hero";
import GeneratorForm from "./components/GeneratorForm";
import Footer from "./components/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-xhs-gradient">
      <Hero />
      <GeneratorForm />
      <Footer />
    </main>
  );
}
