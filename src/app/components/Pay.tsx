"use client";

import { FormEventHandler, useState } from "react";

import { parseEther } from "viem";
import { mainnet } from "viem/chains";

import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { isEthereumWallet } from "@dynamic-labs/ethereum";

const customNetwork = {
    id: 22040,
    name: "AirDAO testnet",
    nativeCurrency: { name: "Ambrosus", symbol: "AMB", decimals: 18 },
    rpcUrls: { default: { http: ["https://network.ambrosus-test.io"] } },
    blockExplorers: {
        default: {
            name: "AirDAO Explorer",
            url: "https://testnet.airdao.io/explorer",
            apiUrl: "https://api.etherscan.io/api",
        },
    },
};

const Pay = () => {
    const { primaryWallet } = useDynamicContext();

    const [txnHash, setTxnHash] = useState("");

    if (!primaryWallet || !isEthereumWallet(primaryWallet)) return null;

    const onSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const address = formData.get("address") as string;
        const amount = formData.get("amount") as string;

        const publicClient = await primaryWallet.getPublicClient();
        const walletClient = await primaryWallet.getWalletClient();

        const transaction = {
            to: address as `0x${string}`,
            value: amount ? parseEther(amount) : undefined,
            chain: customNetwork as any,
        };
        console.log(JSON.stringify(mainnet));

        const hash = await walletClient.sendTransaction(transaction);
        setTxnHash(hash);
    };

    return (
        <>
            <h1>Pay</h1>
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
        </>
    );
};

export default Pay;
