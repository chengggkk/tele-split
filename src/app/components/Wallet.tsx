import {
    DynamicContextProvider,
    DynamicWidget,
} from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import Pay from "./Pay";

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
        rpcUrls: ["https://eth.llamarpc.com	"],
        vanityName: "ETH Mainnet",
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
        {/* <Pay /> */}
    </DynamicContextProvider>
);

export default Wallet;
