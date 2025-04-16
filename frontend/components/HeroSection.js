import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HeroSection({ id }) {
  return (
    <section
      id={id}
      className="min-h-screen flex items-center justify-center relative text-center px-4 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700 text-white snap-start overflow-hidden"
    >
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 opacity-40"
        initial={{ opacity: 0.3 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
      >
        <svg className="w-full h-full" viewBox="0 0 1440 320" fill="currentColor">
          <path
            d="M0,224L60,213.3C120,203,240,181,360,165.3C480,149,600,139,720,149.3C840,160,960,192,1080,197.3C1200,203,1320,181,1380,170.7L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          />
        </svg>
      </motion.div>

      {/* Main content */}
      <motion.div
        className="relative z-10 max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.h1
          className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Revolutionizing <span className="text-yellow-300">Brain MRI</span> Analysis with AI
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl mb-8 opacity-90"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Store, analyze, and manage MRI scans seamlessly with AI-powered precision for smarter diagnosis and treatment planning.
        </motion.p>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Button
            asChild
            className="bg-yellow-300 text-indigo-700 hover:bg-yellow-400 py-3 px-8 rounded-full shadow-xl font-semibold text-lg"
          >
            <Link href="/signup">Get Started</Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
