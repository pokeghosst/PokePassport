import { Request, Response } from "express";
import { Provider } from "oidc-provider";
import { authenticate } from "../account";

export async function interactionHandler(req: Request, res: Response) {
  const provider = req.app.locals.provider as Provider;
  const { uid, prompt, params } = await provider.interactionDetails(req, res);

  if (prompt.name === "login") {
    res.render("login", { uid, params });
  } else {
    res.status(501).send("Not implemented");
  }
}

export async function interactionFinished(req: Request, res: Response) {
  const provider = req.app.locals.provider as Provider;
  const { uid, prompt, params } = await provider.interactionDetails(req, res);
  const { email, password } = req.body;

  const account = await authenticate(email, password);

  if (!account) {
    res.render("login", { uid, params, error: "Invalid email or password" });
    return;
  }

  const result = {
    login: { accountId: account.accountId },
  };

  await provider.interactionFinished(req, res, result, {
    mergeWithLastSubmission: false,
  });
}
