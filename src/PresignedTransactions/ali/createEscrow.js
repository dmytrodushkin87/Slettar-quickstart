const {
  Networks,
  Server,
  TransactionBuilder,
  Operation,
  Keypair
} = require("stellar-sdk");
const { BigNumber } = require("bignumber.js");
const { ali } = require("../accounts");
const { saveJson } = require("../saveJson");

const server = new Server("https://horizon-testnet.stellar.org");

const BASE_RESERVE = 0.5;
const NUMBER_OF_ENTRIES = 1;

(async () => {
  // Create escrow account keypair
  const escrowKeyPair = Keypair.random();
  const escrow = {
    publicKey: escrowKeyPair.publicKey(),
    secret: escrowKeyPair.secret()
  };
  console.log(escrow);
  await saveJson("./src/PresignedTransactions/ali/escrowKeyPair.json", escrow);
  const aliAccount = await server.loadAccount(ali.publicKey);
  const txOptions = {
    fee: await server.fetchBaseFee(),
    networkPassphrase: Networks.TESTNET
  };
  const createEscrowTx = new TransactionBuilder(aliAccount, txOptions)
    .addOperation(
      Operation.createAccount({
        destination: escrow.publicKey,
        startingBalance: new BigNumber(
          (2 + NUMBER_OF_ENTRIES) * BASE_RESERVE
        ).toFixed()
      })
    )
    .setTimeout(0)
    .build();
  createEscrowTx.sign(Keypair.fromSecret(ali.secret));
  await server.submitTransaction(createEscrowTx);
})();
