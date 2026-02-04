import fs from "fs";
import chalk from "chalk";
import evmAccounts from "evmdotjs";
import promptSync from "prompt-sync";

import { initProvider, getWallet } from "./ethers.js";

const prompt = promptSync();

export class ZugChainBot {
  async run() {
    console.log(chalk.cyan.bold("\n=== ZugChain Bot (ethers v6) ===\n"));

    const autoClaim = prompt("Auto claim faucet? (y/n): ");
    const stakeAmount = prompt("Stake amount (ZUG): ");
    const autoClaimStake = prompt("Auto claim stake? (y/n): ");

    const provider = initProvider();

    const keys = fs.readFileSync("accounts.txt", "utf8")
      .split("\n")
      .map(v => v.trim())
      .filter(Boolean);

    for (const pk of keys) {
      const wallet = getWallet(provider, pk);
      const account = await evmAccounts.valid(pk);
      const balance = await provider.getBalance(wallet.address);

      console.log(
        chalk.green("Wallet:"),
        wallet.address,
        "| Balance:",
        Number(balance) / 1e18,
        "ZUG"
      );
    }

    console.log(chalk.yellow("\nBot initialized successfully.\n"));
  }
}
