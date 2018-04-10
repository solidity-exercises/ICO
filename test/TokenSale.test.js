const TokenSale = artifacts.require('../contracts/TokenSale.sol');

const assertRevert = require('./utils/assertRevert');
const constants = require('./utils/constants');
const increaseTime = require('./utils/increaseTime');

contract('TokenSale', ([owner, other]) => {
	let sut;

	before(() => {
		web3.eth.defaultAccount = owner;
	});

	beforeEach(async () => {
		sut = await TokenSale.new();
	});

	it('name Should be properly set on instantiation', async () => {
		// Arrange
		// Act
		// Assert
	});

	it('symbol Should be properly set on instantiation', async () => {
		// Arrange
		// Act
		// Assert
	});

	it('decimals Should be properly set on instantiation', async () => {
		// Arrange
		// Act
		// Assert
	});

	it('saleStart Should be properly set on instantiation', async () => {
		// Arrange
		// Act
		// Assert
	});

	it('transfer Should revert when invoked during the token sale', async () => {
		// Arrange
		// Act
		// Assert
	});

	it('transfer Should not revert when invoked after the token sale end', async () => {
		// Arrange
		// Act
		// Assert
	});

	it('transferFrom Should revert when invoked during the token sale', async () => {
		// Arrange
		// Act
		// Assert
	});

	it('transferFrom Should not revert when invoked after the token sale end', async () => {
		// Arrange
		// Act
		// Assert
	});

	it('buy Should transfer exact amount tokens when invoked during the first phase, with contrac\'s balance summed up with `msg.value` to less than or equal to 10ETH.', async () => {
		// Arrange
		// Act
		// Assert
	});

	it('buy Should transfer exact amount tokens when invoked during the first phase, with contrac\'s balance greater than or equal to 10ETH.', async () => {
		// Arrange
		// Act
		// Assert
	});

	it('buy Should transfer exact amount tokens when invoked during the first phase, with contrac\'s balance less than 10ETH and `msg.value` sufficient in order to exceed 10ETH', async () => {
		// Arrange
		// Act
		// Assert
	});

	it('buy Should transfer exact amount tokens when invoked during the second phase, with contrac\'s balance summed up with `msg.value` to less than or equal to 30ETH.', async () => {
		// Arrange
		// Act
		// Assert
	});

	it('buy Should transfer exact amount tokens when invoked during the second phase, with contrac\'s balance greater than or equal to 30ETH.', async () => {
		// Arrange
		// Act
		// Assert
	});

	it('buy Should transfer exact amount tokens when invoked during the second phase, with contrac\'s balance less than 30ETH and `msg.value` sufficient in order to exceed 30ETH', async () => {
		// Arrange
		// Act
		// Assert
	});

	it('buy Should transfer exact amount tokens when invoked during the third phase', async () => {
		// Arrange
		// Act
		// Assert
	});

	it('buy Should lower the contract\'s token balance with exact amount when passed valid arguments', async () => {
		// Arrange
		// Act
		// Assert
	});

	it('buy Should increase the `msg.sender`\'s token balance with exact amount when passed valid arguments', async () => {
		// Arrange
		// Act
		// Assert
	});

	it('buy Should raise Transfer event when passed valid arguments', async () => {
		// Arrange
		// Act
		// Assert
	});

	it('buy Should revert when invoked after the token sale end', async () => {
		// Arrange
		// Act
		// Assert
	});

	it('getTokenAmountForEther Should revert when invoked after the token sale end', async () => {
		// Arrange
		// Act
		// Assert
	});
});