# Flexa Capacity v3 Accounts Checker

Query and display AMP staking balances across Flexa Capacity v3 pools for a given user account.

You can view Flexa Capacity v3 pools at [Flexa Capacity v3](https://app.flexa.co/).

## Project Structure

```
/flexa-capacity-v3-accounts
 ├── .env            # environment variables (not committed)
 ├── .gitignore      # ignoring .env
 ├── index.js        # main script to run
 ├── package.json    # node project
 └── README.md       # project instructions
```

## Installation

1. Clone the repository

```bash
git clone https://github.com/bubby-eth/flexa-capacity-v3-accounts.git
cd flexa-capacity-v3-accounts
```

2. Install dependencies

```bash
npm install
```

3. Set up your `.env` file

Create a `.env` file at the root of the project:

```bash
touch .env
```

Add the following environment variables:

```env
ALCHEMY_API_KEY=your_alchemy_api_key_here
USER_ADDRESS=0xUserAddressHere
```

Note: `.env` is already included in `.gitignore` to avoid leaking secrets to GitHub.

4. Run the script

```bash
node index.js
```

This will output a JSON object showing:

- The user's account address
- The total AMP staked across all pools
- A list of pools where the user has AMP staked

## Example Output

```json
{
  "account": "0x123...abc",
  "totalStakedAmp": "32820.123",
  "pools": [
    {
      "name": "Ethereum",
      "address": "0x9477dA44A61ceBCDD0383CD00Bf18A859FEb75b0",
      "stakedAmp": "24500.123"
    },
    {
      "name": "Bitcoin",
      "address": "0xdB07414039F5e1618E3eCC8019C1C1ecb4b4C06A",
      "stakedAmp": "8320.000"
    }
  ]
}
```

## Technologies Used

- Node.js
- ethers.js
- dotenv
- Alchemy API

## Notes

- The pools queried are hardcoded in `index.js` with their associated names and addresses.
- Only pools with a non-zero AMP stake for the user will be included in the output.
- The output is printed as formatted JSON to the console.
- This project can be easily extended to support batch queries or saving output to files.

## Contact

If you have questions, feedback, or would like to contribute, feel free to open an issue or pull request.
