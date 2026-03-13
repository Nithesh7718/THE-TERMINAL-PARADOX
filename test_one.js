const OC_KEY = "oc_44g72meh6_44g72meht_b0a22a1c4eb3543b95396844cf1b93d8c4ad596dd9d55a2a";

async function testOneCompilerCom() {
    console.log("Testing OneCompiler.com API...");
    try {
        const response = await fetch("https://onecompiler.com/api/code/exec", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "X-OneCompiler-Key": OC_KEY // Guessing the header name, need to verify
            },
            body: JSON.stringify({
                language: "python",
                stdin: "",
                files: [
                    {
                        name: "solution.py",
                        content: "print('Hello from OneCompiler.com')"
                    }
                ]
            }),
        });

        console.log("Status:", response.status);
        const data = await response.json();
        console.log("Result:", JSON.stringify(data, null, 2));
    } catch (e) {
        console.error("Test failed", e);
    }
}

testOneCompilerCom();
