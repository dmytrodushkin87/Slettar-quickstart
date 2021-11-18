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

const now = new BigNumber(Math.floor(Date.now())).dividedToIntegerBy(1000);

const main = async () => {
  const escrowAccount = await server.loadAccount(escrow.publicKey);
  const txOptions = {
    fee: await server.fetchBaseFee(),
    networkPassphrase: Networks.TESTNET,
    timebounds: {
      minTime: now.plus(30).toFixed(), // 30s in time
      maxTime: 0
    }
  };
  const paymentTx = new TransactionBuilder(escrowAccount, txOptions)
  .addOperation(Operation.pathPaymentStrictSend({
    sendAmount: '100',
    sendAsset: Asset.native(),
    destAsset: Asset.native(),
    destMin: '100',
    destination: bali.publicKey
  }))
  .addOperation(Operation.accountMerge({
    destination: ali.publicKey
  }))
  .setTimeout(0)
  .build();
  paymentTx.sign(Keypair.fromSecret(escrow.secret))
  const txXDR = paymentTx.toEnvelope().toXDR('base64')
  const paymentReceipt = {
    txXDR,
    source: escrow.publicKey,
    amount: '100'
  }
  console.log(paymentReceipt);
  await saveJson('./payment.json', paymentReceipt)
};
main()
.then(() => console.log('OK'))
.catch(e => {
  console.log(e);
  throw e;
}); 