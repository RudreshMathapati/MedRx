async function testLogin() {
    try {
        const res = await fetch("https://sentinel-layer-general.onrender.com/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: "test@gmail.com",
                password: "test@123"
            })
        });
        console.log("Status:", res.status);
        const data = await res.json();
        console.log("Response:", data);
    } catch (e) {
        console.error("Error:", e.message);
    }
}
testLogin();
