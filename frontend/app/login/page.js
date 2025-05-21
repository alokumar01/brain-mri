"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import Navbar from "../../components/Navbar";

const schema = z.object({
  role: z.enum(["doctor", "patient"], {
    required_error: "Please select a role",
  }),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { role: "" },
  });

  const router = useRouter();

  // Auto-redirect if already logged in
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/check-session.php", {
          credentials: "include",
        });
        const data = await response.json();
        if (data.isLoggedIn) {
          router.push(`/${data.role}`);
        }
      } catch (error) {
        console.error("Session check failed:", error);
      }
    };
    checkSession();
  }, [router]);

  const onSubmit = async (data) => {
    try {
      const res = await fetch("http://localhost:8000/api/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (res.ok && result.success) {
        toast.success(`Logged in as ${result.user_id}`);
        router.push(`/${data.role}`);
      } else {
        toast.error(result.message || "Login failed");
      }
    } catch (error) {
      toast.error("Network error: " + error.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen flex flex-col bg-background"
    >
      <Navbar />
      <main className="flex-grow flex items-center justify-center px-6">
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="w-full max-w-md bg-card rounded-xl shadow-lg p-8"
        >
          <h1 className="text-3xl font-bold mb-6 text-center text-primary">Login</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-muted-foreground block mb-1">
                Role
              </label>
              <Select
                onValueChange={(value) => setValue("role", value, { shouldValidate: true })}
              >
                <SelectTrigger>    
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="doctor">Doctor</SelectItem>
                  <SelectItem value="patient">Patient</SelectItem>
                </SelectContent>
              </Select>
              <input type="hidden" {...register("role")} />
              {errors.role && (
                <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground block mb-1">
                Email
              </label>
              <Input
                {...register("email")}
                placeholder="Enter your email"
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground block mb-1">
                Password
              </label>
              <Input
                {...register("password")}
                type="password"
                placeholder="Enter password"
                disabled={isSubmitting}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full hover:shadow-md transition-transform hover:scale-105"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </form>
        </motion.div>
      </main>
    </motion.div>
  );
}
