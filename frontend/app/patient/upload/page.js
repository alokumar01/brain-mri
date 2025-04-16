"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import Navbar from "../../../components/Navbar";
import { useRouter } from "next/navigation";

export default function UploadMRI() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Check if logged in as patient
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/check-session.php", {
          credentials: "include",
        });
        const data = await response.json();
        if (!data.isLoggedIn || data.role !== "patient") {
          toast.error("Please log in as a patient");
          router.push("/login");
        }
      } catch (error) {
        toast.error("Session check failed");
      }
    };
    checkSession();
  }, [router]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select an MRI image.");
      return;
    }

    const formData = new FormData();
    formData.append("mri", file);
    formData.append("scan_date", e.target.scan_date.value);
    formData.append("description", e.target.description.value);

    try {
      setIsSubmitting(true);
      const res = await fetch("http://localhost:8000/api/upload.php", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const result = await res.json();

      if (result.success) {
        toast.success("MRI uploaded successfully");
        router.push("/patient");
      } else {
        toast.error(result.message || "Upload failed");
      }
    } catch (error) {
      toast.error("Network error: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Upload MRI</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input type="file" accept="image/*" onChange={handleFileChange} disabled={isSubmitting} />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-40 object-cover rounded-md border shadow-sm"
            />
          )}
          <Input name="scan_date" type="date" required disabled={isSubmitting} />
          <Input name="description" placeholder="Description" required disabled={isSubmitting} />
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Uploading..." : "Upload"}
          </Button>
        </form>
      </main>
    </div>
  );
}
