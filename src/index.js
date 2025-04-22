import nodemailer from "nodemailer";
import xlsx from "xlsx";
import dotenv from "dotenv";
dotenv.config();

// Read Excel file
const workbook = xlsx.readFile("src/employee_data.csv"); // if running from root
const worksheet = workbook.Sheets[workbook.SheetNames[0]];
const employeeData = xlsx.utils.sheet_to_json(worksheet);

// Setup mail transporter
const transporter = nodemailer.createTransport({
  service: "Gmail", // Use other services if needed
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    port: 587,
  },
});


async function sendEmails() {
  try {
    for (const emp of employeeData) {
      const mailOptions = {
        from: process.env.EMAIL_USER, // Sender's name or email
        to: emp.Email,               // Receiver's email
        subject: `Leave Balance Information for ${emp.Name}`,
        text: `Dear ${emp.Name} (${emp.EmpID}),\n\nYou currently have:\n- ${emp.CL} Casual Leaves (CL)\n- ${emp.CCL} Compensatory Casual Leaves (CCL)\n\nPlease ensure your leave balance is up to date.\n\nBest regards,\nDr.GVSSKR Naganjaneyulu`,
   
      };
      

      await transporter.sendMail(mailOptions);
      console.log(`Email sent to: ${emp.Email}`);
    }
    console.log("✅ All emails sent successfully!");
  } catch (error) {
    console.error("❌ Error sending emails:", error);
  }
}

sendEmails();
