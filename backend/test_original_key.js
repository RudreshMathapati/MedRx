async function checkOriginalKey() {
    const key = "c493d2858ab64449ab5492d37e0f943700a1cf4ceaa744ee84445991c1843e76";
    console.log("Evaluating using original key:", key);
    try {
        const res = await fetch("https://sentinel-layer-general.onrender.com/evaluate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Sentinel-Key": key
            },
            body: JSON.stringify({
                user_id: "usr_premium_user",
                session_id: "sess_test_runner_orig",
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
    } catch (e) {
        console.error("Error:", e.message);
    }
}
checkOriginalKey();
