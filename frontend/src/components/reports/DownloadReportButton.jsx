import React, { useState } from "react";
import { FaFilePdf, FaSpinner } from "react-icons/fa";
import { downloadMonthlyReport } from "../../services/reportService";

const DownloadReportButton = () => {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");

  const handleDownload = async () => {
    try {
      setDownloading(true);
      setError("");
      const blob = await downloadMonthlyReport();

      // Create download link for the blob
      const url = window.URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      
      // Use standard naming
      link.setAttribute("download", "FitTrac_Monthly_Health_Report.pdf");
      document.body.appendChild(link);
      link.click();

      // Cleanup
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading PDF report:", err);
      if (err.response && err.response.status === 404) {
        setError("No health logs found for the previous 30 days. Log meals, water, or exercise to generate a report.");
      } else {
        setError("An error occurred while generating the PDF report. Please try again later.");
      }
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="download-report-container">
      <button
        onClick={handleDownload}
        disabled={downloading}
        className="download-report-btn"
      >
        {downloading ? (
          <>
            <FaSpinner className="spinner icon-spin" /> Generating PDF Report...
          </>
        ) : (
          <>
            <FaFilePdf className="pdf-icon" /> Download Monthly Health Report
          </>
        )}
      </button>
      {error && <p className="download-error-msg">{error}</p>}
    </div>
  );
};

export default DownloadReportButton;
