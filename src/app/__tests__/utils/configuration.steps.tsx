import { BalanceConfig } from "../../../../cypress/support/config/balanceConfig";
import { VIRTUAL_TESTNET_KEY, VIRTUAL_TESTNET_SNAPSHOT } from "../../../../cypress/support/constants";
import { evmRevert } from "../../../../cypress/support/tenderly/utils/apiUtils";

type TestEnv = "anvil" | "tenderly";

export const prepareTestForRun = () => {
  const testEnv = (import.meta.env.VITE_TEST_ENVIRONMENT || "tenderly") as TestEnv;

  before(() => {
    if (testEnv === "anvil") {
      cy.setupAnvilTestEnvironment(BalanceConfig);
    } else if (testEnv === "tenderly") {
      cy.setupTenderlyTestEnvironment(BalanceConfig);
    }
    cy.visit("/");
  });

  after(() => {
    cy.window().then(({ localStorage }) => {
      if (testEnv === "tenderly") {
        const snapshotIdJSON = localStorage.getItem(VIRTUAL_TESTNET_SNAPSHOT);
        const forkUrlJSON = localStorage.getItem(VIRTUAL_TESTNET_KEY);

        const snapshotId = snapshotIdJSON ? JSON.parse(snapshotIdJSON).snapshotId : null;
        const forkUrl = forkUrlJSON ? JSON.parse(forkUrlJSON).forkUrl : null;

        // eslint-disable-next-line no-console
        console.log("reverting snapshot", snapshotId, forkUrl);

        if (snapshotId && forkUrl) {
          cy.wrap(evmRevert(forkUrl, snapshotId)).then((result) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            expect(result).to.be.true;
            localStorage.removeItem(VIRTUAL_TESTNET_SNAPSHOT);
            localStorage.removeItem(VIRTUAL_TESTNET_KEY);

            // eslint-disable-next-line no-console
            console.log("snapshot reverted");
          });
        }
      }
    });
  });
};
