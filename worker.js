export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    const UUID = "d0e92004-cf2a-4ec3-8d65-3640c20a7fd2";
    const PATH = "/vless";

    if (url.pathname !== PATH) {
      return new Response("Not Found", { status: 404 });
    }

    if (request.headers.get("Upgrade") !== "websocket") {
      return new Response("Expected WebSocket", { status: 400 });
    }

    const pair = new WebSocketPair();
    const client = pair[0];
    const server = pair[1];

    server.accept();

    server.addEventListener("message", (event) => {
      server.send(event.data);
    });

    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  }
};