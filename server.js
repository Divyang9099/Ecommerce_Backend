<<<<<<< HEAD

import dotenv from "dotenv";
dotenv.config();

const { default: app } = await import("./src/app.js");
const { default: connectDB } = await import("./src/config/db.js");
=======
import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import connectDB from "./src/config/db.js";
>>>>>>> 5b738b36991f8f7182b4bd3c805e368a3b628b26

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
