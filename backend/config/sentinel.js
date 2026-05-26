export const sentinelConfig = {
  apiKey: "c7590710d8114a279748dc08cacb75762b8d4a043e7840c3b1d43b3f5aac8da0",
  evaluateUrl: process.env.SENTINEL_EVALUATE_URL || "http://localhost:3001/evaluate",
  timeout: 2000,
  failOpen: true
};
