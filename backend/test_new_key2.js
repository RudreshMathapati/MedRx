async function checkNewKey2() {
    const key = "bd250f3061ef46c791664a7a7cc8024c0cddc6aa00b547058e2cc5a45ec12ad6";
    console.log("Evaluating using newly generated key for test2@gmail.com:", key);
    try {
        const res = await fetch("https://sentinel-layer-general.onrender.com/evaluate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Sentinel-Key": key
            },
            body: JSON.stringify({
                user_id: "test2_user",
                session_id: "sess_test2_new_01",
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
checkNewKey2();
