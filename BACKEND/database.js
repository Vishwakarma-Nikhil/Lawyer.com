// database.js
import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

export const connection = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })
  .promise();

// export async function signup(username, password, isLawyer, additionalFields) {
//   try {
//     // Insert the user into the database with the username, password, and islawyer flag
//     const [result] = await connection.execute(
//       "INSERT INTO users (username, userpassword, islawyer) VALUES (?, ?, ?)",
//       [username, password, isLawyer ? 1 : 0]
//     );

//     // If the user is a lawyer, insert the additional lawyer-specific fields
//     if (isLawyer) {
//       const { type_of_lawyer, cases_won, cases_lost, court, description, dob } =
//         additionalFields;

//       // Insert lawyer-specific fields into the database (assuming you have columns in the users table)
//       await connection.execute(
//         "UPDATE users SET type_of_lawyer = ?, cases_won = ?, cases_lost = ?, court = ?, description = ?, dob = ? WHERE user_id = ?",
//         [
//           type_of_lawyer,
//           cases_won,
//           cases_lost,
//           court,
//           description,
//           dob,
//           result.insertId,
//         ]
//       );
//     }

//     // Fetch the newly created user to confirm and return user data
//     const [user] = await connection.execute(
//       "SELECT * FROM users WHERE user_id = ?",
//       [result.insertId]
//     );

//     return {
//       user_id: user[0].user_id,
//       username: user[0].username,
//       walletid: user[0].walletid,
//     };
//   } catch (error) {
//     console.error("Error during signup:", error);
//     throw error;
//   }
// }

// Authentication function
export async function auth(username, password) {
  try {
    const [rows] = await connection.execute(
      "SELECT userpassword FROM users WHERE username = ?",
      [username]
    );

    if (rows.length === 0) {
      console.log("User not found");
      return false;
    }
    const storedPassword = rows[0].userpassword;
    return storedPassword === password;
  } catch (error) {
    console.error("Error during authentication:", error);
    return false;
  }
}

//trasacntion logic using rollback commit savepoint
// Transaction function to transfer amount from one wallet to another
export async function transferAmount(
  senderWalletId,
  receiverWalletId,
  amount,
  caseId
) {
  const connect = await connection.getConnection();

  try {
    await connect.beginTransaction();

    // Fetch sender's user_id and balance
    const [senderRows] = await connect.execute(
      "SELECT user_id, balance FROM users WHERE walletid = ?",
      [senderWalletId]
    );
    if (senderRows.length === 0) throw new Error("Sender wallet not found");
    if (senderRows[0].balance < amount) throw new Error("Insufficient balance");

    const senderUserId = senderRows[0].user_id;

    // Fetch receiver's user_id
    const [receiverRows] = await connect.execute(
      "SELECT user_id FROM users WHERE walletid = ?",
      [receiverWalletId]
    );
    if (receiverRows.length === 0) throw new Error("Receiver wallet not found");

    const receiverUserId = receiverRows[0].user_id;

    // Debit sender's wallet
    await connect.execute(
      "UPDATE users SET balance = balance - ? WHERE walletid = ?",
      [amount, senderWalletId]
    );

    // Credit receiver's wallet
    await connect.execute(
      "UPDATE users SET balance = balance + ? WHERE walletid = ?",
      [amount, receiverWalletId]
    );

    // Record the transaction in the 'transactions' table
    const [transactionResult] = await connect.execute(
      "INSERT INTO transactions (client_id, lawyer_id, amount, status) VALUES (?, ?, ?, 'completed')",
      [senderUserId, receiverUserId, amount]
    );
    const transactionId = transactionResult.insertId; // Get the transaction ID

    // If a caseId is provided, update the case status to 'closed' and save the transaction ID
    if (caseId) {
      await connect.execute(
        "UPDATE CASE_INY SET paymentstatus = 1, transactionid = ? WHERE caseid = ?",
        [transactionId, caseId]
      );

      console.log(
        "Payment status updated and transaction ID saved for case ID:",
        caseId
      );
    }

    await connect.commit();
    return {
      success: true,
      message: "Transaction completed successfully",
      transactionId: transactionId,
    };
  } catch (error) {
    await connect.rollback();
    return { success: false, message: error.message };
  } finally {
    connect.release(); // Ensure connection is released back to the pool
  }
}

