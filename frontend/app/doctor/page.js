"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function DoctorDashboard() {
  const [scans, setScans] = useState([]);
  const [selectedScan, setSelectedScan] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchScans = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/reports.php", {
          credentials: "include",
        });
        const data = await response.json();
        if (data.success) {
          setScans(data.reports);
        } else if (!data.success && data.message === "Unauthorized") {
          toast.error("Please log in");
          router.push("/login");
        } else {
          toast.error("Failed to load scans");
        }
      } catch (error) {
        toast.error("Network error: " + error.message);
      }
    };
    fetchScans();
  }, [router]);

  const handleViewReport = (scan) => {
    setSelectedScan(scan);
  };

  const handleDownloadPDF = async (scanId) => {
    try {
      const response = await fetch("http://localhost:8000/api/generate_pdf.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ scan_id: scanId }),
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `mri_report_${scanId}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      } else {
        toast.error("Failed to generate PDF");
      }
    } catch (error) {
      toast.error("Network error: " + error.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col bg-background"
    >
      <Navbar />
      <main className="flex-grow px-6 py-8 max-w-6xl mx-auto w-full">
        <h1 className="text-3xl font-bold mb-2">Doctor Dashboard</h1>
        <h2 className="text-muted-foreground text-lg mb-6">
          Welcome back, Doctor 👨‍⚕️ — here are the recent scans:
        </h2>

        <Button
          asChild
          className="mb-6 shadow-md hover:shadow-lg transition-transform hover:scale-105"
        >
          <a href="/doctor/upload" className="flex gap-2 items-center">
            ➕ Upload MRI
          </a>
        </Button>

        {scans.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient ID</TableHead>
                <TableHead>Scan Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scans.map((scan) => (
                <TableRow
                  key={scan._id}
                  className="hover:bg-muted/40 transition-colors cursor-pointer"
                >
                  <TableCell>{scan.pat_id}</TableCell>
                  <TableCell>{scan.metadata.scan_date}</TableCell>
                  <TableCell>{scan.metadata.description}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewReport(scan)}
                          className="hover:shadow-sm"
                        >
                          View Report
                        </Button>
                      </DialogTrigger>
                      <AnimatePresence>
                        {selectedScan && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                          >
                            <DialogContent className="rounded-xl shadow-xl p-6">
                              <DialogHeader>
                                <DialogTitle className="text-xl font-semibold mb-3">
                                  🧠 MRI Report
                                </DialogTitle>
                              </DialogHeader>
                              <div className="space-y-3 text-sm text-muted-foreground">
                                <p>
                                  <strong>👤 Patient ID:</strong> {selectedScan.pat_id}
                                </p>
                                <p>
                                  <strong>📅 Scan Date:</strong>{" "}
                                  {selectedScan.metadata.scan_date}
                                </p>
                                <p>
                                  <strong>📝 Description:</strong>{" "}
                                  {selectedScan.metadata.description}
                                </p>
                                <p>
                                  <strong>🧬 Tumor Size:</strong>{" "}
                                  {selectedScan.analysis?.tumor_size} mm
                                </p>
                                <p>
                                  <strong>⚠️ Risk:</strong> {selectedScan.analysis?.risk}
                                </p>
                                <Button
                                  variant="secondary"
                                  onClick={() => handleDownloadPDF(selectedScan._id)}
                                  className="mt-4 w-full"
                                >
                                  ⬇️ Download PDF Report
                                </Button>
                              </div>
                            </DialogContent>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center text-muted-foreground mt-12">
            <p className="text-lg font-medium">No MRI scans uploaded yet.</p>
            <p className="text-sm">Use the upload button above to add the first scan.</p>
          </div>
        )}
      </main>
      <Footer />
    </motion.div>
  );
}
