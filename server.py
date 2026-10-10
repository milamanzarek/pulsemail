#!/usr/bin/env python3
"""
PulseMail Local Development Server
Lightweight static file server for PulseMail Studio.
Usage:
    python server.py [port]
"""

import sys
import os
import http.server
import socketserver
import webbrowser

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Enable CORS and caching headers for local testing
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

def main():
    os.chdir(DIRECTORY)
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("127.0.0.1", PORT), Handler) as httpd:
        url = f"http://127.0.0.1:{PORT}"
        print("=" * 60)
        print(" PulseMail | Gmail Responsive Newsletter Studio")
        print("=" * 60)
        print(f" [OK] Local server running at: {url}")
        print(" [OK] Press Ctrl+C to stop the server.")
        print("=" * 60)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")

if __name__ == "__main__":
    main()
