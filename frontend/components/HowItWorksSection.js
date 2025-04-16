import { motion } from "framer-motion";

const steps = [
  { step: "1", title: "Upload MRI", desc: "Doctors securely upload brain MRI scans using an easy-to-use form." },
  { step: "2", title: "AI Analysis", desc: "The AI model analyzes the scan to detect and classify brain tumors." },
  { step: "3", title: "Result Preview", desc: "Doctors review AI-generated results including tumor type and risk level." },
  { step: "4", title: "Report Generation", desc: "A detailed report is generated with diagnosis, patient, and doctor info." },
  { step: "5", title: "Doctor-Patient Mapping", desc: "The report and results are linked to both doctor and patient profiles." },
  { step: "6", title: "Download & Notify", desc: "Reports are available for download and notifications are sent to all relevant users." }
];

export default function HowItWorksSection({ id }) {
  return (
    <section id={id} className="min-h-screen flex items-center justify-center bg-gray-50 snap-start">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <motion.h2
          className="text-4xl font-bold text-indigo-700 mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          How It Works
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="p-6 bg-white rounded-lg shadow-md"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="w-12 h-12 mx-auto bg-indigo-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                {step.step}
              </div>
              <h3 className="text-xl font-semibold text-indigo-600 mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
