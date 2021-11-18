const Stellar = require('stellar-sdk');
const accounts = require('../../accounts');
const util = require('util');

const server = new Stellar.Server('https://horizon-testnet.stellar.org');
// const server = new Stellar.Server('http://127.0.0.1:8000');
const checkAccounts = async accounts => {
  const sAccounts = await Promise.all(
    accounts.map(async account => await server.loadAccount(account.publicKey))
  );
  return sAccounts.map(({id, balances}) => ({
      id,
      balances
    }));
};
checkAccounts(accounts)
.then(accounts => console.log(util.inspect(accounts, false, null)))
.catch(e => {
  console.log(e);
  throw e;
});
