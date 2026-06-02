import { Router } from "express";
import { dbAvailable } from "../db";
import { stripeAvailable } from "../services/stripe";

export const healthRouter = Router();

healthRouter.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    time: new Date().toISOString(),
    services: { database: dbAvailable(), stripe: stripeAvailable() },
  });
});
