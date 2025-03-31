import { app } from "../app.js";
import { DefaultData, response } from "../response.js";

export const CveRouter = app()

CveRouter.get("/", async (req, res) => {
  response(res, DefaultData, "Ok")
})

