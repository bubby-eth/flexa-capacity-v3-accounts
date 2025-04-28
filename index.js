require("dotenv").config();
const { JsonRpcProvider, Contract, formatUnits } = require("ethers");

// ABI for Flexa pool contracts
const POOL_ABI = [
  "function getAccountPoolBalance(address _accountAddress, address _tokenAddress) view returns (uint256)",
];

// Alchemy mainnet RPC setup
const RPC_URL = `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;
const provider = new JsonRpcProvider(RPC_URL);

// User address (who you're checking for)
const userAddress = process.env.USER_ADDRESS;

// The token we are tracking (AMP)
const ampToken = "0xfF20817765cB7f73d4bde2e66e067E58D11095C2";

// List of Flexa pools
const pools = [
  { address: "0xB8706F2dd1Ce8A4328D254cF14271e0fbB5E268A", name: "Burner" },
  {
    address: "0xD57E335457b6f5d09ac69248230005a02F9B60CF",
    name: "Nighthawk Wallet",
  },
  { address: "0xFF1D02F09A9C55cEFd37f57715FEe7E88278d34e", name: "SPEDN" },
  { address: "0xd80370093a305bbDA27B821bb6c6347989Bf709b", name: "Zashi" },
  { address: "0xc163c2cC35e32350Aa92DEC2b53b68950942d72F", name: "Avalanche" },
  { address: "0xA52125ced25602203BCeF6E78E865571306CaB2A", name: "Base" },
  { address: "0xdB07414039F5e1618E3eCC8019C1C1ecb4b4C06A", name: "Bitcoin" },
  {
    address: "0x59e772F12938063bCa8A2B978791eBe225f5Bc3c",
    name: "Bitcoin Cash",
  },
  { address: "0x57F6f249DB02083362D43E2D02dD791068Df30C6", name: "Cardano" },
  { address: "0x80E58Fe28F53CCbaD1c295ebAA6A8c13241D034b", name: "Celo" },
  { address: "0xa7f2B6aF8c536897f246B1EB62654cb9c886FA47", name: "Dogecoin" },
  { address: "0x9477dA44A61ceBCDD0383CD00Bf18A859FEb75b0", name: "Ethereum" },
  { address: "0xd0415cf4558A0dBEE8242498D25284476bE3c8f2", name: "Lightning" },
  { address: "0x84706656fabFE15b2b77F292A656dD024607d332", name: "Litecoin" },
  { address: "0x1e73f41454D9806f0462Eb6C9FD2A3754cEE7Fc4", name: "Polygon" },
  { address: "0xE932d1a226E962D820a33363DF32FcC95D2559D2", name: "Solana" },
  { address: "0xCD234A11B26F42B391C2838Beb3DA3Bb3A590B66", name: "Tezos" },
  { address: "0xcfBbAE9DCE9a207BaB01E1589e345D3Edc65D842", name: "Zcash" },
];

async function main() {
  const result = {
    account: userAddress,
    supplyTotal: "0",
    rewardTotal: "0", //will add logic for this soon
    pools: [],
  };

  let totalSupplied = 0n; // Initialize total supplied AMP
  let totalRewards = 0n; // Initialize total AMP rewards to be claimed

  for (const pool of pools) {
    const contract = new Contract(pool.address, POOL_ABI, provider);

    try {
      const supplied = await contract.getAccountPoolBalance(
        userAddress,
        ampToken
      );

      //add AMP rewards to be claimed logic

      if (supplied > 0n) {
        result.pools.push({
          name: pool.name,
          address: pool.address,
          supplied: formatUnits(supplied, 18),
        });

        totalSupplied += supplied;
      }
    } catch (err) {
      console.error(
        `Error reading pool ${pool.name} (${pool.address}):`,
        err.message
      );
    }
  }

  result.supplyTotal = formatUnits(totalSupplied, 18);

  console.log(JSON.stringify(result, null, 2)); // Print result nicely
}

main();
