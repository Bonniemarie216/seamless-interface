import { defineConfig } from "cypress";
import viteConfig from "./vite.config";
import vitePreprocessor from "cypress-vite";
import dotenv from "dotenv";
import { spawn } from "child_process";

dotenv.config({ path: "./.env.development" });

export default defineConfig({
  env: {
    url: "http://localhost:5173",
    private_key: "0xe30165a9c8c2a7f249f1cf04ba5f2ed8afacb762cc813a66b86c898cc806d58a",
    mainnet_rpc: process.env.VITE_BASE_RPC_FREE_1,
    tenderly_test_rpc: process.env.VITE_CYPRESS_TEST_TENDERLY_RPC_URL,
    tenderly_access_key: process.env.VITE_CYPRESS_TEST_TENDERLY_ACCESS_KEY,
    tenderly_account: process.env.VITE_CYPRESS_TEST_TENDERLY_PROFILE,
    tenderly_project: process.env.VITE_CYPRESS_TEST_TENDERLY_PROJECT,
    test_env: process.env.VITE_CYPRESS_TEST_ENV,
  },
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
      viteConfig,
    },
  },

  e2e: {
    // todo: read this dynamically?
    baseUrl: "http://localhost:5173",
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on("file:preprocessor", vitePreprocessor(config));

      on("task", {
        startAnvil: () => {
          const forkUrl = config.env.VITE_BASE_RPC_FREE_1;
          if (!forkUrl) {
            console.error("VITE_BASE_RPC_FREE_1 environment variable is not defined.");
            return false;
          }
          console.log(`Starting Anvil with fork URL: ${forkUrl}`);
          const anvilProcess = spawn(
            `anvil --fork-url ${forkUrl} --fork-block-number 18048376 --auto-impersonate --no-rate-limit`,
            { shell: true }
          );

          anvilProcess.stdout.on("data", (data) => {
            console.log(`anvil stdout: ${data}`);
          });

          anvilProcess.stderr.on("data", (data) => {
            console.error(`anvil stderr: ${data}`);
          });

          return null;
        },
        stopAnvil: () => {
          console.log("Stopping Anvil process...");
          spawn("pkill -f anvil", { shell: true });
          return null;
        },
      });

      return config;
    },

    specPattern: "src/app/__tests__/**/*.cy.ts",
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
  },
});
