import express from "express";
import { Provider } from "oidc-provider";
import path from "path";
import bodyParser from "body-parser";
import { Configuration } from "oidc-provider";

import { interactionHandler, interactionFinished } from "./routes/interaction";
import { findAccount, authenticate, register } from "./account";

const app = express();
const port = 3000;

const configuration: Configuration = {
  clients: [
    {
      client_id: "PokeBook",
      client_secret: "foobar",
      redirect_uris: ["http://localhost:5000/callback"],
      response_types: ["code"],
      grant_types: ["authorization_code"],
      token_endpoint_auth_method: "client_secret_basic",
    },
  ],
  findAccount: findAccount,
  cookies: {
    keys: ["your-secret-key-here"],
  },
  features: {
    devInteractions: { enabled: false },
  },
};

const oidc = new Provider("http://localhost:3000", configuration);

app.locals.provider = oidc;

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.urlencoded({ extended: false }));

app.get("/interaction/:uid", interactionHandler);

app.post("/interaction/:uid/login", interactionFinished);

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const account = await register(email, password);

  res.redirect("/");
});

app.get("/authenticate", (req, res) => {
  res.render("authenticate");
});

app.post("/authenticate", async (req, res) => {
  const { email, password } = req.body;
  const account = await authenticate(email, password);

  if (!account) {
    res.render("authenticate", { error: "Invalid email or password" });
    return;
  }

  res.redirect("/");
});

app.use(oidc.callback());

app.listen(port, () => {
  console.log(`Identity Provider is running at http://localhost:${port}`);
});
