import http.server
import socketserver

PORT = 8000

Handler = http.server.SimpleHTTPRequestHandler
Handler.extensions_map.update({
    ".js": "application/javascript",
})

print(f"Serving on http://localhost:{PORT}")
socketserver.TCPServer(("", PORT), Handler).serve_forever()