import "dotenv/config";
import express, { Request, Response } from "express";
import morgan from "morgan";
import reviewerRouter from "./routers/reviewer";

const { log, clear, error } = console;
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(morgan("dev"));

app.get("/", async (req: Request, res: Response) => {
  res.json({ message: "hello world" });
});

app.use("/service", reviewerRouter);

app.listen(PORT, function (err) {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  log(`Server is listening on port ${PORT}`);
});
