import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CTASection({ id }) {
  return (
    <section
      id={id}
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-700 via-purple-600 to-blue-500 text-white text-center overflow-hidden snap-start"
    >
      {/* Decorative blurred background circles */}
      <motion.div
        className="absolute w-72 h-72 bg-white/10 rounded-full top-10 left-10 blur-3xl animate-pulse"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.2 }}
      />
      <motion.div
        className="absolute w-72 h-72 bg-white/10 rounded-full bottom-10 right-10 blur-3xl animate-pulse"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.5 }}
      />

      {/* Main CTA content */}
      <motion.div
        className="z-10 max-w-3xl px-6"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <motion.h2
          className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Ready to Transform <span className="text-yellow-300">MRI Analysis?</span>
        </motion.h2>
        <motion.p
          className="text-lg md:text-xl mb-10 max-w-2xl mx-auto text-white/90"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Empower diagnostics with cutting-edge AI. Start your journey today!
        </motion.p>

        <motion.div
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Button
            asChild
            className="bg-yellow-300 text-indigo-900 hover:bg-yellow-400 py-3 px-10 text-lg font-semibold rounded-full shadow-xl"
          >
            <Link href="/signup">Sign Up Today</Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
