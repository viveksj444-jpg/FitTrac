const PDFDocument = require("pdfkit");

/**
 * Helper: Formats a date to a readable string (e.g. "July 24, 2026")
 */
const formatReadableDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Draws a stylized section header with a vertical colored accent bar.
 */
const drawSectionHeader = (doc, title, accentColor = "#10b981") => {
  doc.moveDown(1.2);
  const currentY = doc.y;
  
  // Draw accent vertical bar
  doc.rect(50, currentY, 4, 18).fill(accentColor);
  
  // Draw text
  doc.fillColor("#0f172a")
     .font("Helvetica-Bold")
     .fontSize(12)
     .text(title, 62, currentY + 2);
     
  // Reset fill color for subsequent operations
  doc.fillColor("#1e293b");
  doc.moveDown(0.8);
};

/**
 * Draws a grid metric card with background fill and border.
 */
const drawMetricCard = (doc, label, value, unit, x, y, width, height) => {
  // Save graphics state
  doc.save();
  
  // Background
  doc.rect(x, y, width, height).fill("#f8fafc");
  
  // Border
  doc.rect(x, y, width, height).strokeColor("#e2e8f0").lineWidth(1).stroke();
  
  // Label
  doc.fillColor("#64748b")
     .font("Helvetica-Bold")
     .fontSize(8)
     .text(label.toUpperCase(), x + 10, y + 10);
     
  // Value & Unit
  doc.fillColor("#0f172a")
     .font("Helvetica-Bold")
     .fontSize(14)
     .text(value.toString(), x + 10, y + 23);
     
  if (unit) {
    const valWidth = doc.widthOfString(value.toString());
    doc.fillColor("#64748b")
       .font("Helvetica")
       .fontSize(9)
       .text(` ${unit}`, x + 10 + valWidth, y + 27);
  }
  
  doc.restore();
};

/**
 * Generates the Monthly Health Report PDF and streams it directly to the response.
 */
