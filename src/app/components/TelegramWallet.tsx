"use client";
import { createWalletClient, http, parseEther } from "viem";
import { english, generateMnemonic, mnemonicToAccount } from "viem/accounts";
import { mainnet } from "viem/chains";
import { FormEventHandler, useState } from "react";
import WebApp from "@twa-dev/sdk";

export default function TelegramWallet() {
    const [txnHash, setTxnHash] = useState("");
    const [message, setMessage] = useState("");

    async function getAccount() {
        WebApp.CloudStorage.getItem("mnemonic", (error, result) => {
            if (error) {
                setMessage(JSON.stringify(error));
                return null;
            }
            if (result) {
                const account = mnemonicToAccount(result);
                setMessage(account.address);
                return account;
            } else {
                const mnemonic = generateMnemonic(english);
                const account = mnemonicToAccount(mnemonic);
                WebApp.CloudStorage.setItem("mnemonic", mnemonic);
                setMessage(account.address);
                return account;
            }
        });
    }

    const onSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const address = formData.get("address") as string;
        const amount = formData.get("amount") as string;

        const account = await getAccount();

        const client = createWalletClient({
            chain: mainnet,
            transport: http(),
        });

        const hash = await client.sendTransaction({
            account: account as any,
            to: address as `0x${string}`,
            value: amount ? parseEther(amount) : undefined,
        });
        setTxnHash(hash);
    };
    return (
        <div>
            <div>Address: {message}</div>
            <form onSubmit={async (event) => await onSubmit(event)}>
                <p>Send to ETH address</p>
                <input
                    name="address"
                    type="text"
                    required
                    placeholder="Address"
                />
                <input name="amount" type="text" required placeholder="0.05" />
                <button type="submit">Send</button>
                <span data-testid="transaction-section-result-hash">
                    {txnHash}
                </span>
            </form>
        </div>
    );
}
