const OC_API_KEY = "oc_44g72meh6_44g72meht_b0a22a1c4eb3543b95396844cf1b93d8c4ad596dd9d55a2a";

async function testOnlineCompiler() {
    console.log("Testing OnlineCompiler.io API...");
    try {
        const response = await fetch("https://api.onlinecompiler.io/api/run-code/", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": OC_API_KEY
            },
            body: JSON.stringify({
                compiler: "Py",
                code: "import sys\nprint('Hello from OnlineCompiler!')\nprint(f'Python version: {sys.version}')",
                input: "",
            }),
        });

        if (!response.ok) {
            console.error(`Status: ${response.status}`);
            console.error(await response.text());
            return;
        }

        const data = await response.json();
        console.log("API Response Headers:", response.headers.get("x-ratelimit-limit"));
        console.log("Result:", JSON.stringify(data, null, 2));
        
        if (data.output && data.output.includes("Hello from OnlineCompiler!")) {
            console.log("\n✅ SUCCESS: Code executed correctly!");
        } else {
            console.log("\n❌ FAILED: Output doesn't match expected.");
        }
    } catch (e) {
        console.error("Test failed", e);
    }
}

testOnlineCompiler();
