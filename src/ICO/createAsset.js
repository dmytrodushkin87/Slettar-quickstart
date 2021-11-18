const {
  accounts: { issuer, distributor },
  serverUrl
} = require("../../config.json");
const { Server, Networks, Asset, TransactionBuilder, Operation, Keypair } = require("stellar-sdk");

const server = new Server(serverUrl);

const main = async () => {
  const issuerAccount = await server.loadAccount(issuer.publicKey);
  const breadAsset = new Asset('BRD', issuer.publicKey);
  const txOptions = {
    fee: await server.fetchBaseFee(),
    networkPassphrase: Networks.TESTNET
  };
  const paymentOpts =  {
    asset: breadAsset,
    destination: distributor.publicKey,
    amount: '1000'
  };
  const transaction = new TransactionBuilder(issuerAccount, txOptions)
  .addOperation(Operation.payment(paymentOpts))
  .setTimeout(0)
  .build();
  transaction.sign(Keypair.fromSecret(issuer.secret));
  await server.submitTransaction(transaction);
};
main()
.then(() => console.log('OK'))
.catch(e => {
  console.log(e);
  throw e;
});
