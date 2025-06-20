require("dotenv").config();
const { JsonRpcProvider, Contract, formatUnits } = require("ethers");
const { universalFetch } = require('./fetch-helper');

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

// Fetching pools from Flexa API
// Note:
// Flexa has pagination on this endpoint. So at some point they will add enough pools 
// that it will return multiple pages and this function will need to be updated.
const fetchPools = async () => {
  let pools = [];
  try {
    const response = await universalFetch('https://api.flexa.co/collateral_pools');
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (Array.isArray(result.data) && result.data.length > 0) {
      result.data.forEach(element => {
        pools.push({
          address: element.id.split(':')[2],
          name: element.entity.name,
        });
      });
      return pools;
    }

  } catch (err) {
    console.error('Fetch error:', err);
  }
};


async function main() {
  const pools = await fetchPools();

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

  console.log(result); // final output
  return result;
}

main();
