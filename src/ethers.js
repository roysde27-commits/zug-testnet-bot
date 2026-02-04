import { JsonRpcProvider, Wallet, parseUnits } from "ethers";
import { RPC_URL, CHAIN_ID } from "./config.js";

export function initProvider() {
  return new JsonRpcProvider(RPC_URL, CHAIN_ID);
}

export function getWallet(provider, privateKey) {
  if (!privateKey.startsWith("0x")) privateKey = "0x" + privateKey;
  return new Wallet(privateKey, provider);
}

export async function sendTx({ wallet, to, data = "0x", value = "0" }) {
  const fee = await wallet.provider.getFeeData();

  const tx = {
    to,
    data,
    value: parseUnits(value, "ether"),
    type: 2,
    maxFeePerGas: fee.maxFeePerGas,
    maxPriorityFeePerGas: fee.maxPriorityFeePerGas,
    gasLimit: 400000
  };

  try {
    const est = await wallet.estimateGas(tx);
    tx.gasLimit = (est * 12n) / 10n;
  } catch {}

  const sent = await wallet.sendTransaction(tx);
  const receipt = await sent.wait();
  return receipt.hash;
}
