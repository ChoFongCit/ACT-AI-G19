const express = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');
const User = require('../models/users');
const deleteAccountRouter = express.Router();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

deleteAccountRouter.get("/delete-request", (req, res) => {
  res.render("deleteAccount", { title: "Delete Account", errorMessage: null, successMessage: null });
});

deleteAccountRouter.post("/delete-request", async (req, res) => {
  const { reason } = req.body;
  const userId = req.session.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.redirect("/accounts/login");
    }

    const deletionToken = crypto.randomBytes(32).toString('hex');
    const updatedUser = await User.findByIdAndUpdate(userId, {
      deletionToken,
      deletionTokenExpiration: Date.now() + 259200000 // 3 days
    }, { new: true }); 

    const admins = await User.find({ role: "admin" });
    const adminEmails = admins.map(admin => admin.email);

    const deletionURL = `http://127.0.0.1:3000/accounts/delete-user/${userId}/${encodeURIComponent(updatedUser.deletionToken)}`;

    const msg = {
      to: adminEmails,
      from: 'AgenticCorporateTrader@gmail.com',
      subject: "Account Deletion Request",
      html: `<p>A user has requested account deletion.</p>
             <p><strong>Reason:</strong> ${reason}</p>
             <p><strong>Username:</strong> ${user.username}</p>
             <p><strong>Email:</strong> ${user.email}</p>
             <p><a href="${deletionURL}">Click here to delete this account</a></p>`
    };

    await sgMail.sendMultiple(msg);

    res.render("deleteAccount", {
      title: "Delete Account",
      errorMessage: null,
      successMessage: "Your request has been submitted. It will be reviewed shortly."
    });
  } catch (error) {
    console.error("Error processing deletion request:", error);
    res.render("deleteAccount", {
      title: "Delete Account",
      errorMessage: "There was an error processing your request. Please try again.",
      successMessage: null
    });
  }
});

deleteAccountRouter.get('/delete-user/:userId/:token', async (req, res) => {
  const { userId, token } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) {
      console.error("User not found");
      return res.status(404).json({ success: false, message: "User not found." });
    }
    if (user.deletionToken !== decodeURIComponent(token)) {
      console.error("Token mismatch. Provided:", token, "Expected:", user.deletionToken);
      return res.status(404).json({ success: false, message: "Invalid deletion link." });
    }
    if (user.deletionTokenExpiration < Date.now()) {
      console.error("Token expired");
      return res.status(404).json({ success: false, message: "Expired deletion link." });
    }

    await User.findByIdAndDelete(userId);

    const msg = {
      to: user.email,
      from: 'AgenticCorporateTrader@gmail.com',
      subject: 'ACT-AI Account Deleted',
      html: 'Your ACT-AI account has been deleted by an administrator.'
    };
    await sgMail.send(msg);

    res.json({ success: true, message: "User account deleted successfully." });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

module.exports = deleteAccountRouter;
