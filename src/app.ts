import express, { Application } from "express";

const app: Application = express();
app.get("/", (req, res) => {
  res.send("Prisma blog app is running");
});
export default app;
