import "dotenv/config";
import express from "express";
import { prisma } from "./db/prisma.js";

const app = express();

//test

app.get("/", async (req, res) => {
  const xfFor = req.header("x-forwarded-for");
  const xfProto = req.header("x-forwarded-proto");
  const xfHost = req.header("x-forwarded-host");

  const viaProxy = Boolean(xfFor || xfProto || xfHost);

  let dbOk = false;
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbOk = true;
  } catch {
    dbOk = false;
  }

  res.json({
    ok: true,
    message: "✅ Server běží",
    viaProxy,
    forwarded: {
      "x-forwarded-for": xfFor ?? null,
      "x-forwarded-proto": xfProto ?? null,
      "x-forwarded-host": xfHost ?? null,
    },
    request: {
      method: req.method,
      url: req.originalUrl,
      host: req.header("host") ?? null,
      remoteAddress: req.socket.remoteAddress ?? null,
      userAgent: req.header("user-agent") ?? null,
    },
    db: {
      ok: dbOk,
    },
  });
});

const port = Number(process.env.PORT ?? 3000);

app.listen(port, "0.0.0.0", async () => {
  try {
    await prisma.$connect();
    console.log("✅ Connected to DB");
  } catch (e) {
    console.error("❌ DB connect failed:", e);
  }
  console.log(`🚀 Server listening on http://0.0.0.0:${port}`);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

app.post("/auth/login", (req, res) => {
  console.log("✅ Login button clicked");

  res.json({
    ok: true,
    redirectTo: "/admin",
    message: "Login successful",
  });
});