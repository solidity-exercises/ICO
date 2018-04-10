pragma solidity ^0.4.18;

import '../../contracts/TokenSale.sol';


contract TokenSaleFake is TokenSale {
	function () public payable {}
}