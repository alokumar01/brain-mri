import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Testimonial from "../../components/TestimonialsSection";

export default function Info() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow p-6">
        <h1 className="text-3xl font-bold mb-4">Learn More</h1>
        <p className="mb-6">Our platform provides cutting-edge MRI analysis tools.</p>
        <Testimonial name="Dr. John" text="This tool saved me hours!" />
        <Testimonial name="Jane Doe" text="Easy to use and insightful reports." />
      </main>
      <Footer />
    </div>
  );
}