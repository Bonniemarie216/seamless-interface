import vitePreprocessor from "cypress-vite";
import { spawn } from "child_process";

export default (on: (arg0: string, arg1: any) => void, config: any) => {
  on("file:preprocessor", vitePreprocessor(config));

  // Define a task to start the Anvil process
  on("task", {
    startAnvil: () => {
      const forkUrl = config.env.VITE_BASE_RPC_FREE_1;
      if (!forkUrl) {
        // eslint-disable-next-line no-console
        console.error("VITE_BASE_RPC_FREE_1 environment variable is not defined.");
        return false;
      }
      // eslint-disable-next-line no-console
      console.log(`Starting Anvil with fork URL: ${forkUrl}`);
      const anvilProcess = spawn(
        `anvil --fork-url ${forkUrl} --fork-block-number 18048376 --auto-impersonate --no-rate-limit`,
        { shell: true }
      );

      anvilProcess.stdout.on("data", (data) => {
        // eslint-disable-next-line no-console
        console.log(`anvil stdout: ${data}`);
      });

      anvilProcess.stderr.on("data", (data) => {
        // eslint-disable-next-line no-console
        console.error(`anvil stderr: ${data}`);
      });

      return null;
    },
    stopAnvil: () => {
      // eslint-disable-next-line no-console
      console.log("Stopping Anvil process...");
      spawn("pkill -f anvil", { shell: true });
      return null;
    },
  });

  return config;
};
