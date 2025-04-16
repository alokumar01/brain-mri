"use client";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function PatientDashboard() {
  const [scans, setScans] = useState([]);
  const [selectedScan, setSelectedScan] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchScans = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/reports.php", {
          credentials: "include",
        });
        const data = await response.json();
        if (data.success) {
          // Normalize _id to ensure it's a string
          const normalizedScans = data.reports.map((scan) => ({
            ...scan,
            _id: String(scan._id), // Ensure _id is a string
          }));
          setScans(normalizedScans);
          console.log("Normalized scans:", normalizedScans); // Debug log
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

  const handleDownloadPDF = async (scanId) => {
    try {
      setDownloadingId(scanId);
      console.log("Sending scan_id:", scanId); // Debug log
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
        const errorData = await response.json();
        console.log("Error response:", errorData); // Debug log
        toast.error(`Failed to generate PDF: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Network error:", error);
      toast.error("Network error: " + error.message);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Patient Dashboard</h1>
        {scans.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {scans.map((scan) => (
              <div
                key={scan._id}
                className="bg-white dark:bg-zinc-900 p-4 rounded-xl shadow hover:shadow-lg transition"
              >
                <p><strong>Scan Date:</strong> {scan?.metadata?.scan_date}</p>
                <p><strong>Description:</strong> {scan?.metadata?.description}</p>

                <Dialog
                  onOpenChange={(open) => {
                    if (!open) setSelectedScan(null);
                  }}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedScan(scan)}
                      className="mt-3"
                    >
                      View Report
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>MRI Report</DialogTitle>
                    </DialogHeader>
                    {selectedScan && (
                      <div className="space-y-2 text-sm">
                        <p><strong>Patient ID:</strong> {selectedScan.pat_id}</p>
                        <p><strong>Scan Date:</strong> {selectedScan.metadata?.scan_date}</p>
                        <p><strong>Description:</strong> {selectedScan.metadata?.description}</p>
                        <p><strong>Tumor Size:</strong> {selectedScan.analysis?.tumor_size ?? "N/A"} mm</p>
                        <p><strong>Risk:</strong> {selectedScan.analysis?.risk ?? "Unknown"}</p>
                        <Button
                          variant="secondary"
                          onClick={() => handleDownloadPDF(scan._id)} // Use normalized _id
                          className="mt-4"
                          disabled={downloadingId === scan._id}
                        >
                          {downloadingId === scan._id ? "Downloading..." : "Download PDF"}
                        </Button>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-8">No scans available yet.</p>
        )}
      </main>
      <Footer />
    </div>
  );
}