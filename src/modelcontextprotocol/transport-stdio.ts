import { MCPServer } from "../mcp/server";

/**
 * Stub for STDIO transport. Reads MCP messages from stdin and writes responses to stdout.
 */
export function stdioTransport(server: MCPServer): void {
  let buffer = '';

  process.stdin.setEncoding('utf8');
  process.stdin.on('data', (chunk) => {
    buffer += chunk;
    let newlineIndex;
    while ((newlineIndex = buffer.indexOf('\n')) >= 0) {
      const line = buffer.slice(0, newlineIndex).trim();
      buffer = buffer.slice(newlineIndex + 1);
      if (!line) continue;
      let message;
      try {
        message = JSON.parse(line);
      } catch (err) {
        process.stderr.write(`Invalid JSON: ${err}\n`);
        continue;
      }
      Promise.resolve(server.handleMessage(message))
        .then((response) => {
          if (response !== undefined) {
            process.stdout.write(JSON.stringify(response) + '\n');
          }
        })
        .catch((err) => {
          process.stderr.write(`Server error: ${err}\n`);
        });
    }
  });

  process.stdin.on('end', () => {
    process.stdout.end();
  });
}

