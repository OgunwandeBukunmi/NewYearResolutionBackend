import "dotenv/config";
import express from "express";
import cors from "cors";

console.log("GROQ KEY EXISTS:", !!process.env.GROQ_API_KEY);
import sharePageRoute from "./src/routes/sharePageRoute.js"
import generateRoute from "./src/routes/generateRoute.js";
import shareRoute from "./src/routes/shareRoute.js";

const app = express();
app.use(cors(

));
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ limit: "15mb", extended: true }));

app.use("/api/generate", generateRoute);
app.use("/api/share", shareRoute);
app.use("/share",sharePageRoute )

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
