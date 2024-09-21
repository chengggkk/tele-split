"use client";
import {
    createWalletClient,
    http,
    parseEther,
    Chain,
    formatEther,
    createPublicClient,
    encodeFunctionData,
    parseUnits,
} from "viem";
import { english, generateMnemonic, mnemonicToAccount } from "viem/accounts";
import { mainnet, sepolia, goerli } from "viem/chains";
import { defineChain } from "viem/utils";
import { FormEventHandler, useEffect, useState } from "react";
import WebApp from "@twa-dev/sdk";

const USDC_ADDRESS = {
    Ethereum: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    Sepolia: "0xd3f43c3cf86237ba743d24ceda0e56079364a431", // mock USDC on sepolia
    "AirDAO testnet": "0x92EA66615Ba256cb073D27193efb524a1F880Be9",
};

// ABI for the transfer function of ERC-20 tokens (including USDC)
const ERC20_ABI = [
    {
        constant: false,
        inputs: [
            { name: "_to", type: "address" },
            { name: "_value", type: "uint256" },
        ],
        name: "transfer",
        outputs: [{ name: "", type: "bool" }],
        type: "function",
    },
    {
        constant: true,
        inputs: [{ name: "_owner", type: "address" }],
        name: "balanceOf",
        outputs: [{ name: "balance", type: "uint256" }],
        type: "function",
    },
];

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
    // AirDAO: AirDAO,
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
    const [biometricInited, setBiometricInited] = useState(false);
    const [isFormVisible, setIsFormVisible] = useState(false);

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
        const biometricManager = WebApp.BiometricManager;
        if (!biometricManager.isInited) {
            alert("Biometric not initialized yet!");
            return;
        }

        biometricManager.authenticate(
            { reason: "The bot requests biometrics for testing purposes." },
            (success) => {
                if (success) {
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
                } else {
                    console.log("Authentication failed");
                }
            }
        );
    }

    useEffect(() => {
        getAccount();
        biometricInit();
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

    // Biometric Initialization
    const biometricInit = () => {
        const biometricManager = WebApp.BiometricManager;
        if (!biometricInited) {
            WebApp.onEvent("biometricManagerUpdated" as any, () => {
                setBiometricInited(biometricManager.isInited);
            });
        }

        biometricManager.init();
    };

    const onSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const address = formData.get("address") as string;
        const amount = formData.get("amount") as string;

        const biometricManager = WebApp.BiometricManager;
        if (!biometricManager.isInited) {
            alert("Biometric not initialized yet!");
            return;
        }

        biometricManager.authenticate(
            { reason: "The bot requests biometrics for testing purposes." },
            (success) => {
                if (success) {
                    WebApp.CloudStorage.getItem(
                        "mnemonic",
                        async (error, result) => {
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
                                WebApp.CloudStorage.setItem(
                                    "mnemonic",
                                    mnemonic
                                );
                                setAddress(account.address);
                            }
                            const client = createWalletClient({
                                chain: selectedNetwork,
                                transport: http(),
                            });

                            // Parse amount (USDC uses 6 decimals, so use `parseUnits` for 6 decimals)
                            const amountInUSDC = parseUnits(amount, 6); // amount in USDC (6 decimals)

                            // Prepare the data for the transfer function
                            const transferData = {
                                abi: ERC20_ABI, // ABI of the contract
                                functionName: "transfer", // Function to call on the USDC contract
                                args: [address, amountInUSDC], // Parameters: recipient and amount
                            };

                            const hash = await client.sendTransaction({
                                account: account as any,
                                to: USDC_ADDRESS[
                                    selectedNetwork.name as keyof typeof USDC_ADDRESS
                                ] as `0x${string}`,
                                data: encodeFunctionData(transferData),
                                chain: selectedNetwork,
                            });
                            setTxnHash(hash);
                        }
                    );
                } else {
                    console.log("Authentication failed");
                }
            }
        );
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
        const client = createPublicClient({
            chain: selectedNetwork,
            transport: http(),
        });
        // const balance = await publicClient.getBalance({
        //     address: address as `0x${string}`,
        // });
        const balance = await client.readContract({
            address: USDC_ADDRESS[
                selectedNetwork.name as keyof typeof USDC_ADDRESS
            ] as `0x${string}`, // USDC contract address
            abi: ERC20_ABI, // ERC-20 ABI
            functionName: "balanceOf", // Function to call
            args: [address], // Address to check balance for
        });
        const balanceInUSDC = Number(balance) / 10 ** 6; // Convert balance from smallest unit to USDC
        setBalance(balanceInUSDC);
    };

    const formatBalance = (balance: number) => {
        return balance.toFixed(2);
    };

    const handleRefresh = () => {
        getAccount();
    };

    const toggleForm = () => {
        setIsFormVisible(!isFormVisible);
    };

    return (
        <div className="relative">
            <button
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out flex items-center justify-between"
                onClick={openModal}
            >
                <span className="font-semibold flex items-center">
                    {selectedNetwork.name}
                </span>
                <div className="flex items-center">
                    <span className="text-sm opacity-80 mr-2 border-r border-white border-opacity-30 pr-2">
                        {formatAddress(address)}
                    </span>
                    <span className="font-medium">{formatBalance(balance)} USDC</span>
                </div>
            </button>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg max-w-sm w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Wallet</h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Network selector */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Network</label>
                                <div className="relative">
                                    <select
                                        value={Object.keys(networks).find(key => networks[key].id === selectedNetwork.id)}
                                        onChange={handleNetworkChange}
                                        className="w-full px-2 py-1 text-sm border-gray-300 rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white appearance-none"
                                    >
                                        {Object.keys(networks).map((networkName) => (
                                            <option key={networkName} value={networkName}>
                                                {networks[networkName].name}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Address */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                                <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-md">
                                    <input
                                        type="text"
                                        readOnly
                                        value={formatAddress(address)}
                                        className="flex-grow px-2 py-1 bg-transparent text-sm focus:outline-none text-gray-800 dark:text-gray-200"
                                    />
                                    <button
                                        onClick={copyToClipboard}
                                        className="px-2 py-1 text-xs bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    >
                                        Copy
                                    </button>
                                </div>
                            </div>

                            {/* Balance */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Balance</label>
                                <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 rounded-md px-2 py-1">
                                    <div className="text-sm text-gray-800 dark:text-gray-200">{formatBalance(balance)}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">USDC</div>
                                </div>
                            </div>

                            {/* Mnemonic toggle button */}
                            <button
                                onClick={toggleMnemonic}
                                className="w-full px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
                            >
                                {showMnemonicText ? "Hide" : "Show"} Mnemonic
                            </button>

                            {/* Mnemonic display */}
                            {showMnemonicText && mnemonic && (
                                <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-md text-xs">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-semibold text-gray-700 dark:text-gray-300">Your Mnemonic:</span>
                                        <button
                                            onClick={copyMnemonicToClipboard}
                                            className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        >
                                            Copy
                                        </button>
                                    </div>
                                    <code className="block mt-1 break-words bg-gray-200 dark:bg-gray-600 p-1 rounded">
                                        {mnemonic}
                                    </code>
                                </div>
                            )}

                            {/* Send form toggle button */}
                            <button
                                onClick={toggleForm}
                                className="w-full px-3 py-1 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-300"
                            >
                                {isFormVisible ? "Hide Send Form" : "Show Send Form"}
                            </button>

                            {/* Send form */}
                            {isFormVisible && (
                                <form onSubmit={async (event) => onSubmit(event)} className="mt-4 bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                                    <h3 className="text-sm font-semibold mb-2 text-gray-800 dark:text-white">Send USDC</h3>
                                    <div className="space-y-2">
                                        <input
                                            name="address"
                                            type="text"
                                            required
                                            placeholder="Recipient Address"
                                            className="w-full px-2 py-1 text-sm bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <input
                                            name="amount"
                                            type="text"
                                            required
                                            placeholder="Amount (USDC)"
                                            className="w-full px-2 py-1 text-sm bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <button
                                            type="submit"
                                            className="w-full px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
                                        >
                                            Send USDC
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* Transaction hash display */}
                            {txnHash !== "" && (
                                <div className="mt-2 p-2 bg-green-100 dark:bg-green-800 rounded-md">
                                    <span className="text-xs text-green-800 dark:text-green-200">
                                        Transaction Hash: {formatAddress(txnHash)}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
