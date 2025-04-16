import { motion } from "framer-motion";

const benefits = [
  { title: "Fast", desc: "Get diagnostic results in seconds with real-time AI-powered analysis." },
  { title: "Secure", desc: "All data is encrypted and securely stored in the cloud." },
  { title: "Accessible", desc: "Access reports and scans from any device, anytime." },
  { title: "Accurate", desc: "AI delivers high-precision tumor detection and classification." },
  { title: "User-Friendly", desc: "Simple interface for both doctors and patients to navigate." },
  { title: "Paperless Workflow", desc: "Digitally manage patient history and reports—no paperwork needed." }
];

export default function WhyUsSection({ id }) {
  return (
    <section id={id} className="min-h-screen flex items-center justify-center bg-white snap-start">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <motion.h2
          className="text-4xl font-bold text-indigo-700 mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Why Choose Us?
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              className="p-6 bg-gray-100 rounded-lg shadow-md"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-semibold text-indigo-600 mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
