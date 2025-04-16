"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function UploadMRI() {
  const [file, setFile] = useState(null);
  const [scanDate, setScanDate] = useState("");
  const [description, setDescription] = useState("");
  const [patientId, setPatientId] = useState("");
  const [patients, setPatients] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/patients.php", {
          credentials: "include",
        });
        const data = await response.json();
        if (data.success && Array.isArray(data.patients) && data.patients.length > 0) {
          setPatients(data.patients);
          console.log("Fetched Patients: ", data.patients); // Log patients data to check if it's correct
        } else {
          toast.error("No patients assigned to you");
        }
      } catch (error) {
        toast.error("Network error: " + error.message);
      }
    };
    fetchPatients();
  }, []);
  

  // Log patients to check if data is correct
  useEffect(() => {
    console.log("Fetched Patients: ", patients);
  }, [patients]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !scanDate || !description || !patientId) {
      toast.error("Please fill all fields");
      return;
    }

    const formData = new FormData();
    formData.append("mri", file);
    formData.append("scan_date", scanDate);
    formData.append("description", description);
    formData.append("patient_id", patientId);

    try {
      const response = await fetch("http://localhost:8000/api/upload.php", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        toast.success("MRI uploaded successfully");
        router.push("/doctor");
      } else {
        toast.error(data.message || "Upload failed");
      }
    } catch (error) {
      toast.error("Network error: " + error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      <Navbar />
      <main className="flex-grow p-6 flex flex-col items-center justify-center mt-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-xl bg-gray-900 rounded-2xl shadow-lg p-8 border border-gray-700"
        >
          <h1 className="text-3xl font-bold mb-6 text-center text-white">Upload MRI</h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="patient" className="text-gray-300">Select Patient</Label>
              <Select onValueChange={setPatientId} value={patientId}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select a patient" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 text-white border-gray-700">
                    {patients.length > 0 ? (
                      patients.map((patient) => (
                        <SelectItem key={patient.pat_id} value={patient.pat_id}>
                          {patient.name} ({patient.pat_id})
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>No patients available</SelectItem>
                    )}
                  </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="file" className="text-gray-300">MRI Image</Label>
              <Input
                id="file"
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="bg-gray-800 border-gray-700 text-white file:text-white file:bg-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="scanDate" className="text-gray-300">Scan Date</Label>
              <Input
                id="scanDate"
                type="date"
                value={scanDate}
                onChange={(e) => setScanDate(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-300">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short MRI scan details"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <Button type="submit" className="w-full mt-4 hover:scale-105 transition-transform duration-200">
              Upload
            </Button>
          </form>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
