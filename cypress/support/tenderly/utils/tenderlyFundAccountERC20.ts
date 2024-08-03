export const tenderlyFundAccountERC20 = async (
  forkUrl: string,
  tokenAddress: string,
  account: string,
  amount: bigint
) => {
  const API_KEY = Cypress.env("tenderly_access_key");

  let amountHex = amount.toString(16);
  amountHex = amountHex.replace(/^0+/, "");
  const formattedAmount = `0x${amountHex}`;
  // eslint-disable-next-line no-console

  const response = await fetch(forkUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Access-Key": API_KEY,
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "tenderly_setErc20Balance",
      params: [tokenAddress, account, formattedAmount],
      id: "1234",
    }),
  });

  if (!response.ok) {
    throw new Error(`Error funding account with ERC-20 token: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};
