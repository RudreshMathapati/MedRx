import express from "express";
import crypto from "crypto";

const router = express.Router();

router.post(
  "/",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    try {
      const signature =
        req.headers["x-sentinel-signature"];

      if (!signature) {
        return res
          .status(401)
          .send("Missing signature");
      }

      const secret =
        process.env.SENTINEL_WEBHOOK_SECRET;

      const expected =
        "sha256=" +
        crypto
          .createHmac("sha256", secret)
          .update(req.body)
          .digest("hex");

      if (signature !== expected) {
        return res
          .status(403)
          .send("Invalid signature");
      }

      const payload = JSON.parse(
        req.body.toString()
      );

      console.log(
        "[SENTINEL WEBHOOK]"
      );

      console.log(payload);

      res.status(200).send("OK");

    } catch (err) {
      console.error(
        "[SENTINEL WEBHOOK ERROR]",
        err
      );

      res.status(500).send("Error");
    }
  }
);

export default router;