const generateMonthlyReportPDF = (data, user, res) => {
  const doc = new PDFDocument({
    size: "LETTER",
    margins: { top: 50, bottom: 50, left: 50, right: 50 },
    bufferPages: true // allows us to add footers to all pages at the end
  });

  // Setup response headers
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=FitTrac_Monthly_Health_Report_${user.name.replace(/\s+/g, "_")}.pdf`
  );

  doc.pipe(res);

  // --- HEADER SECTION (Slate Banner) ---
  doc.rect(50, 40, 512, 70).fill("#0f172a");
  
  doc.fillColor("#ffffff")
     .font("Helvetica-Bold")
     .fontSize(18)
     .text("FITTRAC HEALTH REPORT", 65, 52);
     
  doc.fillColor("#10b981")
     .font("Helvetica-Oblique")
     .fontSize(10)
     .text("Monthly Wellness & Activity Insights", 65, 75);

  doc.y = 125; // Advance y below banner

  // --- USER INFORMATION SECTION ---
  doc.save();
  doc.rect(50, doc.y, 512, 45).fill("#f1f5f9");
  doc.rect(50, doc.y, 512, 45).strokeColor("#cbd5e1").lineWidth(1).stroke();
  
  const infoY = doc.y + 10;
  doc.fillColor("#1e293b").font("Helvetica-Bold").fontSize(9);
  doc.text("MEMBER:", 65, infoY);
  doc.font("Helvetica").text(user.name, 120, infoY);

  doc.font("Helvetica-Bold").text("REPORT PERIOD:", 270, infoY);
  doc.font("Helvetica").text("Previous 30 Days", 365, infoY);

  const nextRowY = infoY + 15;
  doc.font("Helvetica-Bold").text("GOAL TYPE:", 65, nextRowY);
  const goalText = user.goal ? user.goal.charAt(0).toUpperCase() + user.goal.slice(1) : "N/A";
  doc.font("Helvetica").text(goalText, 120, nextRowY);

  doc.font("Helvetica-Bold").text("GENERATED ON:", 270, nextRowY);
  doc.font("Helvetica").text(formatReadableDate(new Date()), 365, nextRowY);
  doc.restore();

  doc.y = 185; // Advance cursor below user info

  // --- SECTION 1: MONTHLY SUMMARY ---
  drawSectionHeader(doc, "MONTHLY HEALTH SUMMARY", "#10b981");
  
  const sY1 = doc.y;
  const colW1 = 157; // (512 - 2*20) / 3 = 157.3
  const cardH1 = 45;
  
  drawMetricCard(doc, "Avg Daily Calories", data.summary.averageCalories, "kcal", 50, sY1, colW1, cardH1);
  drawMetricCard(doc, "Avg Daily Burned", data.summary.averageBurned, "kcal", 227, sY1, colW1, cardH1);
  drawMetricCard(doc, "Avg Net Calories", data.summary.averageNetCalories, "kcal", 405, sY1, colW1, cardH1);

  const sY2 = sY1 + 55;
  drawMetricCard(doc, "Avg Daily Water", data.summary.averageWater, "ml", 50, sY2, colW1, cardH1);
  drawMetricCard(doc, "Goal Completion", data.summary.goalCompletion, "%", 227, sY2, colW1, cardH1);
  drawMetricCard(doc, "Calorie Deficit Days", data.dailyData.filter(d => d.consumed > 0 && d.net < (user.dailyCalorieGoal || 2000)).length, "days", 405, sY2, colW1, cardH1);

  doc.y = sY2 + 60;

  // --- SECTION 2: NUTRITION BREAKDOWN ---
  drawSectionHeader(doc, "NUTRITION & MACRONUTRIENTS", "#3b82f6");
  
  const nY = doc.y;
  drawMetricCard(doc, "Average Protein", data.summary.averageProtein, "g", 50, nY, colW1, cardH1);
  drawMetricCard(doc, "Average Carbs", data.summary.averageCarbs, "g", 227, nY, colW1, cardH1);
  drawMetricCard(doc, "Average Fat", data.summary.averageFat, "g", 405, nY, colW1, cardH1);

  doc.y = nY + 60;

  // --- SECTION 3: EXERCISE & FITNESS ---
  drawSectionHeader(doc, "EXERCISE & PHYSICAL ACTIVITY", "#f59e0b");
  
  const eY = doc.y;
  drawMetricCard(doc, "Total Workouts", data.summary.totalExercises, "sessions", 50, eY, colW1, cardH1);
  
  // Total burned = avgBurned * 30 or we sum it up from dailyData
  const totalBurned = data.dailyData.reduce((acc, curr) => acc + (curr.burned || 0), 0);
  drawMetricCard(doc, "Total Burned", totalBurned, "kcal", 227, eY, colW1, cardH1);
  
  const mostActiveDayStr = data.summary.mostActiveDay !== "N/A" ? formatReadableDate(data.summary.mostActiveDay) : "N/A";
  drawMetricCard(doc, "Most Active Day", mostActiveDayStr, "", 405, eY, colW1, cardH1);

  doc.y = eY + 60;

  // Check if we need to add a page for Hydration and Insights
  if (doc.y > 550) {
    doc.addPage();
  }

  // --- SECTION 4: HYDRATION REPORT ---
  drawSectionHeader(doc, "HYDRATION ANALYSIS", "#06b6d4");
  
  const hY = doc.y;
  drawMetricCard(doc, "Average Hydration", data.summary.averageWater, "ml", 50, hY, colW1, cardH1);
  
  // Total water in liters
  const totalLiters = (data.summary.totalWater / 1000).toFixed(1);
  drawMetricCard(doc, "Total Consumed", totalLiters, "liters", 227, hY, colW1, cardH1);

  // Best hydration day calculation
  let maxWaterVal = -1;
  let bestHydrationDay = "N/A";
  data.dailyData.forEach(d => {
    if (d.water > maxWaterVal) {
      maxWaterVal = d.water;
      bestHydrationDay = d.date;
    }
  });
  const bestHydrationDayStr = maxWaterVal > 0 ? formatReadableDate(bestHydrationDay) : "N/A";
  drawMetricCard(doc, "Best Hydration Day", bestHydrationDayStr, "", 405, hY, colW1, cardH1);

  doc.y = hY + 65;

  // Check if page fits insights
  if (doc.y > 550) {
    doc.addPage();
  }

  // --- SECTION 5: PERSONALIZED INSIGHTS ---
  drawSectionHeader(doc, "PERSONALIZED INSIGHTS & RECOMMENDATIONS", "#8b5cf6");
  
  doc.save();
  doc.font("Helvetica").fontSize(10).fillColor("#1e293b");
  
  if (data.insights && data.insights.length > 0) {
    data.insights.forEach((insight) => {
      // Draw bullet point
      const bulletY = doc.y;
      doc.fillColor("#8b5cf6").font("Helvetica-Bold").text("•", 55, bulletY);
      doc.fillColor("#1e293b").font("Helvetica").text(insight, 70, bulletY, { width: 480 });
      doc.moveDown(0.4);
    });
  } else {
    doc.text("Log food, exercise, and hydration to see monthly metrics and custom feedback.", 55, doc.y);
  }
  doc.restore();

  doc.y = doc.y + 15;

  if (doc.y > 550) {
    doc.addPage();
  }

  // --- SECTION 6: MONTHLY ACHIEVEMENTS ---
  drawSectionHeader(doc, "MONTHLY ACHIEVEMENTS & STREAKS", "#ec4899");
  
  const aY = doc.y;
  const colW2 = 246; // (512 - 20) / 2 = 246
  const cardH2 = 50;

  // Achievement 1: Goal Completion Rate
  doc.save();
  doc.rect(50, aY, colW2, cardH2).fill("#fffdfa");
  doc.rect(50, aY, colW2, cardH2).strokeColor("#fef3c7").lineWidth(1).stroke();
  doc.fontSize(18).text("🏆", 62, aY + 14);
  doc.fillColor("#b45309").font("Helvetica-Bold").fontSize(8).text("GOAL COMPLETION RATE", 85, aY + 12);
  doc.fillColor("#0f172a").font("Helvetica-Bold").fontSize(12).text(`${data.summary.goalCompletion}%`, 85, aY + 24);
  doc.fillColor("#64748b").font("Helvetica").fontSize(8).text("Calorie target consistency", 85, aY + 38);
  doc.restore();

  // Achievement 2: Longest Healthy Streak
  doc.save();
  doc.rect(316, aY, colW2, cardH2).fill("#fffbfb");
  doc.rect(316, aY, colW2, cardH2).strokeColor("#fee2e2").lineWidth(1).stroke();
  doc.fontSize(18).text("🔥", 328, aY + 14);
  doc.fillColor("#b91c1c").font("Helvetica-Bold").fontSize(8).text("LONGEST HEALTHY STREAK", 351, aY + 12);
  doc.fillColor("#0f172a").font("Helvetica-Bold").fontSize(12).text(`${data.summary.longestHealthyStreak || 0} days`, 351, aY + 24);
  doc.fillColor("#64748b").font("Helvetica").fontSize(8).text("Consecutive calorie goals met", 351, aY + 38);
  doc.restore();

  // Achievement 3: Hydration Streak
  const aY2 = aY + 60;
  doc.save();
  doc.rect(50, aY2, colW2, cardH2).fill("#f0f9ff");
  doc.rect(50, aY2, colW2, cardH2).strokeColor("#e0f2fe").lineWidth(1).stroke();
  doc.fontSize(18).text("💧", 62, aY2 + 14);
  doc.fillColor("#0369a1").font("Helvetica-Bold").fontSize(8).text("HYDRATION STREAK", 85, aY2 + 12);
  doc.fillColor("#0f172a").font("Helvetica-Bold").fontSize(12).text(`${data.summary.longestWaterGoalStreak || 0} days`, 85, aY2 + 24);
  doc.fillColor("#64748b").font("Helvetica").fontSize(8).text("Consecutive hydration goals met", 85, aY2 + 38);
  doc.restore();

  // Achievement 4: Exercise Streak
  doc.save();
  doc.rect(316, aY2, colW2, cardH2).fill("#f0fdf4");
  doc.rect(316, aY2, colW2, cardH2).strokeColor("#dcfce7").lineWidth(1).stroke();
  doc.fontSize(18).text("🏋", 328, aY2 + 14);
  doc.fillColor("#15803d").font("Helvetica-Bold").fontSize(8).text("EXERCISE STREAK", 351, aY2 + 12);
  doc.fillColor("#0f172a").font("Helvetica-Bold").fontSize(12).text(`${data.summary.longestExerciseStreak || 0} days`, 351, aY2 + 24);
  doc.fillColor("#64748b").font("Helvetica").fontSize(8).text("Consecutive workout days logged", 351, aY2 + 38);
  doc.restore();

  // --- FOOTER & PAGE NUMBERING ---
  const range = doc.bufferedPageRange();
  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i);
    
    // Draw footer line
    doc.strokeColor("#e2e8f0").lineWidth(0.5).moveTo(50, 740).lineTo(562, 740).stroke();
    
    // Footer text
    doc.fillColor("#94a3b8")
       .font("Helvetica")
       .fontSize(8)
       .text("FitTrac Health tracker — Built for progress.", 50, 748);
       
    doc.text(`Page ${i + 1} of ${range.count}`, 500, 748, { align: "right" });
  }

  doc.end();
};

module.exports = {
  generateMonthlyReportPDF,
};
