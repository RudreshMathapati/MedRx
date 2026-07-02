async function registerUsers() {
    console.log("Registering requested users on Sentinel Render instance...");

    const users = [
        { email: "test@gmail.com", password: "test@123", tenantName: "MedRx Test Tenant 1" },
        { email: "test2@gmail.com", password: "test2@123", tenantName: "MedRx Test Tenant 2" }
    ];

    for (const u of users) {
        console.log(`\nRegistering: ${u.email}...`);
        try {
            const res = await fetch("https://sentinel-layer-general.onrender.com/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(u)
            });
            console.log("Status:", res.status);
            const data = await res.json();
            console.log("Response:", data);
        } catch (e) {
            console.error("Error registering user:", e.message);
        }
    }
}
registerUsers();
