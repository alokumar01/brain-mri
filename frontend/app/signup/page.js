"use client";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar";

const schema = z
  .object({
    role: z.enum(["doctor", "patient"], {
      required_error: "Please select a role",
    }),
    email: z.string().email("Invalid email address").min(1, "Email is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    name: z.string().min(1, "Name is required"),
    specialization: z.string().optional(),
    phone: z
      .string()
      .regex(/^[0-9]{10}$/, "Phone must be 10 digits")
      .optional(),
  })
  .refine((data) => (data.role === "doctor" ? !!data.specialization : true), {
    message: "Specialization is required for doctors",
    path: ["specialization"],
  })
  .refine((data) => (data.role === "patient" ? !!data.phone : true), {
    message: "Phone is required for patients",
    path: ["phone"],
  });

export default function Signup() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { role: "" },
  });

  const router = useRouter();
  const role = watch("role");

  const onSubmit = async (data) => {
    try {
      const res = await fetch("http://localhost:8000/api/signup.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const result = await res.json();
      if (result.success) {
        toast.success(`Registered as ${result.doc_id || result.pat_id}`);
        router.push("/login");
      } else {
        toast.error(result.message || "Signup failed");
      }
    } catch (error) {
      toast.error("Network error: " + error.message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow w-full max-w-md mx-auto px-6 py-10 mt-10">
        <h1 className="text-2xl font-bold mb-6 text-center">Signup</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <Controller
              control={control}
              name="role"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="doctor">Doctor</SelectItem>
                    <SelectItem value="patient">Patient</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.role && (
              <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              {...register("email")}
              placeholder="Email"
              type="email"
              autoFocus
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <Input
              {...register("password")}
              type="password"
              placeholder="Password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <Input {...register("name")} placeholder="Name" />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {role === "doctor" && (
            <div>
              <label className="block text-sm font-medium mb-1">Specialization</label>
              <Input
                {...register("specialization")}
                placeholder="Specialization"
              />
              {errors.specialization && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.specialization.message}
                </p>
              )}
            </div>
          )}

          {role === "patient" && (
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <Input {...register("phone")} placeholder="Phone" />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
              )}
            </div>
          )}

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Signing up..." : "Signup"}
          </Button>
        </form>
      </main>
    </div>
  );
}
