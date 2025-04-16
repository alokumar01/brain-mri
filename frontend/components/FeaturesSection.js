import { motion } from "framer-motion";

const features = [
  { title: "Upload & Store", desc: "Securely upload and store brain MRI scans in the cloud." },
  { title: "AI-Powered Diagnosis", desc: "Instantly analyze MRI images using AI to detect tumor type and severity." },
  { title: "PDF Report Generation", desc: "Generate and download comprehensive medical reports with diagnosis and doctor details." },
  { title: "Doctor-Patient Portal", desc: "Easily manage doctor and patient profiles with unique IDs and medical records." },
  { title: "Smooth Navigation", desc: "User-friendly interface with seamless transitions between sections." },
  { title: "Real-Time Notifications", desc: "Keep doctors and patients updated with instant status alerts and messages." },
  { title: "Secure Access Control", desc: "Ensure only verified users can access sensitive data with role-based login." },
  { title: "Web Access", desc: "Access the platform across web devices, anytime, anywhere." }
];


export default function FeaturesSection({ id }) {
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
          Features
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="p-6 bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-semibold text-indigo-600 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}