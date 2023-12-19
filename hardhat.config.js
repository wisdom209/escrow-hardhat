require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config()

module.exports = {
	solidity: "0.8.17",
	paths: {
		artifacts: "./app/src/artifacts",
	},
	defaultNetwork: "hardhat",
	networks: {
		hardhat: {
			chainId: 31337,
		},
		sepolia: {
			url: process.env.SEPOLIA_URL,
			accounts: [process.env.PRIVATE_KEY]
		}
	}
}
