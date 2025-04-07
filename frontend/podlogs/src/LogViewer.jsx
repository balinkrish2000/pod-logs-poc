import { useState } from "react";
import "./LogViewer.css";

const LogViewer = () => {
    const [logs, setLogs] = useState([])
    const [isConnected, setIsConnected] = useState(false)
    const [ws, setWs] = useState(null)
    const [podName, setPodName] = useState("")

    const connectWebSocket = () => {
        if (!podName.trim()) {
            alert("Please enter a pod name!");
            return;
        }
    }

    //Close existing WebSocket connection (if any)
    if (ws) {
        ws.close()
    }

    const newWs = new WebSocket("wss://172.18.0.4:30718")

    newWs.onopen = () => {
        console.log("Connected to Websocket server")
        setIsConnected(true)
        newWs.send(podName) // Send pod name to server
    }

    newWs.onmessage = (event) => {
        setLogs((prevLogs) => [...prevLogs, event.data]) //Append new logs
    }

    newWs.onclose = () => {
        console.log("WebSocket disconnected")
        setIsConnected(false)
    }

    newWs.onerror = (error) => {
        console.error("WebSocket error:", error)
    }

    setLogs([]) //Clear previous logs
    setWs(newWs)

    return (
        <div className="container">
            <h2>Pod Logs</h2>

            {/* Input for pod name */}
            <div className="input-box">
                <input
                    type="text"
                    placeholder="Enter pod name"
                    value={podName}
                    onChange={(e) => setPodName(e.target.value)}
                />
                <button onClick={connectWebSocket}>Start Streaming</button>
            </div>

            {/* Log display */}
            <div className="log-box">
                {logs.length === 0 ? (
                    <p className="waiting">Waiting for logs...</p>
                ): (
                    logs.map((log, index) => {
                        <p key={index} className="log-entry">{log}</p>
                    })
                )
                }
            </div>

            {/* WebSocket status */}
            <p className="status">
                Status:{" "}
                <span className={isConnected ? "connected" : "disconnected"}>
                    {isConnected ? "Connected" : "Disconnected"}
                </span>
            </p>
        </div>
    )
}

export default LogViewer