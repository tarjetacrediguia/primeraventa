// src/infrastructure/server/http.server.ts
import express from "express";
import { applyMiddlewares } from "./middlewares";
import { errorHandler } from "./error-handler";
import { Router } from "express";
import { appConfig } from "../config/server/AppConfig";

export const createHTTPServer = (router: Router) => {
  const app = express();

  

  applyMiddlewares(app);
  app.use("/API/v1", router);
  app.use(errorHandler);

  return app;
};
