const Stellar = require("stellar-sdk");
const accounts = require("../../accounts");
const { TimeoutInfinite } = require('stellar-base');
const [lom, bob] = accounts;

const server = new Stellar.Server("https://horizon-testnet.stellar.org");

const lomPaymentToBob = async (lomPubKey, lomSecret, bobPubKey, bobSecret) => {
  const txOptions = {
    fee: await server.fetchBaseFee(),
    networkPassphrase: Stellar.Networks.TESTNET
  };
  const paymentToBob = {
    amount: "100",
    asset: Stellar.Asset.native(),
    destination: bobPubKey
  };
  const lomAccount = await server.loadAccount(lomPubKey);
  console.log('lom publicKey ', lomPubKey);
  console.log('bob publicKey ', bobPubKey);
  const transaction = new Stellar.TransactionBuilder(lomAccount, txOptions)
    .addOperation(Stellar.Operation.payment(paymentToBob))
    .setTimeout(TimeoutInfinite)
    .build();
  transaction.sign(Stellar.Keypair.fromSecret(lomSecret));
  transaction.sign(Stellar.Keypair.fromSecret(bobSecret));
  await server.submitTransaction(transaction);
};
lomPaymentToBob(lom.publicKey, lom.secret, bob.publicKey, bob.secret)
.then(() => console.log('OK'))
.catch(e => {
  console.log(e.response.data.extras.result_codes);
  throw e;
});