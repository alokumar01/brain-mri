import { motion } from "framer-motion";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <motion.footer
      className="bg-indigo-800 text-white py-12 snap-start"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-left">
        {/* Brand Info */}
        <div>
          <h2 className="text-2xl font-bold mb-4">MRI Smart Report</h2>
          <p className="text-sm text-gray-200">
            Empowering doctors and patients with AI-based MRI tumor analysis and secure reporting.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-200">
            <li><a href="#features" className="hover:underline">Features</a></li>
            <li><a href="#how-it-works" className="hover:underline">How It Works</a></li>
            <li><a href="#why-us" className="hover:underline">Why Choose Us</a></li>
            <li><a href="#testimonials" className="hover:underline">Testimonials</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Contact Us</h3>
          <ul className="text-sm text-gray-200 space-y-2">
          <li>
            <a href="mailto:mailtestingalok@gmail.com" className="hover:underline">
              Email: mailtestingalok@gmail.com
            </a>
          </li>
            <li>Phone: +91-98765-43210</li>
            <li>Location: LPU Campus, Punjab, India</li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
          <div className="flex space-x-4 mt-2">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebookF className="hover:text-indigo-300" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter className="hover:text-indigo-300" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <FaLinkedinIn className="hover:text-indigo-300" />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              <FaGithub className="hover:text-indigo-300" />
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <motion.div
        className="mt-10 border-t border-indigo-600 pt-6 text-sm text-gray-300 text-center font-bold"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        © 2025 MRI Scan Analysis and Reporting System. All rights reserved.
      </motion.div>
    </motion.footer>
  );
}
