// Extracting flags from process.argv

export default function extractFlags() {
  const flags: Record<string, string | boolean> = {};
  for (let i = 0; i < process.argv.length; i++) {
    const arg = process.argv[i];
    if (arg.startsWith("--")) {
      const flag = arg.slice(2);
      if (
        i + 1 < process.argv.length &&
        !process.argv[i + 1].startsWith("--")
      ) {
        flags[flag] = process.argv[i + 1];
        i++; // Skip the flag argument value
      } else {
        flags[flag] = true;
      }
    }
  }
  return flags;
}
