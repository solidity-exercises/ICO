pragma solidity ^0.4.18;

import '../node_modules/zeppelin-solidity/contracts/token/ERC20/MintableToken.sol';


contract TokenSale is MintableToken {
	string public name = 'LimeChain Exam Token';
	string public symbol = 'LET';
	uint8 public constant decimals = 18;
	
	/**
	* @dev Designed to be gentle to the state.
	*/
	uint256 public saleStart;

	modifier afterSaleEnd() {
		require(now > saleStart + 30 days); // practically can not overflow
		_;
	}

	modifier beforeSaleEnd() {
		require(now <= saleStart + 30 days);
		_;
	}

	/**
	* @notice `https://github.com/ConsenSys/smart-contract-best-practices/issues/61`
	*/
	function TokenSale() public {
		require(address(this).balance == 0);

		saleStart = now;
	}

	function transfer(address _to, uint256 _value) public afterSaleEnd returns (bool) {
		return super.transfer(_to, _value);
	}

	function transferFrom(address _from, address _to, uint256 _value) public afterSaleEnd returns (bool) {
		return super.transferFrom(_from, _to, _value);
	}

	function buy() public payable beforeSaleEnd returns (bool) {
		uint256 amount = getTokenAmountForEther(msg.value);
		
		assert(_saleTransfer(msg.sender, amount));

		return true;
	}

	function getTokenAmountForEther(uint256 _etherAmount) public view beforeSaleEnd returns (uint256) {
		if (saleStart + 7 days > now) {
			if (address(this).balance.add(_etherAmount) <= 10 ether) {
				return _calculateTokenAmount(_etherAmount, 500e18); // First phase, less than or equal to 10ETH.
			}

			if (address(this).balance >= 10 ether) {
				return _calculateTokenAmount(_etherAmount, 300e18); // First phase, greater than or equal to  10ETH.
			}

			/**
			* @dev Split the pricing for the payment which rounds up
			* the balance from less to greater than 10 ETH.
			* @notice The split calculations can not underflow.
			*/
			uint256 underSplit = 10 ether - address(this).balance;
			uint256 overSplit = _etherAmount - underSplit;

			return _calculateTokenAmount(underSplit, 500e18).add(_calculateTokenAmount(overSplit, 300e18));
		} else if (saleStart + 7 days <= now && saleStart + 15 days > now) {
			if (address(this).balance.add(_etherAmount) <= 30 ether) {
				return _calculateTokenAmount(_etherAmount, 200e18); // Second phase, less than or equal to 30ETH.
			}

			if (address(this).balance >= 30 ether) {
				return _calculateTokenAmount(_etherAmount, 150e18); // Second phase, greater than or equal to 30ETH.
			}

			/**
			* @dev Split the pricing for the payment which rounds up
			* the balance from less to greater than 30 ETH.
			* @notice The split calculations can not underflow.
			*/
			uint256 secondPhaseUnderSplit = 30 ether - address(this).balance;
			uint256 secondPhaseOverSplit = _etherAmount - secondPhaseUnderSplit;

			return _calculateTokenAmount(secondPhaseUnderSplit, 200e18).add(_calculateTokenAmount(secondPhaseOverSplit, 150e18));
		} else {
			return _calculateTokenAmount(_etherAmount, 100e18); // Third phase
		}
	}

	function _saleTransfer(address _to, uint256 _value) private returns (bool) {
		require(balances[address(this)] >= _value);

		balances[address(this)] -= _value; // can not underflow

		balances[_to] = balances[_to].add(_value);

		Transfer(address(this), _to, _value);
		
		return true;
	}

	function _calculateTokenAmount(uint256 _etherAmount, uint256 _tokenPrice) private pure returns (uint256) {
		return _etherAmount.mul(1 ether).div(_tokenPrice);
	}
}