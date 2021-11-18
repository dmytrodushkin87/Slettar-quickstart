const Stellar = require("stellar-sdk");
const accounts = require("../../accounts");
const [lom, bob] = accounts;
const server = new Stellar.Server("https://horizon-testnet.stellar.org");

const setMultisignOnLomAccount = async () => {
  const extraSigner = {
    signer: {
      ed25519PublicKey: bob.publicKey,
      weight: 1
    }
  };
  const thresholds = {
    masterWeight: 2, // master (lom) represents the account's private key weight
    lowThreshold: 2, // lom (not bob) can sign
    medThreshold: 3, // lom and bob both need to sign for payments or changes of trustlines
    highThreshold: 3 // same for  acoount merges and other options
  };
  const txOptions = {
    fee: await server.fetchBaseFee(),
    networkPassphrase: Stellar.Networks.TESTNET
  };
  const lomAccount = await server.loadAccount(lom.publicKey);
  const multuSigTx = new Stellar.TransactionBuilder(lomAccount, txOptions)
    .addOperation(Stellar.Operation.setOptions(thresholds))
    .addOperation(Stellar.Operation.setOptions(extraSigner))
    .setTimeout(0)
    .build();
  multuSigTx.sign(Stellar.Keypair.fromSecret(lom.secret));
  await server.submitTransaction(multuSigTx);
};
setMultisignOnLomAccount()
  .then(() => {
    console.log("OK");
    console.log("lom.publicKey ", lom.publicKey);
  })

  .catch(e => {
    console.log(e);
    throw e;
  });
