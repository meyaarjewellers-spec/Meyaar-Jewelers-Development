/** Minimal structured-ish logger, decoupled from the Vite dev server. */
export function log(message: string, source = "express"): void {
  const time = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${time} [${source}] ${message}`);
}
