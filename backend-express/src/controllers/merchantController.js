const products = [
  {
    sku: "PRO_RACK",
    name: "Aegis Pro Rack Server",
    description: "Enterprise High-Performance AI Compute Rack",
    base_price: 500,
    currency: "INR",
    max_negotiable_discount: 15,
    stock_quantity: 50,
    category: "Hardware"
  },
  {
    sku: "CLOUD_GPU",
    name: "Enterprise GPU Node",
    description: "Dedicated 8x H100 GPU Instance",
    base_price: 1200,
    currency: "INR",
    max_negotiable_discount: 12,
    stock_quantity: 30,
    category: "Cloud"
  },
  {
    sku: "AP2_GATEWAY",
    name: "AP2 Protocol Appliance",
    description: "Hardware Security Module for x402 Commerce",
    base_price: 350,
    currency: "INR",
    max_negotiable_discount: 10,
    stock_quantity: 100,
    category: "Security"
  }
];

let merchantPolicy = {
  id: "pol_default_001",
  merchant_id: "mch_razorpay_998",
  max_discount_percentage: 15,
  max_transaction_value: 100000,
  allowed_currency: "INR",
  max_quantity_per_order: 20
};

const getProducts = (req, res) => {
  res.json(products);
};

const getPolicy = async (req, res) => {
  try {
    const springUrl = `${process.env.GATEKEEPER_URL || 'http://localhost:8080/api/v1'}/policies`;
    const response = await fetch(springUrl);
    if (response.ok) {
      const data = await response.json();
      return res.json(data);
    }
  } catch (err) {
    // Fallback to local memory policy if Spring isn't connected
  }
  res.json(merchantPolicy);
};

const updatePolicy = async (req, res) => {
  const newPolicy = req.body;
  try {
    const springUrl = `${process.env.GATEKEEPER_URL || 'http://localhost:8080/api/v1'}/policies`;
    const response = await fetch(springUrl, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPolicy)
    });
    if (response.ok) {
      const data = await response.json();
      return res.json(data);
    }
  } catch (err) {
    // Fallback update
  }
  merchantPolicy = { ...merchantPolicy, ...newPolicy };
  res.json(merchantPolicy);
};

module.exports = {
  getProducts,
  getPolicy,
  updatePolicy
};
