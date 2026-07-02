// Using Node's native global fetch.

async function runTests() {
    console.log("=== STARTING END-TO-END INTEGRATION TESTS ===");
    console.log("Sentinel URL: https://sentinel-layer-general.onrender.com");
    console.log("MedRx URL: http://localhost:5000\n");

    const key1 = "229ab87fd0904f6dab62a283231fa7a1ccc3a8fa28f443278a16f926c5183868";
    const key2 = "bd250f3061ef46c791664a7a7cc8024c0cddc6aa00b547058e2cc5a45ec12ad6";

    // --- TEST 1: Direct Health Check ---
    console.log("Test 1: Direct health check to Sentinel Layer General...");
    try {
        const res = await fetch("https://sentinel-layer-general.onrender.com/health");
        console.log(`Status: ${res.status}`);
        const data = await res.json();
        console.log("Response:", data);
        if (data.status === "ok") {
            console.log("✅ Test 1 Passed!");
        } else {
            console.log("❌ Test 1 Failed!");
        }
    } catch (e) {
        console.error("❌ Test 1 Errored:", e.message);
    }
    console.log("------------------------------------------\n");

    // --- TEST 2: Direct Evaluate (Normal User - LOW Risk) using Key 1 ---
    console.log("Test 2: Direct evaluation (LOW risk) to Sentinel using Key 1...");
    try {
        const res = await fetch("https://sentinel-layer-general.onrender.com/evaluate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Sentinel-Key": key1
            },
            body: JSON.stringify({
                user_id: "usr_premium_user",
                session_id: "sess_test_runner_01",
                action: { type: "page_view" },
                network: { ip_address: "12.166.45.102" },
                behavioral: {
                    typing_speed: 65,
                    mouse_velocity: 140,
                    time_on_page: 25
                }
            })
        });
        console.log(`Status: ${res.status}`);
        const data = await res.json();
        console.log("Response:", data);
        if (data.risk && data.risk.level === "LOW") {
            console.log("✅ Test 2 Passed!");
        } else {
            console.log("❌ Test 2 Failed!");
        }
    } catch (e) {
        console.error("❌ Test 2 Errored:", e.message);
    }
    console.log("------------------------------------------\n");

    // --- TEST 3: Direct Evaluate (Normal User - LOW Risk) using Key 2 ---
    console.log("Test 3: Direct evaluation (LOW risk) to Sentinel using Key 2 (test2@gmail.com)...");
    try {
        const res = await fetch("https://sentinel-layer-general.onrender.com/evaluate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Sentinel-Key": key2
            },
            body: JSON.stringify({
                user_id: "usr_premium_user",
                session_id: "sess_test_runner_02",
                action: { type: "page_view" },
                network: { ip_address: "12.166.45.102" },
                behavioral: {
                    typing_speed: 65,
                    mouse_velocity: 140,
                    time_on_page: 25
                }
            })
        });
        console.log(`Status: ${res.status}`);
        const data = await res.json();
        console.log("Response:", data);
        if (data.risk && data.risk.level === "LOW") {
            console.log("✅ Test 3 Passed!");
        } else {
            console.log("❌ Test 3 Failed!");
        }
    } catch (e) {
        console.error("❌ Test 3 Errored:", e.message);
    }
    console.log("------------------------------------------\n");

    // --- TEST 4: Direct Evaluate (Bot - HIGH Risk) using Key 2 ---
    console.log("Test 4: Direct evaluation (HIGH risk) to Sentinel using Key 2 (test2@gmail.com)...");
    try {
        const res = await fetch("https://sentinel-layer-general.onrender.com/evaluate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Sentinel-Key": key2
            },
            body: JSON.stringify({
                user_id: "usr_premium_user",
                session_id: "sess_test_runner_bot_02",
                action: { type: "login" },
                network: { ip_address: "103.45.162.18", user_agent: "curl/8.2.1" },
                behavioral: {
                    typing_speed: 950,
                    mouse_velocity: 0,
                    time_on_page: 1,
                    copy_paste_detected: true
                },
                flags: {
                    is_tor: true,
                    is_datacenter_ip: true
                }
            })
        });
        console.log(`Status: ${res.status}`);
        const data = await res.json();
        console.log("Response:", data);
        if (data.risk && data.risk.score >= 30) {
            console.log("✅ Test 4 Passed! Score is high/medium as expected.");
        } else {
            console.log("❌ Test 4 Failed!");
        }
    } catch (e) {
        console.error("❌ Test 4 Errored:", e.message);
    }
    console.log("------------------------------------------\n");

    // --- TEST 5: MedRx Login Integration (LOW Risk - ALLOW) using test2@gmail.com ---
    console.log("Test 5: MedRx Login request (LOW risk user test2@gmail.com)...");
    try {
        const res = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: "test2@gmail.com",
                password: "test2@123",
                sentinelTelemetry: {
                    session_id: "sess_login_test2_normal",
                    behavioral: {
                        typing_speed: 60,
                        mouse_velocity: 120,
                        time_on_page: 15
                    }
                }
            })
        });
        console.log(`Status: ${res.status}`);
        const data = await res.json();
        console.log("Response:", data);
        if (res.status === 200 && data.token) {
            console.log("✅ Test 5 Passed! Token successfully received.");
        } else {
            console.log("❌ Test 5 Failed!");
        }
    } catch (e) {
        console.error("❌ Test 5 Errored:", e.message);
    }
    console.log("------------------------------------------\n");

    // --- TEST 6: MedRx Login Integration (HIGH Risk - BLOCK) using test2@gmail.com ---
    console.log("Test 6: MedRx Login request (HIGH risk bot test2@gmail.com) - sending 12 concurrent requests...");
    try {
        const promises = [];
        for (let i = 0; i < 12; i++) {
            promises.push(
                fetch("http://localhost:5000/api/auth/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-Forwarded-For": "103.45.162.18"
                    },
                    body: JSON.stringify({
                        email: "test2@gmail.com",
                        password: "test2@123",
                        sentinelTelemetry: {
                            session_id: "sess_login_test2_bot_burst",
                            network: {
                                user_agent: "curl/8.2.1"
                            },
                            behavioral: {
                                typing_speed: 999,
                                mouse_velocity: 0,
                                time_on_page: 1,
                                copy_paste_detected: true
                            }
                        }
                    })
                })
            );
        }
        const responses = await Promise.all(promises);
        let blocked = false;
        let triggeredVerdict = "";
        for (const res of responses) {
            console.log(`Request status: ${res.status}`);
            const data = await res.json();
            if (res.status === 403 && (data.sentinelVerdict === "VERIFY" || data.sentinelVerdict === "BLOCK" || data.sentinelVerdict === "TERMINATE_SESSION")) {
                blocked = true;
                triggeredVerdict = data.sentinelVerdict;
            }
        }
        
        if (blocked) {
            console.log(`✅ Test 6 Passed! Verdict successfully triggered: ${triggeredVerdict}`);
        } else {
            console.log("❌ Test 6 Failed!");
        }
    } catch (e) {
        console.error("❌ Test 6 Errored:", e.message);
    }
    console.log("------------------------------------------\n");

    console.log("=== TESTS COMPLETE ===");
}

runTests();
