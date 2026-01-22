import { spawnSync } from "node:child_process";

const strict = process.argv.includes("--strict");

function hasCommand(command) {
  const checker = process.platform === "win32" ? "where" : "command";
  const checkerArgs = process.platform === "win32" ? [command] : ["-v", command];
  const result = spawnSync(checker, checkerArgs, { stdio: "ignore" });
  return result.status === 0;
}

const missing = [];
if (!hasCommand("cmake")) missing.push("cmake");

// Check for optional dependencies
const warnings = [];
if (!hasCommand("codex")) {
  warnings.push("codex (Codex CLI - required at runtime)");
}
if (!hasCommand("git")) {
  warnings.push("git (required for git features)");
}

if (missing.length === 0) {
  if (warnings.length > 0) {
    console.log("Doctor: OK (with warnings)");
    console.log(`Optional dependencies not found: ${warnings.join(", ")}`);
    if (warnings.some(w => w.includes("codex"))) {
      console.log("Note: The Codex CLI must be installed for the app to function.");
      console.log("Ensure 'codex' is available in your PATH.");
    }
  } else {
    console.log("Doctor: OK");
  }
  process.exit(0);
}

console.log(`Doctor: missing dependencies: ${missing.join(" ")}`);

switch (process.platform) {
  case "darwin":
    console.log("Install: brew install cmake");
    break;
  case "linux":
    console.log("Ubuntu/Debian: sudo apt-get install cmake");
    console.log("Fedora: sudo dnf install cmake");
    console.log("Arch: sudo pacman -S cmake");
    break;
  case "win32":
    console.log("Install: choco install cmake");
    console.log("Or download from: https://cmake.org/download/");
    console.log("");
    console.log("For Windows builds, you also need:");
    console.log("  - Visual Studio Build Tools with C++ workload");
    console.log("  - Rust toolchain (rustup.rs)");
    break;
  default:
    console.log("Install CMake from: https://cmake.org/download/");
    break;
}

process.exit(strict ? 1 : 0);

