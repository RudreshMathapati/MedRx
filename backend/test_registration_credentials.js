async function testReg() {
    try {
        const res = await fetch("https://sentinel-layer-general.onrender.com/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: "test_new_runner@gmail.com",
                password: "testpassword123",
                tenantName: "E2E Test Tenant Runner"
            })
        });
        console.log("Status:", res.status);
        const data = await res.json();
        console.log("Response:", data);
    } catch (e) {
        console.error("Error:", e.message);
    }
}
testReg();
