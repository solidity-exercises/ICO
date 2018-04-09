pragma solidity ^0.4.18;


interface ITokenSale {
	function buy() public payable returns (bool);

	function getTokenAmountForEther(uint256 _etherAmount) public view returns (uint256);
}