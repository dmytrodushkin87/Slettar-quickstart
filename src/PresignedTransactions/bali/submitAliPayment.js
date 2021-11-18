const {
  Networks,
  Server,
  TransactionBuilder,
  Operation,
  Keypair,
  Transaction,
  Asset,
  xdr
} = require("stellar-sdk");
const { BigNumber } = require("bignumber.js");
const { ali, bali } = require("../accounts");
const { saveJson } = require("../saveJson");
// const escrow = require('./escrowKeyPair');
const { txXDR } = require('../../../payment')

const server = new Server("https://horizon-testnet.stellar.org");
const main = async () => {
  const envelope = xdr.TransactionEnvelope.fromXDR(txXDR, 'base64');
  const txOptions = {
    fee: await server.fetchBaseFee(),
    networkPassphrase: Networks.TESTNET
  };
  const transaction = new Transaction(txXDR, txOptions);
  try {
    await server.submitTransaction(transaction);
  } catch (e) {
    console.log(e);
    console.log(e.response.data.extra.result_codes);
  }
};
main()
.then(() => console.log('OK'))
.catch(e => {
  console.log(e);
  throw e;
}); 