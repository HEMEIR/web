pragma solidity >=0.7.0 <0.9.0;
contract complexAuction  
{ 
	uint256 public startTime = 970754400;
	uint256 public finishTime = 970758000;
	string public highestBidder = "" ;
	uint public highestBid = 0 ;
	string public bidder = "" ;
	uint public bid = 0 ;
	uint256 public biddingTime = 3600 ;
	uint public reservePrice = 10000 ;
	uint public Commission = 1000 ;
	uint256 public signTime = 970272000;
	uint public FineIR = 200.0 ;
	uint256 public payTime = 43200 ;
	bool public test_result = false ;
	string public faultyParty = "" ;
	uint public compensation = 0 ;
	string public ContractState="start";
	mapping(string => bool) public functionStatus;
	mapping(string => uint) public functionFinishTime;	
	struct Person {
		string name;
		address payable account;
	}
	struct aa {
		string name;
		address payable account;
	}
	struct ca {
		string name;
		address payable account;
		uint256 key;
		uint256 year;
	}
	struct ra {
		string name;
		address payable account;
	}
		struct token {
		   string   name ;
		   uint   number ;
		   string   ownership ;
	}
	
	Person public Platform = Person("B", payable(0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db));
	Person public Auctioneer = Person("A", payable(0x5B38Da6a701c568545dCfcB03FcB875f56beddC4));
	aa public aa = aa("aa", payable(0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db));
	ca public ca = ca("ca", payable(0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db), 123, 3);
	ra public ra = ra("ra", payable(0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db));
	modifier onlyPlatform(){
		require(msg.sender == Platform.account,"Only Platform can access this.");
		 _; 
	}
	modifier onlyAuctioneer(){
		require(msg.sender == Auctioneer.account,"Only Auctioneer can access this.");
		 _; 
	}
	modifier onlyaa(){
		require(msg.sender == aa.account,"Only aa can access this.");
		 _; 
	}
	modifier onlyca(){
		require(msg.sender == ca.account,"Only ca can access this.");
		 _; 
	}
	modifier onlyra(){
		require(msg.sender == ra.account,"Only ra can access this.");
		 _; 
	}
	token public thing = token("thing", 1, "A");
	constructor() {
	// Initialize the group
	}
	event completedRule(address indexed person, string rulename);
	function rule1(bool _test_result) public payable onlyState(ContractState) onlyca unDone("rule1"){
		test_result = _test_result;
		if(!isTime(giveTime)){
			functionStatus["rule1"] = true;
			functionFinishTime["rule1"]=block.timestamp;
			emit completedRule(msg.sender,"rule1");
		}
	}
	function rule2() public payable onlyState(ContractState) onlyAuctioneer unDone("rule2"){
		if(!isTime(startTime)||isTrue(test_result)){
			transferTo(Platform.account,10**14*Commission);
			thing.ownership=Platform.name;
			functionStatus["rule2"] = true;
			functionFinishTime["rule2"]=block.timestamp;
			emit completedRule(msg.sender,"rule2");
		}
	}
	function rule3() public payable onlyState(ContractState) onlyPlatform unDone("rule3"){
		if(isDone("rule1")||compareTimestamps(startTime,block.timestamp,3600,"<")){
			functionStatus["rule3"] = true;
			functionFinishTime["rule3"]=block.timestamp;
			emit completedRule(msg.sender,"rule3");
		}
	}
	function rule4(string memory _bidder, uint _bid) public payable onlyState(ContractState) {
		bidder = _bidder;
		bid = _bid;
		if(isDone("rule3")||isTime(startTime)||!isTime(finishTime)||logic(bid,highestBid,">")||logic(bid,reservePrice,">=")){
			highestBid=bid;
			highestBidder=bidder;
			functionStatus["rule4"] = true;
			functionFinishTime["rule4"]=block.timestamp;
			emit completedRule(msg.sender,"rule4");
		}
	}
	function rule5(string memory _bidder) public payable onlyState(ContractState) unDone("rule5"){
		bidder = _bidder;
		if(isTime(finishTime)||compareStrings(bidder,highestBidder)||compareTimestamps(block.timestamp,finishTime,43200,"<")){
			transferTo(Platform.account,10**14*highestBid);
			functionStatus["rule5"] = true;
			functionFinishTime["rule5"]=block.timestamp;
			emit completedRule(msg.sender,"rule5");
		}
	}
	function rule6() public payable onlyState(ContractState) onlyPlatform unDone("rule6"){
		if(isDone("rule5")){
			transferTo(Auctioneer.account,10**14*highestBid);
			thing.ownership=bidder;
			ContractState="finish";
			functionStatus["rule6"] = true;
			functionFinishTime["rule6"]=block.timestamp;
			emit completedRule(msg.sender,"rule6");
		}
	}
	function rule8(string memory _bidder) public payable onlyState(ContractState) unDone("rule8"){
		bidder = _bidder;
		if(compareStrings(bidder,highestBidder)||compareTimestamps(block.timestamp,finishTime,43200,">=")||!isDone("rule5")){
			transferTo(Platform.account,10**14*highestBid*FineIR/1000);
			functionStatus["rule8"] = true;
			functionFinishTime["rule8"]=block.timestamp;
			emit completedRule(msg.sender,"rule8");
		}
	}
	function rule9() public payable onlyState(ContractState) onlyPlatform unDone("rule9"){
		if(isDone("rule8")){
			transferTo(Auctioneer.account,10**14*highestBid*FineIR/1000);
			functionStatus["rule9"] = true;
			functionFinishTime["rule9"]=block.timestamp;
			emit completedRule(msg.sender,"rule9");
		}
	}
	function rule10() internal onlyra{
			ContractState="pause";
			functionStatus["rule10"] = true;
			functionFinishTime["rule10"]=block.timestamp;
			emit completedRule(msg.sender,"rule10");
	}
	function rule11() internal onlyra{
			ContractState="restart";
			functionStatus["rule11"] = true;
			functionFinishTime["rule11"]=block.timestamp;
			emit completedRule(msg.sender,"rule11");
	}
	function rule12() public payable onlyState(ContractState) onlyPlatform unDone("rule12"){
		if(!isDone("rule4")||!isDone("rule8")){
			functionStatus["rule12"] = true;
			functionFinishTime["rule12"]=block.timestamp;
			emit completedRule(msg.sender,"rule12");
		}
	}
	function rule13(string memory _fault_party, uint _compensation) public payable onlyState(ContractState) onlyaa unDone("rule13"){
		fault_party = _fault_party;
		compensation = _compensation;
		if(isDone("rule12")){
			functionStatus["rule13"] = true;
			functionFinishTime["rule13"]=block.timestamp;
			emit completedRule(msg.sender,"rule13");
		}
	}
	function rule14_1(address memory _bidder1) public payable onlyState(ContractState) onlyPlatform unDone("rule14_1"){
		address bidder1 = _bidder1;	
		if(compareStrings(fault_party,Platform.name)){
			functionStatus["rule14_1"] = true;
			functionFinishTime["rule14_1"]=block.timestamp;
			emit completedRule(msg.sender,"rule14_1");
		}
	}
	function rule14_2() public payable onlyState(ContractState) unDone("rule14_2"){
		if(compareStrings(fault_party,highestBidder)){
			transferTo(Platform.account,10**14*compensation);
			functionStatus["rule14_2"] = true;
			functionFinishTime["rule14_2"]=block.timestamp;
			emit completedRule(msg.sender,"rule14_2");
		}
	}
	// Check if a specific function has been executed
	function isDone(string memory functionName) internal view returns (bool) {
	    return functionStatus[functionName];
	}
	// Function to determine if the specified time has been reached
	function isTime(uint256 targetTime) internal view returns (bool) {
	    return block.timestamp >= targetTime;
	}
	event Transfer(address indexed from, address indexed to, uint amount);
	// Transfer to a specified address
	function transferTo(address payable recipient, uint amount) internal {
	    require(recipient != address(0), "Invalid recipient address");
	    require(amount > 0, "Amount must be greater than zero");
	    recipient.transfer(amount);
	    emit Transfer(msg.sender,recipient, amount);
	}
	// Helper function to perform comparison based on the comparison operator
	    function compare(uint a, uint b, string memory op) internal pure returns (bool) {
	        if (compareStrings(op, ">")) {
	            return a > b;
	        } else if (compareStrings(op, "<")) {
	            return a < b;
	        } else if (compareStrings(op, ">=")) {
	            return a >= b;
	        } else if (compareStrings(op, "<=")) {
	            return a <= b;
	        } else if (compareStrings(op, "==")) {
	            return a == b;
	        } else if (compareStrings(op, "!=")) {
	            return a != b;
	        }
	        revert("Invalid operator.");
	    }
	
	
	    // The setValue function can only be executed if the condition valueA > valueB is met
	    function logic(uint256 valueA, uint256 valueB, string memory symbol) internal pure returns (bool) {
	        return compare(valueA, valueB, symbol);
	    }
	function compareTimestamps(uint256 timestamp1, uint256 timestamp2, uint256 customSeconds, string memory operator) internal returns (bool) {
	       // Calculate the difference between two timestamps (take the absolute value to ensure the difference is positive)
	       uint256 timeDifference = timestamp1 - timestamp2;
	       if (keccak256(bytes(operator)) == keccak256(bytes(">"))) {
	           return timeDifference > customSeconds;
	       } else if (keccak256(bytes(operator)) == keccak256(bytes("<"))) {
	           return timeDifference < customSeconds;
	       } else if (keccak256(bytes(operator)) == keccak256(bytes("=="))) {
	           return timeDifference == customSeconds;
	       } else if (keccak256(bytes(operator)) == keccak256(bytes("!=="))) {
	           return timeDifference != customSeconds;
	       } else {
	           revert("Invalid operator");
	       }
	   }
    modifier unDone(string memory functionName){
        require(!(functionStatus[functionName]),"require do this function unsucessfully");
        _;
    }
	event ContractStateChange(string newState);
	// Custom modifier: Allow or prohibit execution based on string parameter value
	modifier onlyState(string memory State) {
	    require(compareStrings(State, "start") || compareStrings(State, "restart"), "Not allowed in this state");
	     emit ContractStateChange(State);
	    _;
	}
	// Helper function to compare if two strings are equal
	function compareStrings(string memory a, string memory b) internal pure returns (bool) {
	    return (keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b)));
	}
}
