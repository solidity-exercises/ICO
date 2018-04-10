const TokenSale = artifacts.require('./fakes/TokenSaleFake.sol');

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
		const result = await sut.name.call();
		// Assert
		assert.equal(result, 'LimeChain Exam Token');
	});

	it('symbol Should be properly set on instantiation', async () => {
		// Arrange
		// Act
		const result = await sut.symbol.call();
		// Assert
		assert.equal(result, 'LET');
	});

	it('decimals Should be properly set on instantiation', async () => {
		// Arrange
		// Act
		const result = await sut.decimals.call();
		// Assert
		assert.equal(result, 18);
	});

	it('saleStart Should be properly set on instantiation', async () => {
		// Arrange
		const tx = await web3.eth.getTransaction(sut.transactionHash);
		const block = await web3.eth.getBlock(tx.blockNumber);
		const now = block.timestamp;
		// Act
		const result = await sut.saleStart.call();
		// Assert
		assert.equal(result, now);
	});

	it('transfer Should revert when invoked during the token sale', async () => {
		// Arrange
		const transferValue = 100;
		await sut.mint(owner, transferValue);
		// Act
		const result = sut.transfer(other, transferValue);
		// Assert
		await assertRevert(result);
	});

	it('transfer Should not revert when invoked after the token sale end', async () => {
		// Arrange
		const transferValue = 100;
		await sut.mint(owner, transferValue);
		await increaseTime(constants.days(31));
		// Act
		await sut.transfer(other, transferValue);

		const result = await sut.balanceOf.call(other);
		// Assert
		assert.equal(result, transferValue);
	});

	it('transferFrom Should revert when invoked during the token sale', async () => {
		// Arrange
		const transferValue = 100;
		await sut.mint(owner, transferValue);
		await sut.approve(other, transferValue);
		// Act
		const result = sut.transferFrom(owner, other, transferValue, { from: other });
		// Assert
		await assertRevert(result);
	});

	it('transferFrom Should not revert when invoked after the token sale end', async () => {
		// Arrange
		const transferValue = 100;
		await sut.mint(owner, transferValue);
		await sut.approve(other, transferValue);
		await increaseTime(constants.days(31));
		// Act
		await sut.transferFrom(owner, other, transferValue, { from: other });
		const result = await sut.balanceOf.call(other);
		// Assert
		assert.equal(result, transferValue);
	});

	it('buy Should transfer exact amount tokens when invoked during the first phase, with contrac\'s balance summed up with `msg.value` to less than or equal to 10ETH.', async () => {
		// Arrange
		await sut.mint(sut.address, 500e18);
		// Act
		await sut.buy({ value: 1e18 });

		const result = await sut.balanceOf.call(owner);
		// Assert
		assert.equal(result, 500e18);
	});

	it('buy Should transfer exact amount tokens when invoked during the first phase, with contrac\'s balance greater than or equal to 10ETH.', async () => {
		// Arrange
		await web3.eth.sendTransaction({ to: sut.address, value: 1e19 });
		await sut.mint(sut.address, 300e18);
		// Act
		await sut.buy({ value: 1e18 });

		const result = await sut.balanceOf.call(owner);
		// Assert
		assert.equal(result, 300e18);
	});

	it('buy Should transfer exact amount tokens when invoked during the first phase, with contrac\'s balance less than 10ETH and `msg.value` sufficient in order to exceed 10ETH', async () => {
		// Arrange
		await web3.eth.sendTransaction({ to: sut.address, value: 9e18 });
		await sut.mint(sut.address, 800e18);
		// Act
		await sut.buy({ value: 2e18 });

		const result = await sut.balanceOf.call(owner);
		// Assert
		assert.equal(result, 800e18);
	});

	it('buy Should transfer exact amount tokens when invoked during the second phase, with contrac\'s balance summed up with `msg.value` to less than or equal to 30ETH.', async () => {
		// Arrange
		await sut.mint(sut.address, 200e18);
		await increaseTime(constants.days(7));
		// Act
		await sut.buy({ value: 1e18 });

		const result = await sut.balanceOf.call(owner);
		// Assert
		assert.equal(result, 200e18);
	});

	it('buy Should transfer exact amount tokens when invoked during the second phase, with contrac\'s balance greater than or equal to 30ETH.', async () => {
		// Arrange
		await web3.eth.sendTransaction({ to: sut.address, value: 30e18 });
		await sut.mint(sut.address, 150e18);
		await increaseTime(constants.days(7));
		// Act
		await sut.buy({ value: 1e18 });

		const result = await sut.balanceOf.call(owner);
		// Assert
		assert.equal(result, 150e18);
	});

	it('buy Should transfer exact amount tokens when invoked during the second phase, with contrac\'s balance less than 30ETH and `msg.value` sufficient in order to exceed 30ETH', async () => {
		// Arrange
		await web3.eth.sendTransaction({ to: sut.address, value: 29e18 });
		await sut.mint(sut.address, 350e18);
		await increaseTime(constants.days(7));
		// Act
		await sut.buy({ value: 2e18 });

		const result = await sut.balanceOf.call(owner);
		// Assert
		assert.equal(result, 350e18);
	});

	it('buy Should transfer exact amount tokens when invoked during the third phase', async () => {
		// Arrange
		await sut.mint(sut.address, 100e18);
		await increaseTime(constants.days(15));
		// Act
		await sut.buy({ value: 1e18 });

		const result = await sut.balanceOf.call(owner);
		// Assert
		assert.equal(result, 100e18);
	});

	it('buy Should lower the contract\'s token balance with exact amount when passed valid arguments', async () => {
		// Arrange
		await sut.mint(sut.address, 542e18);
		// Act
		await sut.buy({ value: 1e18 });

		const result = await sut.balanceOf.call(sut.address);
		// Assert
		assert.equal(result, 42e18);
	});

	it('buy Should increase the `msg.sender`\'s token balance with exact amount when passed valid arguments', async () => {
		// Arrange
		const currentBalance = await sut.balanceOf.call(owner);
		await sut.mint(sut.address, 500e18);
		// Act
		await sut.buy({ value: 1e18 });

		const newBalance = await sut.balanceOf.call(owner);
		// Assert
		assert.equal(currentBalance, 0);
		assert.equal(newBalance, 500e18);
	});

	it('buy Should raise Transfer event when passed valid arguments', async () => {
		// Arrange
		await sut.mint(sut.address, 500e18);
		// Act
		const { logs } = await sut.buy({ value: 1e18 });
		// Assert
		assert.equal(logs.length, 1);
		assert.equal(logs[0].event, 'Transfer');
		assert.equal(logs[0].args.from, sut.address);
		assert.equal(logs[0].args.to, owner);
		assert(logs[0].args.value.eq(500e18));
	});

	it('buy Should revert when invoked after the token sale end', async () => {
		// Arrange
		await sut.mint(sut.address, 500e18);
		await increaseTime(constants.days(31));
		// Act
		const result = sut.buy({ value: 1e18 });
		// Assert
		await assertRevert(result);
	});

	it('getTokenAmountForEther Should revert when invoked after the token sale end', async () => {
		// Arrange
		await increaseTime(constants.days(31));
		// Act
		const result = sut.getTokenAmountForEther.call(1e18);
		// Assert
		await assertRevert(result);
	});
});