import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow p-6">
        <h1 className="text-3xl font-bold mb-4">About Us</h1>
        <p className="text-lg">We aim to revolutionize MRI analysis with cloud computing and AI.</p>
      </main>
      <Footer />
    </div>
  );
}