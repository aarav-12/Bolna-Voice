/* eslint-disable no-undef */
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const orders = {
  "123": {
    product: "Nike Shoes",
    returnWindow: true
  },
  "456": {
    product: "Adidas Jacket",
    returnWindow: false
  }
};

app.post("/check-order", (req, res) => {
  const { orderId } = req.body;

  if (!orders[orderId]) {
    return res.json({
      valid: false,
      message: "Order not found"
    });
  }

  res.json({
    valid: true,
    product: orders[orderId].product,
    eligibleForReturn: orders[orderId].returnWindow
  });
});

app.post("/create-return", (req, res) => {
  const { orderId, reason } = req.body;

  res.json({
    status: "return_created",
    orderId,
    reason,
    labelUrl: "https://return-label-demo.com/label.pdf"
  });
});

app.get("/", (req, res) => {
  res.send("Voice AI Returns API running");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});