"use client";
import { createWalletClient, http, parseEther, Chain } from "viem";
import { english, generateMnemonic, mnemonicToAccount } from "viem/accounts";
import { mainnet, sepolia, goerli } from "viem/chains";
import { defineChain } from "viem/utils";
import { FormEventHandler, useEffect, useState } from "react";
import WebApp from "@twa-dev/sdk";

const AirDAOTestnet = defineChain({
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
    contracts: {
        ensRegistry: {
            address:
                "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e" as `0x${string}`,
        },
        ensUniversalResolver: {
            address:
                "0xce01f8eee7E479C928F8919abD53E553a36CeF67" as `0x${string}`,
            blockCreated: 19_258_213,
        },
        multicall3: {
            address:
                "0xca11bde05977b3631167028862be2a173976ca11" as `0x${string}`,
            blockCreated: 14_353_601,
        },
    },
});

const AirDAO = defineChain({
    id: 16718,
    name: "AirDAO mainnet",
    nativeCurrency: { name: "Ambrosus", symbol: "AMB", decimals: 18 },
    rpcUrls: { default: { http: ["https://network.ambrosus.io/"] } },
    blockExplorers: {
        default: {
            name: "AirDAO Explorer",
            url: "https://airdao.io/explorer",
            apiUrl: "https://api.etherscan.io/api",
        },
    },
    contracts: {
        ensRegistry: {
            address:
                "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e" as `0x${string}`,
        },
        ensUniversalResolver: {
            address:
                "0xce01f8eee7E479C928F8919abD53E553a36CeF67" as `0x${string}`,
            blockCreated: 19_258_213,
        },
        multicall3: {
            address:
                "0xca11bde05977b3631167028862be2a173976ca11" as `0x${string}`,
            blockCreated: 14_353_601,
        },
    },
});

const networks: { [key: string]: Chain } = {
    Mainnet: mainnet,
    Sepolia: sepolia,
    AirDAOTestnet: AirDAOTestnet,
    AirDAO: AirDAO,
};

export default function TelegramWallet() {
    const [txnHash, setTxnHash] = useState("");
    const [address, setAddress] = useState("");
    const [message, setMessage] = useState("");
    const [balance, setBalance] = useState(0);
    const [mnemonic, setMnemonic] = useState("");
    const [copySuccess, setCopySuccess] = useState("");
    const [showMnemonicText, setShowMnemonicText] = useState(false);
    const [mnemonicCopySuccess, setMnemonicCopySuccess] = useState("");
    const [selectedNetwork, setSelectedNetwork] = useState<any>(mainnet);

    function getAccount() {
        WebApp.CloudStorage.getItem("mnemonic", (error, result) => {
            if (error) {
                setMessage(JSON.stringify(error));

                return null;
            }
            if (result) {
                const account = mnemonicToAccount(result);
                setAddress(account.address);
                return account;
            } else {
                const mnemonic = generateMnemonic(english);
                const account = mnemonicToAccount(mnemonic);
                WebApp.CloudStorage.setItem("mnemonic", mnemonic);
                setAddress(account.address);
                return account;
            }
        });
    }

    function showMnemonic() {
        WebApp.CloudStorage.getItem("mnemonic", (error, result) => {
            if (error) {
                setMnemonic(JSON.stringify(error));
            }
            if (result) {
                setMnemonic(result);
            } else {
                const mnemonic = generateMnemonic(english);
                const account = mnemonicToAccount(mnemonic);
                WebApp.CloudStorage.setItem("mnemonic", mnemonic);
                setMessage(account.address);
            }
        });
    }

    useEffect(() => {
        getAccount();
    }, []);

    function formatAddress(addr: string) {
        if (addr.length > 10) {
            return `${addr.slice(0, 5)}...${addr.slice(-5)}`;
        }
        return addr;
    }

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(address);
            setCopySuccess("Copied!");
            setTimeout(() => setCopySuccess(""), 2000); // Clear the message after 2 seconds
        } catch (err) {
            setCopySuccess("Failed to copy");
        }
    };

    const onSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const address = formData.get("address") as string;
        const amount = formData.get("amount") as string;

        WebApp.CloudStorage.getItem("mnemonic", async (error, result) => {
            if (error) {
                setMessage(JSON.stringify(error));

                return null;
            }
            let account = undefined;
            if (result) {
                account = mnemonicToAccount(result);
            } else {
                const mnemonic = generateMnemonic(english);
                account = mnemonicToAccount(mnemonic);
                WebApp.CloudStorage.setItem("mnemonic", mnemonic);
                setAddress(account.address);
            }
            const client = createWalletClient({
                chain: selectedNetwork,
                transport: http(),
            });

            const hash = await client.sendTransaction({
                account: account as any,
                to: address as `0x${string}`,
                value: amount ? parseEther(amount) : undefined,
                chain: selectedNetwork,
            });
            setTxnHash(hash);
        });
    };

    function toggleMnemonic() {
        setShowMnemonicText(!showMnemonicText);
        if (!showMnemonicText) {
            showMnemonic();
        } else {
            setMnemonic("");
        }
    }

    const copyMnemonicToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(mnemonic);
            setMnemonicCopySuccess("Copied!");
            setTimeout(() => setMnemonicCopySuccess(""), 2000);
        } catch (err) {
            setMnemonicCopySuccess("Failed to copy");
        }
    };

    const handleNetworkChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const networkName = event.target.value;
        setSelectedNetwork(networks[networkName] as any);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <span>Address: {formatAddress(address)}</span>
                    <button
                        onClick={copyToClipboard}
                        className="px-2 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    >
                        Copy
                    </button>
                    {copySuccess && (
                        <span className="text-green-500 text-sm">
                            {copySuccess}
                        </span>
                    )}
                </div>
                <select
                    value={Object.keys(networks).find(
                        (key) => networks[key].id === selectedNetwork.id
                    )}
                    onChange={handleNetworkChange}
                    className="px-2 py-1 bg-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                    {Object.keys(networks).map((networkName) => (
                        <option key={networkName} value={networkName}>
                            {networks[networkName].name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mt-4">
                <button
                    onClick={toggleMnemonic}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    {showMnemonicText ? "Hide" : "Show"} Mnemonic
                </button>

                {showMnemonicText && mnemonic && (
                    <div className="mt-2 p-4 bg-gray-100 rounded">
                        <div className="flex items-center justify-between">
                            <span className="font-semibold">
                                Your Mnemonic:
                            </span>
                            <button
                                onClick={copyMnemonicToClipboard}
                                className="px-2 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                            >
                                Copy
                            </button>
                        </div>
                        <code className="block mt-2 break-words">
                            {mnemonic}
                        </code>
                        {mnemonicCopySuccess && (
                            <span className="text-green-500 text-sm mt-1 block">
                                {mnemonicCopySuccess}
                            </span>
                        )}
                    </div>
                )}
            </div>
            {/* <form onSubmit={async (event) => await onSubmit(event)}>
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
                    {txnHash !== "" && `Tx Hash: ${formatAddress(txnHash)}`}
                </span>
            </form> */}
        </div>
    );
}
