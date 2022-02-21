import {ethers} from 'ethers';
import deploy from './deploy';
import addContract from './addContract';
import metamaskConfig from './connection.js';
import "./custom.scss";

const account = document.getElementById('accountId');
const balance = document.getElementById('balance');
const connect = document.getElementById('connectToWallet');

// check if metamask is installed in browser
if (metamaskConfig.isMetamaskInstalled) {
  console.log('Metamask is installed!')
}
else {
  alert('Install Metamask extension to connect with DApp!')
}

// if metamask is connected do this
const checkOnLoad = async () => {
  if (metamaskConfig.isMetamaskConnected) {
      ethereum.autoRefreshOnNetworkChange = false;
      await metamaskConfig.connectToAccount();
      console.log('Metamask connected:', await metamaskConfig.isMetamaskConnected());
  } else {
      alert('Connect to available ethereum network!');
      console.log('Connect to available ethereum network!');
  }
}

checkOnLoad();

// event triggered when account is changed in metamask
ethereum.on('accountsChanged', async (accounts) => {
  console.log('Account changed from', account);
  account.innerHTML = await metamaskConfig.getAccount();
  balance.innerHTML = await metamaskConfig.getBalance();
})

// event triggered when metamask is connected to chain and can make rpc request
ethereum.on('connect', (chainId) => {
  console.log(chainId);
  console.log('Metamask Connected:', ethereum.isConnected());

})

// event triggered when metamask is disconnected from chain and can not make rpc request
ethereum.on('disconnect', (chainId) => {
  console.log(chainId);
  console.log('Metamask Connected:', ethereum.isConnected());
  alert('Metamask is not connected to ethereum network. Retry!');
})

// add click event listener on the connect button
connect.addEventListener('click', async (e) => {
  e.preventDefault()

  let getAccountAddress = await metamaskConfig.getAccount();
  if (getAccountAddress.length < 1) {
      getAccountAddress = await metamaskConfig.connectToAccount();
      account.innerHTML = getAccountAddress;
      balance.innerHTML = await metamaskConfig.getBalance();
  } else {
      account.innerHTML = getAccountAddress;
      balance.innerHTML = await metamaskConfig.getBalance();
  }
  console.log(getAccountAddress);
})

let contracts = 0;
async function newContract() {
  const beneficiary = document.getElementById("beneficiary").value;
  const arbiter = document.getElementById("arbiter").value;
  const value = ethers.BigNumber.from(document.getElementById("wei").value);
  const contract = await deploy(arbiter, beneficiary, value);
  addContract(++contracts, contract, arbiter, beneficiary, value);
}

document.getElementById("deploy").addEventListener("click", newContract);
