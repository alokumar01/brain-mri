"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/check-session.php", {
          credentials: "include",
        });
        const data = await response.json();
        setIsLoggedIn(data.isLoggedIn);
        setRole(data.role);
      } catch (error) {
        console.error("Session check failed:", error);
      }
    };
    checkSession();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/logout.php", {
        method: "POST",
        credentials: "include",
      });
      const result = await response.json();
      if (result.success) {
        toast.success("Logged out successfully", {autoClose: 1500} );
        setIsLoggedIn(false);
        setRole(null);
        router.push("/login");
      } else {
        toast.error("Logout failed");
      }
    } catch (error) {
      toast.error("Error during logout");
      console.error("Error:", error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-indigo-700 text-white py-4 px-6 shadow-md z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          MRI Analysis
        </Link>
        <div className="space-x-6 flex items-center">
          <a href="#hero" className="hover:text-indigo-200 transition">Home</a>
          <a href="#features" className="hover:text-indigo-200 transition">Features</a>
          <a href="#how-it-works" className="hover:text-indigo-200 transition">How It Works</a>
          <a href="#testimonials" className="hover:text-indigo-200 transition">Testimonials</a>
          <a href="#why-us" className="hover:text-indigo-200 transition">Why Us</a>
          <a href="#cta" className="hover:text-indigo-200 transition">Get Started</a>

          {!isLoggedIn ? (
            <>
              <Link href="/login" className="hover:text-indigo-200 transition">Login</Link>
              <Link href="/signup" className="hover:text-indigo-200 transition">Signup</Link>
            </>
          ) : (
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="ml-2 hover:cursor-pointer"
            >
              Logout
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
