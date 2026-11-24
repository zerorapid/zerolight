import http from "node:http";
import net from "node:net";

const PORT = 3001;
const TARGET_HOST = "127.0.0.1";
const TARGET_PORT = 3000;

const server = http.createServer((req, res) => {
  let targetPath = req.url;
  // If hitting root, direct straight to isolated /studio dock
  if (targetPath === "/" || targetPath === "") {
    targetPath = "/studio";
  }

  const options = {
    hostname: TARGET_HOST,
    port: TARGET_PORT,
    path: targetPath,
    method: req.method,
    headers: {
      ...req.headers,
      host: `localhost:${TARGET_PORT}`,
    },
  };

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  proxyReq.on("error", (err) => {
    res.writeHead(502, { "Content-Type": "text/plain" });
    res.end("Waiting for Next.js dev server on port 3000 to be ready...");
  });

  req.pipe(proxyReq, { end: true });
});

// Proxy WebSocket for Next.js hot module replacement (Fast Refresh)
server.on("upgrade", (req, socket, head) => {
  const proxySocket = net.connect(TARGET_PORT, TARGET_HOST, () => {
    proxySocket.write(
      `${req.method} ${req.url} HTTP/${req.httpVersion}\r\n` +
        Object.entries(req.headers)
          .map(([k, v]) => `${k}: ${v}`)
          .join("\r\n") +
        "\r\n\r\n"
    );
    proxySocket.write(head);
    socket.pipe(proxySocket);
    proxySocket.pipe(socket);
  });

  proxySocket.on("error", () => socket.destroy());
  socket.on("error", () => proxySocket.destroy());
});

server.listen(PORT, () => {
  console.log(`\n🚀 ZeroLight Visual Studio Dock Staging Sandbox running on http://localhost:${PORT}\n`);
});
