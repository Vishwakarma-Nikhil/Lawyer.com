// app.js
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import {
  signup,
  auth,
  transferAmount,
  fetchUserData,
  addCase,
  getUserCases,
  getCaseById,
  connection,
  getuserbyId,
} from "./database.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Login route
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const isAuthenticated = await auth(username, password);

    if (isAuthenticated) {
      const userData = await fetchUserData(username);
      res.status(200).json({ message: "Login successful!", user: userData });
    } else {
      res.status(401).send("Invalid username or password.");
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Signup route in Express
app.post("/signup", async (req, res) => {
  const { username, password, islawyer, additionalFields } = req.body;
  console.log(additionalFields);
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  try {
    const user = await signup(username, password, islawyer, additionalFields);
    res.status(201).json({
      message: "User signed up successfully",
      user: {
        user_id: user.user_id,
        username: user.username,
        walletid: user.walletid,
        balance: user.balance,
      },
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "Username already exists" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/transfer", async (req, res) => {
  const { senderWalletId, receiverWalletId, amount, caseId } = req.body;
  console.log(req.body);
  try {
    const result = await transferAmount(
      senderWalletId,
      receiverWalletId,
      amount,
      caseId
    );
    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/add-case", async (req, res) => {
  const {
    caseName,
    user_id,
    amount,
    caseDescription,
    caseType,
    court,
    lawyerAssigned,
    transactionId,
  } = req.body;

  try {
    // Ensure all required fields are provided
    if (
      !caseName ||
      !amount ||
      !caseDescription ||
      !caseType ||
      !court ||
      !user_id
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Call the addCase function from database.js to insert the case
    const result = await addCase(
      caseName,
      user_id,
      amount,
      caseDescription,
      caseType,
      court,
      lawyerAssigned,
      transactionId
    );

    // Send success response with the case data
    res.status(201).json({
      message: result.message,
      caseId: result.caseId,
    });
  } catch (error) {
    console.error("Error adding case:", error);
    res.status(500).json({ message: "Error adding case" });
  }
});
app.get("/user-cases/:user_id", async (req, res) => {
  const { user_id } = req.params; // Extract user_id from the route parameters

  try {
    // Validate if the user_id is provided
    if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Fetch the cases for the user from the database
    const cases = await getUserCases(user_id); // Assuming getUserCases is a function that fetches cases for a given user_id

    if (!cases || cases.length === 0) {
      return res.status(404).json({ message: "No cases found for this user" });
    }

    // Return the cases for the user
    res.status(200).json({ cases });
  } catch (error) {
    console.error("Error fetching user cases:", error);
    res.status(500).json({ message: "Error fetching user cases" });
  }
});

app.get("/case-deatails/:username/:caseId", async (req, res) => {
  const caseId = req.params.caseId;

  try {
    // Fetch case details from the database
    const caseDetails = await getCaseById(caseId);

    // If no case is found, return a 404 status
    if (!caseDetails) {
      return res.status(404).json({ message: "Case not found" });
    }

    // Respond with the case details
    res.status(200).json(caseDetails);
  } catch (error) {
    console.error("Error fetching case details:", error);
    res.status(500).json({ message: "Error fetching case details" });
  }
});

app.get("/get-lawyers", async (req, res) => {
  try {
    // Query to get all users who are lawyers
    const [rows] = await connection.execute(
      "SELECT * FROM users WHERE islawyer = 1"
    );
    res.status(200).json(rows); // Return the list of lawyers
  } catch (error) {
    console.error("Error fetching lawyers:", error);
    res.status(500).json({ message: "Error fetching lawyers" });
  }
});
app.post("/assign-lawyer", async (req, res) => {
  const { caseId, lawyerId } = req.body; // Receive caseId and lawyerId from the request

  try {
    // Query to update the CASE_INY table and assign the lawyer to the case
    const [result] = await connection.execute(
      "UPDATE CASE_INY SET lawyerassigned = ? WHERE caseid = ?",
      [lawyerId, caseId]
    );

    // Check if the update was successful
    if (result.affectedRows > 0) {
      return res.status(200).json({ message: "Lawyer assigned successfully" });
    } else {
      return res.status(404).json({ message: "Case not found" });
    }
  } catch (error) {
    console.error("Error assigning lawyer:", error);
    res.status(500).json({ message: "Error assigning lawyer" });
  }
});

//

app.post("/request-lawyer", async (req, res) => {
  const { caseId, user_id, lawyerId, status } = req.body;

  // Validate required fields in the request body
  if (!caseId || !lawyerId || !status || !user_id) {
    return res.status(400).json({
      success: false,
      message:
        "Missing required fields: caseId, lawyerId, and status are all required.",
    });
  }

  // // Ensure status is a valid value (could be 'pending', 'accepted', or 'rejected')
  // const validStatuses = ["pending", "accepted", "rejected"];
  // if (!validStatuses.includes(status)) {
  //   return res.status(400).json({
  //     success: false,
  //     message:
  //       "Invalid status value. Must be one of 'pending', 'accepted', or 'rejected'.",
  //   });
  // }

  try {
    // Check if the request already exists in the Application table (to avoid duplicates)
    const [existingApplication] = await connection.query(
      `SELECT * FROM Application WHERE user_id = ? AND lawyer_id = ? AND caseid = ? AND status = ?`,
      [user_id, lawyerId, caseId, status]
    );

    if (existingApplication.length > 0) {
      return res.status(400).json({
        success: false,
        message:
          "This lawyer is already requested for this case with the same status.",
      });
    }

    // Insert the application into the Application table
    await connection.query(
      `INSERT INTO Application (user_id, lawyer_id, caseid, status) VALUES (?, ?, ?, ?)`,
      [user_id, lawyerId, caseId, status]
    );

    // Return a success response
    res.status(200).json({
      success: true,
      message: "Lawyer request sent successfully.",
    });
  } catch (error) {
    console.error("Error processing lawyer request:", error);
    res.status(500).json({
      success: false,
      message:
        "An error occurred while processing the request. Please try again later.",
    });
  }
});
app.get("/check-pending-requests/:caseId", async (req, res) => {
  const { caseId } = req.params;

  try {
    const [requests] = await connection.query(
      `SELECT lawyer_id FROM Application WHERE caseid = ? AND status = 'pending'`,
      [caseId]
    );

    res.status(200).json(requests); // Return the list of pending requests
  } catch (error) {
    console.error("Error fetching pending requests:", error);
    res.status(500).json({ message: "Error fetching pending requests." });
  }
});

app.delete("/delete-request/:caseId/:lawyerId/:userId", async (req, res) => {
  const { caseId, lawyerId, userId } = req.params;

  try {
    const result = await connection.query(
      `DELETE FROM Application WHERE caseid = ? AND lawyer_id = ? AND status = 'pending' AND user_id = ?`,
      [caseId, lawyerId, userId]
    );

    if (result[0].affectedRows > 0) {
      return res.status(200).json({ message: "Request deleted successfully" });
    } else {
      return res.status(404).json({ message: "Pending request not found" });
    }
  } catch (error) {
    console.error("Error deleting request:", error);
    res
      .status(500)
      .json({ message: "Error deleting request. Please try again." });
  }
});

app.get("/get-requests/:lawyerId", async (req, res) => {
  const { lawyerId } = req.params;

  try {
    // Fetch all applications where the lawyer is involved and status is 'pending'
    const [requests] = await connection.query(
      `SELECT * FROM Application WHERE lawyer_id = ? AND status = 'pending'`,
      [lawyerId]
    );

    if (requests.length > 0) {
      res.status(200).json(requests);
    } else {
      res.status(404).json({ message: "No pending requests found." });
    }
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ message: "Error fetching requests." });
  }
});

app.post("/update-request-status", async (req, res) => {
  const { applicationId, status } = req.body;

  // Status should be either 'accepted' or 'rejected'
  if (status !== "accepted" && status !== "rejected") {
    return res.status(400).json({ message: "Invalid status value." });
  }

  try {
    // Step 1: Update the application status
    const [result] = await connection.query(
      `UPDATE Application SET status = ? WHERE application_id = ?`,
      [status, applicationId]
    );

    // Step 2: If the status is 'accepted', update the lawyer_id in the users table
    if (status === "accepted") {
      // Fetch the lawyer_id, caseid, and user_id from the application
      const [application] = await connection.execute(
        `SELECT lawyer_id, caseid, user_id FROM Application WHERE application_id = ?`,
        [applicationId]
      );

      if (application.length > 0) {
        const { lawyer_id, user_id, caseid } = application[0];

        const [result] = await connection.execute(
          "UPDATE CASE_INY SET lawyerassigned = ? WHERE caseid = ?",
          [lawyer_id, caseid]
        );

        // Check if the update was successful
        if (result.affectedRows > 0) {
          return res
            .status(200)
            .json({ message: "Lawyer assigned successfully" });
        } else {
          return res.status(404).json({ message: "Case not found" });
        }
      } else {
        // If the application doesn't exist, rollback the transaction

        return res.status(404).json({ message: "Application not found." });
      }
    }

    // Commit the transaction after all operations are successful
    await connection.commit();

    // Return a success message
    return res
      .status(200)
      .json({ message: "Application status updated successfully." });
  } catch (error) {
    // If any error occurs, rollback the transaction
    await connection.rollback();
    console.error("Error updating status:", error);
    res.status(500).json({ message: "Error updating request status." });
  }
});

app.get("/accepted-cases/:lawyerId", async (req, res) => {
  const { lawyerId } = req.params;
  try {
    const [cases] = await connection.query(
      `SELECT * FROM CASE_INY WHERE lawyerassigned = ? AND casestatus = 'Pending'`,
      [lawyerId]
    );

    if (cases.length > 0) {
      res.status(200).json(cases);
    } else {
      res.status(404).json({ message: "No accepted cases found." });
    }
  } catch (error) {
    console.error("Error fetching accepted cases:", error);
    res.status(500).json({ message: "Error fetching accepted cases." });
  }
});

app.post("/close-case/:caseId", async (req, res) => {
  const { caseId } = req.params;

  try {
    // Query to update the case status to 'closed'
    const [result] = await connection.query(
      `UPDATE CASE_INY SET casestatus = 'closed' WHERE caseid = ?`,
      [caseId]
    );

    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Case closed successfully." });
    } else {
      res.status(404).json({ message: "Case not found or already closed." });
    }
  } catch (error) {
    console.error("Error closing case:", error);
    res.status(500).json({ message: "Error closing the case." });
  }
});

app.get("/user-details/:user_id", async (req, res) => {
  const { user_id } = req.params;

  try {
    if (!user_id) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    const [rows] = await connection.execute(
      "SELECT * FROM users WHERE user_id = ?",
      [user_id]
    );

    // If the user doesn't exist, return null
    if (rows.length === 0) {
      return null;
    }
    if (!rows) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, rows });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching user details" });
  }
});

// Endpoint to fetch transaction details based on user_id, client_id, and amount
app.get("/transaction-details", async (req, res) => {
  const { userId, clientId, amount } = req.query;

  // Validate required parameters
  if (!userId || !clientId || !amount) {
    return res.status(400).json({
      message: "Missing required parameters: userId, clientId, amount",
    });
  }

  try {
    // Query to get transactions matching the parameters
    const [transactions] = await connection.execute(
      `SELECT * FROM transactions WHERE client_id = ? AND lawyer_id = ? AND amount = ?`,
      [userId, clientId, amount]
    );

    if (transactions.length === 0) {
      return res.status(404).json({
        message: "No transactions found matching the given parameters",
      });
    }

    // Return the transactions data
    return res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching transaction details:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// // Start the server
// app.listen(8000, () => {
//   console.log("Server is listening at port 8000");
// });
app.listen(8000, () => {
  console.log("Server is listening on all interfaces at port 8000");
});
