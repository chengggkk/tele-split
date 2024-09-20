import {
    DynamicContextProvider,
    DynamicWidget,
} from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";

// Setting up list of evmNetworks
const evmNetworks = [
    // AirDAO testnet
    {
        blockExplorerUrls: ["https://testnet.airdao.io/explorer/"],
        chainId: 22040,
        chainName: "AirDAO Testnet",
        iconUrls: ["airdao-logo.svg"],
        name: "AirDAO",
        nativeCurrency: {
            decimals: 18,
            name: "Ambrosus",
            symbol: "AMB",
        },
        networkId: 22040,
        rpcUrls: ["https://network.ambrosus-test.io"],
        vanityName: "AirDAO Testnet",
    },
    // AirDAO mainnet
    {
        blockExplorerUrls: ["https://airdao.io/explorer/"],
        chainId: 16718,
        chainName: "AirDAO Mainnet",
        iconUrls: ["airdao-logo.svg"],
        name: "AirDAO",
        nativeCurrency: {
            decimals: 18,
            name: "Ambrosus",
            symbol: "AMB",
        },
        networkId: 16718,
        rpcUrls: ["https://network.ambrosus.io/"],
        vanityName: "AirDAO Mainnet",
    },
    {
        blockExplorerUrls: ["https://etherscan.io/"],
        chainId: 1,
        chainName: "Ethereum Mainnet",
        iconUrls: ["https://app.dynamic.xyz/assets/networks/eth.svg"],
        name: "Ethereum",
        nativeCurrency: {
            decimals: 18,
            name: "Ether",
            symbol: "ETH",
        },
        networkId: 1,

        rpcUrls: ["https://mainnet.infura.io/v3/"],
        vanityName: "ETH Mainnet",
    },
    {
        blockExplorerUrls: ["https://etherscan.io/"],
        chainId: 5,
        chainName: "Ethereum Goerli",
        iconUrls: ["https://app.dynamic.xyz/assets/networks/eth.svg"],
        name: "Ethereum",
        nativeCurrency: {
            decimals: 18,
            name: "Ether",
            symbol: "ETH",
        },
        networkId: 5,
        rpcUrls: [
            "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
        ],

        vanityName: "Goerli",
    },
    {
        blockExplorerUrls: ["https://polygonscan.com/"],
        chainId: 137,
        chainName: "Matic Mainnet",
        iconUrls: ["https://app.dynamic.xyz/assets/networks/polygon.svg"],
        name: "Polygon",
        nativeCurrency: {
            decimals: 18,
            name: "MATIC",
            symbol: "MATIC",
        },
        networkId: 137,
        rpcUrls: ["https://polygon-rpc.com"],
        vanityName: "Polygon",
    },
];

const Wallet = () => (
    <DynamicContextProvider
        settings={{
            environmentId: "0ea3b234-ddc7-4c11-b483-bd0de0fa8fd1",
            overrides: { evmNetworks },
            walletConnectors: [EthereumWalletConnectors],
        }}
    >
        <DynamicWidget />
    </DynamicContextProvider>
);

export default Wallet;
