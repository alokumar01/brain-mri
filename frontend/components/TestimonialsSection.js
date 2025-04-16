import { motion } from "framer-motion";

const testimonials = [
  { name: "Dr. Smith", quote: "This tool has transformed how I diagnose patients!" },
  { name: "Patient Jane", quote: "Easy to access my reports anytime, anywhere." },
  { name: "Dr. Ayesha Khan", quote: "The AI analysis is fast and accurate—saves me hours every week." },
  { name: "Patient Ravi", quote: "Getting my MRI results and report was so smooth and hassle-free." }
];


export default function TestimonialsSection({ id }) {
  return (
    <section id={id} className="min-h-screen flex items-center justify-center bg-indigo-100 snap-start">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.h2
          className="text-4xl font-bold text-indigo-700 mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          What People Say
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="p-6 bg-white rounded-lg shadow-md"
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <p className="text-gray-600 italic mb-4">"{testimonial.quote}"</p>
              <p className="text-indigo-600 font-semibold">{testimonial.name}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}