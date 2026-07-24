const { calculateMonthlyAnalyticsData } = require("./monthlyAnalyticsController");
const { generateMonthlyReportPDF } = require("../utils/pdfGenerator");

// @desc    Get monthly health PDF report
// @route   GET /api/reports/monthly
// @access  Private
const getMonthlyReport = async (req, res) => {
  try {
    const data = await calculateMonthlyAnalyticsData(req.user._id);
    
    // Check if there is data
    const hasData = data.summary.totalMeals > 0 || data.summary.totalExercises > 0 || data.summary.totalWater > 0;
    if (!hasData) {
      return res.status(404).json({
        success: false,
        message: "No health logs found for the previous 30 days to generate a report.",
      });
    }

    generateMonthlyReportPDF(data, data.user, res);
  } catch (error) {
    console.error("Error in getMonthlyReport:", error);
    if (error.message === "User not found") {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  getMonthlyReport,
};
