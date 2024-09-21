"use client";
import {
    createWalletClient,
    http,
    parseEther,
    Chain,
    formatEther,
    createPublicClient,
} from "viem";
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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [copySuccess, setCopySuccess] = useState("");
    const [showMnemonicText, setShowMnemonicText] = useState(false);
    const [mnemonicCopySuccess, setMnemonicCopySuccess] = useState("");
    const [selectedNetwork, setSelectedNetwork] = useState<any>(mainnet);
    const [isLoading, setIsLoading] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);

    async function getAccount() {
        setIsLoading(true);
        WebApp.CloudStorage.getItem("mnemonic", (error, result) => {
            if (error) {
                setMessage(JSON.stringify(error));
                setIsLoading(false);
                return null;
            }
            if (result) {
                const account = mnemonicToAccount(result);
                setAddress(account.address);
                fetchBalance(account.address);
                setIsLoading(false);
                return account;
            } else {
                const mnemonic = generateMnemonic(english);
                const account = mnemonicToAccount(mnemonic);
                WebApp.CloudStorage.setItem("mnemonic", mnemonic);
                setAddress(account.address);
                fetchBalance(account.address);
                setIsLoading(false);
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
    }, [selectedNetwork]);

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
        fetchBalance(address);
    };

    const fetchBalance = async (address: string) => {
        const publicClient = createPublicClient({
            chain: selectedNetwork,
            transport: http(),
        });
        const balance = await publicClient.getBalance({
            address: address as `0x${string}`,
        });
        setBalance(Number(formatEther(balance)));
    };

    const handleRefresh = () => {
        getAccount();
    };

    return (
        <div className="relative">
            <button
                className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-300 ease-in-out flex items-center justify-between"
                onClick={openModal}
            >
                <span className="font-semibold flex items-center">
                    {selectedNetwork.name}
                </span>
                <span className="text-sm opacity-80 ml-2 border-l border-white border-opacity-30 pl-2">
                    {formatAddress(address)}
                </span>
            </button>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                                Wallet Details
                            </h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Network
                            </label>
                            <div className="relative">
                                <select
                                    value={Object.keys(networks).find(
                                        (key) =>
                                            networks[key].id ===
                                            selectedNetwork.id
                                    )}
                                    onChange={handleNetworkChange}
                                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white appearance-none"
                                >
                                    {Object.keys(networks).map(
                                        (networkName) => (
                                            <option
                                                key={networkName}
                                                value={networkName}
                                            >
                                                {networks[networkName].name}
                                            </option>
                                        )
                                    )}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                                    <svg
                                        className="fill-current h-4 w-4"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Address
                            </label>
                            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-md">
                                <input
                                    type="text"
                                    readOnly
                                    value={address}
                                    className="flex-grow px-3 py-2 bg-transparent focus:outline-none"
                                />
                                <button
                                    onClick={copyToClipboard}
                                    className="px-3 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                >
                                    Copy
                                </button>
                            </div>
                            {copySuccess && (
                                <span className="text-green-500 text-sm mt-1 block">
                                    {copySuccess}
                                </span>
                            )}
                        </div>

                        <div className="mb-6">
                            <button
                                onClick={toggleMnemonic}
                                className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                {showMnemonicText ? "Hide" : "Show"} Mnemonic
                            </button>

                            {showMnemonicText && mnemonic && (
                                <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-semibold text-gray-700 dark:text-gray-300">
                                            Your Mnemonic:
                                        </span>
                                        <button
                                            onClick={copyMnemonicToClipboard}
                                            className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        >
                                            Copy
                                        </button>
                                    </div>
                                    <code className="block mt-2 break-words text-sm bg-gray-200 dark:bg-gray-600 p-2 rounded">
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

                        <button
                            onClick={closeModal}
                            className="w-full px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
