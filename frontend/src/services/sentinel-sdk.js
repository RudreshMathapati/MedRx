/**
 * Sentinel Security SDK
 * Advanced Client-side telemetry tracking
 */

class SentinelSDK {
  constructor(config = {}) {
    this.endpoint =
      config.endpoint ||
      "http://localhost:3001/evaluate";

    this.apiKey =
      config.apiKey || null;

    this.userId =
      config.userId || "anonymous";

    this.sessionId =
      config.sessionId ||
      this._generateSessionId();

    this.keystrokes = 0;
    this.typingStartTime = null;

    this.mouseDistance = 0;
    this.lastMousePos = null;

    this.pageLoadTime = Date.now();

    this._initListeners();
  }

  setUserId(userId) {
    this.userId = userId;
  }

  setSessionId(sessionId) {
    this.sessionId = sessionId;
  }

  getTelemetry() {

    const timeOnPage =
      Math.round(
        (Date.now() -
          this.pageLoadTime) /
          1000
      );

    let avgTypingSpeed = 0;

    if (
      this.keystrokes > 1 &&
      this.typingStartTime
    ) {

      const mins =
        (Date.now() -
          this.typingStartTime) /
        60000;

      if (mins > 0) {
        avgTypingSpeed =
          Math.round(
            this.keystrokes / mins
          );
      }
    }

    let avgMouseVelocity = 0;

    if (timeOnPage > 0) {
      avgMouseVelocity =
        Math.round(
          this.mouseDistance /
            timeOnPage
        );
    }

    return {
      user_id:
        this.userId,

      session_id:
        this.sessionId,

      action: {
        type: "page_view",
      },

      network: {
        user_agent:
          navigator.userAgent,
      },

      device: {
        fingerprint:
          this._generateFingerprint(),

        browser:
          this._getBrowser(),

        os:
          this._getOS(),

        screen_resolution:
          `${window.screen.width}x${window.screen.height}`,

        timezone:
          Intl.DateTimeFormat()
            .resolvedOptions()
            .timeZone,

        language:
          navigator.language,
      },

      behavioral: {
        typing_speed:
          avgTypingSpeed,

        mouse_velocity:
          avgMouseVelocity,

        time_on_page:
          timeOnPage,
      },
    };
  }

  async evaluate(
    actionType = "page_view"
  ) {

    const telemetry =
      this.getTelemetry();

    telemetry.action.type =
      actionType;

    telemetry.timestamp =
      new Date().toISOString();

    const headers = {
      "Content-Type":
        "application/json",
    };

    if (this.apiKey) {
      headers[
        "X-Sentinel-Key"
      ] = this.apiKey;
    }

    try {

      const response =
        await fetch(
          this.endpoint,
          {
            method: "POST",
            headers,
            body: JSON.stringify(
              telemetry
            ),
          }
        );

      if (!response.ok) {

        const errData =
          await response.json();

        throw new Error(
          errData.error
            ?.message ||
            `HTTP ${response.status}`
        );
      }

      return await response.json();

    } catch (err) {

      console.error(
        "[SentinelSDK]",
        err.message
      );

      return {
        error:
          err.message,
        risk_score: 0,
        risk_level:
          "LOW",
        action:
          "allow",
      };
    }
  }

  // =================================
  // Helpers
  // =================================

  _generateSessionId() {
    return (
      "sess_" +
      Math.random()
        .toString(36)
        .substring(2, 15) +
      Math.random()
        .toString(36)
        .substring(2, 15)
    );
  }

  _generateFingerprint() {

    const raw =
      navigator.userAgent +
      navigator.language +
      window.screen.width +
      window.screen.height +
      Intl.DateTimeFormat()
        .resolvedOptions()
        .timeZone;

    let hash = 0;

    for (
      let i = 0;
      i < raw.length;
      i++
    ) {
      hash =
        (hash << 5) -
        hash +
        raw.charCodeAt(i);

      hash |= 0;
    }

    return (
      "fp_" +
      Math.abs(hash)
    );
  }

  _getBrowser() {

    const ua =
      navigator.userAgent;

    if (
      ua.includes("Firefox")
    )
      return "Firefox";

    if (
      ua.includes("Edg")
    )
      return "Edge";

    if (
      ua.includes("Chrome")
    )
      return "Chrome";

    if (
      ua.includes("Safari")
    )
      return "Safari";

    return "Unknown";
  }

  _getOS() {

    const ua =
      navigator.userAgent;

    if (
      ua.includes("Windows")
    )
      return "Windows";

    if (
      ua.includes("Mac")
    )
      return "MacOS";

    if (
      ua.includes("Linux")
    )
      return "Linux";

    if (
      ua.includes("Android")
    )
      return "Android";

    if (
      ua.includes("iPhone")
    )
      return "iOS";

    return "Unknown";
  }

  _initListeners() {

    if (
      typeof window ===
        "undefined" ||
      typeof document ===
        "undefined"
    ) {
      return;
    }

    document.addEventListener(
      "mousemove",
      (e) => {

        const currentPos = {
          x: e.clientX,
          y: e.clientY,
        };

        if (
          this.lastMousePos
        ) {

          const dx =
            currentPos.x -
            this.lastMousePos.x;

          const dy =
            currentPos.y -
            this.lastMousePos.y;

          const dist =
            Math.sqrt(
              dx * dx +
                dy * dy
            );

          this.mouseDistance +=
            dist;
        }

        this.lastMousePos =
          currentPos;
      }
    );

    document.addEventListener(
      "keydown",
      () => {

        if (
          !this.typingStartTime
        ) {
          this.typingStartTime =
            Date.now();
        }

        this.keystrokes++;
      }
    );
  }
}

if (
  typeof module !==
    "undefined" &&
  module.exports
) {

  module.exports =
    SentinelSDK;

} else if (
  typeof window !==
  "undefined"
) {

  window.SentinelSDK =
    SentinelSDK;
}