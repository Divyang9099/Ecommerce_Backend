
export const rootOnly = (req, res) => {
  res.json({ message: "Welcome Root Admin" });
};

export const orderManagerOnly = (req, res) => {
  res.json({ message: "Order Manager Access" });
};
