const {
  Networks,
  Server,
  TransactionBuilder,
  Operation,
  Keypair,
  Asset
} = require("stellar-sdk");
const { BigNumber } = require("bignumber.js");
const { ali, bali } = require("../accounts");
const { saveJson } = require("../saveJson");
const escrow = require('./escrowKeyPair');

const server = new Server("https://horizon-testnet.stellar.org");
const main = async () => {
  const aliAccount = await server.loadAccount(ali.publicKey);
  const txOptions = {
    fee: await server.fetchBaseFee(),
    networkPassphrase: Networks.TESTNET
  };
  const paymentToEscrow = {
    amount: '100',
    asset: Asset.native(),
    destination: escrow.publicKey
  };
  const transaction = new TransactionBuilder(aliAccount, txOptions)
  .addOperation(Operation.payment(paymentToEscrow))
  .setTimeout(0)
  .build();
  transaction.sign(Keypair.fromSecret(ali.secret));
  await server.submitTransaction(transaction);
};
main()
.then(() => console.log('OK'))
.catch(e => {
  console.log(e);
  throw e;
}); 
