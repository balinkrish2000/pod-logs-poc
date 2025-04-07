const WebSocker = require("ws");
const { exec } = require("child_process");

const wss = new WebSocker.Server({port: 9000})

wss.on("connection", (ws) => {
    console.log("Client connected");

    ws.on("message", (message) => {
        const podName = message.toString().trim();
        console.log(`Streaming logs from: ${podName}`);

        if (!podName) {
            ws.send("Error: No pod name provided");
            return;
        }

        // Start streaming logs
        const logStream = exec(`kubectl logs -f ${podName}`)

        logStream.stdout.on("data", (data) => {
            ws.send(data.toString());
        })

        logStream.stderr.on("data",(error) => {
            ws.send(`Error: ${error}`);
        })

        ws.on("close", () => {
            console.log("Client disconnected");
            logStream.kill();
        })
    })

    ws.send("Send pod name to start streaming logs.")
})

console.log("WebSocket server running on ws://localhost:9000")