import SentinelSDK from "./sentinel-sdk";

const savedUserId =
  localStorage.getItem("sentinelUserId") ||
  "anonymous";

const savedSessionId =
  localStorage.getItem("sentinelSessionId") ||
  null;

export const sentinel = new SentinelSDK({
  endpoint:
    process.env.REACT_APP_SENTINEL_ENDPOINT || "https://sentinel-layer-general.onrender.com/evaluate",

  apiKey:
    process.env.REACT_APP_SENTINEL_API_KEY || "c493d2858ab64449ab5492d37e0f943700a1cf4ceaa744ee84445991c1843e76",

  userId: savedUserId,
  sessionId: savedSessionId,
});

export const initializeSentinelSession = (
  userId,
  sessionId
) => {
  if (userId) {
    localStorage.setItem(
      "sentinelUserId",
      String(userId)
    );

    sentinel.setUserId(String(userId));
  }

  if (sessionId) {
    localStorage.setItem(
      "sentinelSessionId",
      String(sessionId)
    );

    sentinel.setSessionId(String(sessionId));
  }
};

if (typeof window !== "undefined") {
  window.sentinel = sentinel;
}