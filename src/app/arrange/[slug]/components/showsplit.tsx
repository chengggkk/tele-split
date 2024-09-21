"use client";
import { useState, useEffect, Key } from "react";
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
import { defineChain } from "viem/utils";
import { mainnet, sepolia, goerli, linea, lineaSepolia } from "viem/chains";
import WebApp from "@twa-dev/sdk";

const USDC_ADDRESS = {
    Ethereum: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    Sepolia: "0xd3f43c3cf86237ba743d24ceda0e56079364a431", // mock USDC on sepolia
    "AirDAO testnet": "0x92EA66615Ba256cb073D27193efb524a1F880Be9",
    "Linea Sepolia Testnet": "0x37b31cA71Bb33B149F56b6674486E5eD4365E9AF",
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
    LineaSepolia: lineaSepolia,
    // AirDAO: AirDAO,
};

function ShowSplit({ params }: { params: { slug: string } }) {
    const { slug } = params;
    const [result, setResult] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const ID = WebApp.initDataUnsafe.user?.id || "Unknown ID";
    const [biometricInited, setBiometricInited] = useState(false);
    const [selectedNetwork, setSelectedNetwork] = useState<any>(sepolia);
    const [txnHash, setTxnHash] = useState<string | null>(null);

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

    const fetchUserAddress = async (ID: string) => {
        const res = await fetch(`/api/groupmember?userID=${ID}`);
        const data = await res.json();
        for (const user of data) {
            if (user.address !== undefined) return user.address;
        }
    };

    const savePaid = async (split_id: string) => {
        const res = await fetch(`/api/paid`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ split_id }),
        });
        const data = await res.json();
    };

    const handlePay = async (ID: string, amount: number, split_id: string) => {
        const biometricManager = WebApp.BiometricManager;
        if (!biometricManager.isInited) {
            alert("Biometric not initialized yet!");
            return;
        }
        // TODO: change to user's address
        const address = "0x171cCdbEbef3eB252231F237Cf9339408Ea4B267";

        biometricManager.authenticate(
            { reason: "The bot requests biometrics for testing purposes." },
            (success) => {
                if (success) {
                    WebApp.CloudStorage.getItem(
                        "mnemonic",
                        async (error, result) => {
                            if (error) {
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
                            }
                            const client = createWalletClient({
                                chain: selectedNetwork,
                                transport: http(),
                            });

                            // Parse amount (USDC uses 6 decimals, so use `parseUnits` for 6 decimals)
                            const amountInUSDC = parseUnits(
                                amount.toString(),
                                6
                            ); // amount in USDC (6 decimals)

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
                            await savePaid(split_id);
                        }
                    );
                } else {
                    console.log("Authentication failed");
                }
            }
        );
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response: Response = await fetch("/api/showsplit", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        ID: ID,
                        groupID: slug,
                    }),
                });

                if (!response.ok) {
                    throw new Error(`No result`);
                }

                const result = await response.json();
                setResult(result);
            } catch (error: any) {
                console.error("Error fetching split:", error);
                setError(error.message);
            }
        };

        fetchData();
        biometricInit();
    }, [ID, slug, selectedNetwork]);

    const renderTableBody = (isReceivable: boolean) => {
        return result.map((splitEntry: any) =>
            splitEntry.splitMembers
                .filter((member: { split_member: string | number }) =>
                    isReceivable
                        ? member.split_member !== String(ID) &&
                          splitEntry.payer === String(ID)
                        : member.split_member === String(ID) &&
                          splitEntry.payer !== String(ID)
                )
                .map(
                    (member: {
                        _id: Key | null | undefined;
                        name: string;
                        amount: number;
                        state: number;
                    }) => (
                        <tr key={member._id}>
                            <td className="border px-4 py-2">
                                {true ? member.name : splitEntry.name}
                            </td>
                            <td className="border px-4 py-2">
                                {member.amount}
                            </td>
                            <td className="border px-4 py-2">
                                {member.state === 0
                                    ? "unpaid"
                                    : member.state === 1
                                    ? "paid"
                                    : "payer"}
                            </td>
                            {member.state === 0 && (
                                <td className="border px-4 py-2">
                                    <button
                                        onClick={() =>
                                            handlePay(
                                                splitEntry.Payer,
                                                member.amount,
                                                splitEntry._id
                                            )
                                        }
                                    >
                                        Pay
                                    </button>
                                </td>
                            )}
                        </tr>
                    )
                )
        );
    };

    const handleNetworkChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const networkName = event.target.value;
        setSelectedNetwork(networks[networkName] as any);
        // fetchBalance(address);
    };

    return (
        <div className="p-4">
            {error && <p className="text-red-500">{error}</p>}

            {/* Receivable Table */}
            <h2 className="text-xl font-bold mb-4">Receivable Table</h2>
            <div className="overflow-x-auto">
                <div className="min-w-full bg-white border text-black shadow-md rounded-lg overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="py-2 px-4 border">
                                    Split Member
                                </th>
                                <th className="py-2 px-4 border">Amount</th>
                                <th className="py-2 px-4 border">State</th>
                                <th className="py-2 px-4 border">Action</th>
                            </tr>
                        </thead>
                        <tbody>{renderTableBody(true)}</tbody>
                    </table>
                </div>
            </div>
            {txnHash && (
                <div className="mb-6">
                    <p>
                        Transaction Hash:{" "}
                        <a
                            href={`https://sepolia.etherscan.io/tx/${txnHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline"
                        >
                            {txnHash}
                        </a>
                    </p>
                </div>
            )}

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Network
                </label>
                <div className="relative">
                    <select
                        value={Object.keys(networks).find(
                            (key) => networks[key].id === selectedNetwork.id
                        )}
                        onChange={handleNetworkChange}
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white appearance-none"
                    >
                        {Object.keys(networks).map((networkName) => (
                            <option key={networkName} value={networkName}>
                                {networks[networkName].name}
                            </option>
                        ))}
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

            {/* Payable Table */}
            <h2 className="text-xl font-bold mt-8 mb-4">Payable Table</h2>
            <div className="overflow-x-auto">
                <div className="min-w-full bg-white border text-black shadow-md rounded-lg overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="py-2 px-4 border">Payer</th>
                                <th className="py-2 px-4 border">Amount</th>
                                <th className="py-2 px-4 border">State</th>
                                <th className="py-2 px-4 border">Action</th>
                            </tr>
                        </thead>
                        <tbody>{renderTableBody(false)}</tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ShowSplit;
