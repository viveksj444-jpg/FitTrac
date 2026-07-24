import API from "./api";

/**
 * Downloads the monthly health report PDF for the authenticated user
 * @returns {Promise<Blob>} The report PDF as a binary blob
 */
export const downloadMonthlyReport = async () => {
  const response = await API.get("/reports/monthly", {
    responseType: "blob",
  });
  return response.data;
};