// Function to fetch all user data by username
export async function fetchUserData(username) {
  try {
    const [rows] = await connection.execute(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if (rows.length === 0) {
      throw new Error("User not found");
    }

    // Return the user's data
    return rows[0];
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}

export async function signup(username, password, isLawyer, additionalFields) {
  try {
    // Insert the user into the database with username, password, and islawyer flag
    const [result] = await connection.execute(
      "INSERT INTO users (username, userpassword, islawyer) VALUES (?, ?, ?)",
      [username, password, isLawyer ? 1 : 0]
    );

    // If the user is a lawyer, insert additional lawyer-specific fields
    if (isLawyer && additionalFields) {
      const { type_of_lawyer, cases_won, cases_lost, court, description, dob } =
        additionalFields;

      await connection.execute(
        `UPDATE users 
         SET type_of_lawyer = ?, cases_won = ?, cases_lost = ?, court = ?, description = ?, dob = ? 
         WHERE user_id = ?`,
        [
          type_of_lawyer,
          cases_won,
          cases_lost,
          court,
          description,
          dob,
          result.insertId,
        ]
      );
    }

    // Retrieve the wallet ID and balance from the database after the trigger execution
    const [user] = await connection.execute(
      "SELECT walletid, balance FROM users WHERE user_id = ?",
      [result.insertId]
    );

    // Return the new user data
    return {
      user_id: result.insertId,
      username,
      isLawyer,
      walletid: user[0].walletid,
      balance: user[0].balance,
    };
  } catch (error) {
    console.error("Error during signup:", error);
    throw error;
  }
}

export async function addCase(
  caseName,
  user_id,
  amount,
  caseDescription,
  caseType,
  court,
  lawyerAssigned = null, // Default to null if not provided
  transactionId = null // Default to null if not provided
) {
  try {
    const [result] = await connection.execute(
      `INSERT INTO CASE_INY (
        user_id, casename, paymentamount, paymentstatus, casestatus, casedescription, casetype, court, lawyerassigned, transactionid
      ) VALUES (?, ?, ?, FALSE, 'Pending', ?, ?, ?, ?, ?)`,
      [
        user_id,
        caseName,
        amount,
        caseDescription,
        caseType,
        court,
        lawyerAssigned,
        transactionId,
      ]
    );

    return {
      message: "Case added successfully",
      caseId: result.insertId,
    };
  } catch (error) {
    console.error("Error adding case:", error);
    throw error;
  }
}

export async function getUserCases(userId) {
  try {
    // Query to fetch all cases for the given user_id
    const [rows] = await connection.execute(
      "SELECT * FROM CASE_INY WHERE user_id = ?",
      [userId]
    );

    // Return the rows of cases
    return rows;
  } catch (error) {
    console.error("Error fetching cases from database:", error);
    throw error;
  }
}

// Function to get case details by caseId
export async function getCaseById(caseId) {
  try {
    // Query to fetch case details for the specified caseId
    const [rows] = await connection.execute(
      "SELECT * FROM CASE_INY WHERE caseid = ?",
      [caseId]
    );

    // If the case doesn't exist, return null
    if (rows.length === 0) {
      return null;
    }

    // Return the first row (case details)
    return rows[0];
  } catch (error) {
    console.error("Error fetching case details from database:", error);
    throw error;
  }
}

export async function getuserbyId(userId) {
  try {
    // Query to fetch user details for the specified userId
    const [rows] = await connection.execute(
      "SELECT * FROM users WHERE user_id = ?",
      [userId]
    );

    // If the user doesn't exist, return null
    if (rows.length === 0) {
      return null;
    }

    // Return the first row (user details)
    return rows[0];
  } catch (error) {
    console.error("Error fetching user details from database:", error);
    throw error;
  }
}
