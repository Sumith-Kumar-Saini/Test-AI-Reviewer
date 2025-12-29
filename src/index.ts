import "dotenv/config";
import express, { Request, Response } from "express";
import morgan from "morgan";
import reviewerRouter from "./routers/reviewer";
import path from "path";

const { log, error } = console;
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(morgan("dev"));

app.use(express.static(path.join(__dirname, "../public")));

app.get("/", async (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../view", "index.html"));
});

app.use("/service", reviewerRouter);

app.listen(PORT, function (err) {
  if (err) {
    error(err);
    process.exit(1);
  }
  log(`Server is listening on port ${PORT}`);
});
