const Stellar = require('stellar-sdk');
const accounts = require('../../accounts');
const { TimeoutInfinite } = require('stellar-base');
const server = new Stellar.Server('https://horizon-testnet.stellar.org');
// const server = new Stellar.Server('http://127.0.0.1:8000');
const runTransaction = async (lomPubKey, bobSecret, bobPubKey) => {
  const txOption = {
  fee: Stellar.BASE_FEE,
  networkPassphrase: Stellar.Networks.TESTNET
  };
  const paymentToLom = {
    destination: lomPubKey,
    asset: Stellar.Asset.native(),
    amount: '500'
  };
  const bobAccount = await server.loadAccount(bobPubKey);
  console.log('lom publicKey ', lomPubKey);
  console.log('bob publicKey ', bobPubKey);
  const transaction = new Stellar.TransactionBuilder(bobAccount, txOption)
    .addOperation(Stellar.Operation.payment(paymentToLom))
    .setTimeout(TimeoutInfinite)
    .build();
    transaction.sign(Stellar.Keypair.fromSecret(bobSecret));
  await server.submitTransaction(transaction);
};

const [lom, bob] = accounts;

runTransaction(lom.publicKey, bob.secret, bob.publicKey)
.then(() => console.log('OK'))
.catch(e => {
  console.log(e);
  throw e;
});
