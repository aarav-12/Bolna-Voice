/* eslint-disable no-unused-vars */
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
  },
  "789": {
    product: "Puma Running Shoes",
    returnWindow: true
  }
};


const returns = [];


app.post("/check-order", (req, res) => {
  const orderId = String(req.body.orderId);

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
app.get("/bolna-token", async (req, res) => {
  try {
    const response = await fetch("https://api.bolna.ai/v1/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.BOLNA_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        agent_id: "06a7e00a-6b7b-4e89-ac2d-7d35348d526e"
      })
    });

    const data = await response.json();

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to create session" });
  }
});

app.post("/create-return", (req, res) => {
  const { orderId, reason } = req.body;

  if (!orders[orderId]) {
    return res.json({
      status: "error",
      message: "Order does not exist"
    });
  }

  const newReturn = {
    id: Date.now(),
    orderId,
    product: orders[orderId].product,
    reason,
    status: "Return Created",
    createdAt: new Date().toISOString()
  };

  returns.push(newReturn);

  res.json({
    status: "return_created",
    return: newReturn,
    labelUrl: "https://return-label-demo.com/label.pdf"
  });
});


app.get("/returns", (req, res) => {
  res.json(returns);
});


app.get("/", (req, res) => {
  res.send("Voice AI Returns API running");
});



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});