const TokenSale = artifacts.require('../contracts/TokenSale.sol');

module.exports = (deployer) => {
	deployer.deploy(TokenSale);
};
