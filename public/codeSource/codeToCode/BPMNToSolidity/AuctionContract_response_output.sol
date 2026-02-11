Based on the provided Auction Contract Description, here is the corresponding smart contract in Solidity:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AuctionContract {
    address payable public highestBidder;
    address payable public seller;
    uint256 public auctionStartTime;
    uint256 public biddingTime;
    uint256 public lowprice;
    uint256 public highestprice;
    uint256 public auctionEndTime;
    bool public ended;
    bool public itemBid;

    event AuctionDeployed();
    event HighestBidIncreased(address bidder, uint256 amount);
    event RefundAmountBid(address previousBidder, uint256 amount);
    event AuctionEnded(address winner, uint256 amount);

    modifier onlySeller() {
        require(msg.sender == seller, "Only seller can call this function.");
        _;
    }

    modifier onlyBidder() {
        require(msg.sender != seller, "Seller cannot bid.");
        _;
    }

    constructor(
        address payable _seller,
        uint256 _auctionStartTime,
        uint256 _biddingTime,
        uint256 _lowprice
    ) {
        seller = _seller;
        auctionStartTime = _auctionStartTime;
        biddingTime = _biddingTime;
        lowprice = _lowprice;
        highestprice = _lowprice;
        auctionEndTime = _auctionStartTime + _biddingTime;
        ended = false;
        itemBid = false;
        emit AuctionDeployed();
    }

    function auctionEnd() external onlySeller {
        require(block.timestamp >= auctionEndTime, "Auction cannot end before time.");
        require(!ended, "Auction already ended.");
        if (itemBid) {
            ended = true;
            emit AuctionEnded(highestBidder, highestprice);
        }
    }

    function bid() external payable onlyBidder {
        require(block.timestamp <= auctionEndTime, "Auction already ended.");
        require(msg.value > highestprice, "There already is a higher or equal bid.");
        require(!ended, "Auction already ended.");

        address payable previousBidder = highestBidder;
        uint256 previousHighestPrice = highestprice;

        highestBidder = payable(msg.sender);
        highestprice = msg.value;
        itemBid = true;

        if (previousBidder != address(0)) {
            previousBidder.transfer(previousHighestPrice);
            emit RefundAmountBid(previousBidder, previousHighestPrice);
        }

        emit HighestBidIncreased(msg.sender, msg.value);
    }
}
```

### Explanation:
1. **Initialization**: The contract is initialized with the seller's address, auction start time, bidding duration, and the lowest price. The highest price is initially set to the lowest price, and the auction end time is calculated.

2. **Modifiers**: Two modifiers are used to restrict function access:
   - `onlySeller`: Ensures that only the seller can end the auction.
   - `onlyBidder`: Ensures that only a non-seller can place bids.

3. **Events**: Four events are declared to signal significant actions and state changes within the contract.

4. **Functions**:
   - `auctionEnd()`: Can be called by the seller to end the auction after the designated time. It checks if there was a bid and emits the `AuctionEnded` event.
   - `bid()`: Allows a bidder to place a bid higher than the current highest bid. It refunds the previous highest bidder and updates the highest bid details. It emits either `HighestBidIncreased` or `RefundAmountBid` based on the situation.

This contract handles basic auction functionalities, including bidding, refunds, and auction closure, while ensuring that operations are performed within the correct conditions.