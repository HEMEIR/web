pragma solidity >=0.7.0 <0.9.0;
contract complexPurchase  
{ 
	string public place = "place" ;
	uint256 public giveTime = 970704000;
	uint256 public signTime = 970358400;
	uint public price = 100 ;
	uint256 public late_deliveryIR = 50.0 ;
	uint256 public terminatedIR = 200.0 ;
	uint public late_days = 0 ;
	uint256 public late = 432000 ;
	uint256 public period = 1296000 ;
	string public faultyParty = "" ;
	uint public compensation = 0 ;
	bool public test_result = false ;
	string public solutionA = "" ;
	string public solutionB = "" ;
	string public solution_1 = "Negotiate" ;
	string public solution_2 = "Court" ;
	string public solution_3 = "ca" ;
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
		   ufixed   unit_price ;
		   string   ownership ;
	}
	
	Person public Buyer = Person("A", payable(0x5B38Da6a701c568545dCfcB03FcB875f56beddC4));
	Person public Seller = Person("B", payable(0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2));
	Person public Platform = Person("P", payable(0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db));
	aa public aa = aa("aa", payable(0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db));
	aa public court = aa("court", payable(0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db));
	ca public ca = ca("ca", payable(0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db), 123, 3);
	ra public ra = ra("ra", payable(0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db));
	modifier onlyBuyer(){
		require(msg.sender == Buyer.account,"Only Buyer can access this.");
		 _; 
	}
	modifier onlySeller(){
		require(msg.sender == Seller.account,"Only Seller can access this.");
		 _; 
	}
	modifier onlyPlatform(){
		require(msg.sender == Platform.account,"Only Platform can access this.");
		 _; 
	}
	modifier onlyaa(){
		require(msg.sender == aa.account,"Only aa can access this.");
		 _; 
	}
	modifier onlycourt(){
		require(msg.sender == court.account,"Only court can access this.");
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
	token public Thing = token("thing", 1, 100, "A");
	constructor() {
	// Initialize the group
	}
	event completedRule(address indexed person, string rulename);
	function end() internal{
		ContractState="finish";
	}
	function end2() internal{
		ContractState="terminate";
	}
	function terminate_pay() internal{
		transferTo(Buyer.account,10**14*price*terminatedIR/1000);
	}
	function transfer_own() internal{
		Thing.ownership="Buyer.name";
	}
	function compareResult() internal view returns (bool) {
		if (compareStrings(solutionA,solutionB)) return true;
		else return false;
	}
	function chooseSolution() internal view returns (bool) {
		if (isDone("rule19")||isDone("rule21")||isDone("rule23")) return true;
		else return false;
	}
	function rule1(bool _test_result) public payable onlyState(ContractState) onlyca unDone("rule1"){
		test_result = _test_result;
		if(!isTime(giveTime)){
			functionStatus["rule1"] = true;
			functionFinishTime["rule1"]=block.timestamp;
			emit completedRule(msg.sender,"rule1");
		}
	}
	function rule2() public payable onlyState(ContractState) onlyBuyer unDone("rule2"){
		if(!isTime(giveTime)||isTrue(test_result)){
			transferTo(Platform.account,10**14*price);
			functionStatus["rule2"] = true;
			functionFinishTime["rule2"]=block.timestamp;
			emit completedRule(msg.sender,"rule2");
		}
	}
	function rule3() public payable onlyState(ContractState) onlySeller unDone("rule3"){
		if(isDone("rule1")||compareTimestamps(block.timestamp,giveTime,86400,"<")){
			functionStatus["rule3"] = true;
			functionFinishTime["rule3"]=block.timestamp;
			emit completedRule(msg.sender,"rule3");
		}
	}
	function rule4() public payable onlyState(ContractState) onlyPlatform unDone("rule4"){
		if(isDone("rule2")||isDone("rule8")){
			functionStatus["rule4"] = true;
			functionFinishTime["rule4"]=block.timestamp;
			emit completedRule(msg.sender,"rule4");
		}
	}
	function rule5() public payable onlyState(ContractState) onlyBuyer unDone("rule5"){
		if(!isTime(functionFinishTime["rule3"]+60*60*24*15)
		){
			transfer_own();
			functionStatus["rule5"] = true;
			functionFinishTime["rule5"]=block.timestamp;
			emit completedRule(msg.sender,"rule5");
		}
	}
	function rule6() public payable onlyState(ContractState) onlyPlatform unDone("rule6"){
		if(isDone("rule5")){
			transferTo(Seller.account,10**14*price);
			end();
			functionStatus["rule6"] = true;
			functionFinishTime["rule6"]=block.timestamp;
			emit completedRule(msg.sender,"rule6");
		}
	}
	function rule7() public payable onlyState(ContractState) onlyPlatform unDone("rule7"){
		if(isDone("rule4")||isTime(functionFinishTime["rule4"]+1296000)){
			transferTo(Seller.account,10**14*price);
			transfer_own();
			end();
			functionStatus["rule7"] = true;
			functionFinishTime["rule7"]=block.timestamp;
			emit completedRule(msg.sender,"rule7");
		}
	}
	function rule8(uint _late_days) public payable onlyState(ContractState) onlySeller unDone("rule8"){
		late_days = _late_days;
		if(compareTimestamps(block.timestamp,giveTime,432000,"<=")){
			transferTo(Buyer.account,10**14*late_days*price*late_deliveryIR/1000);
			functionStatus["rule8"] = true;
			functionFinishTime["rule8"]=block.timestamp;
			emit completedRule(msg.sender,"rule8");
		}
	}
	function rule9() public payable onlyState(ContractState) onlySeller unDone("rule9"){
		if(compareTimestamps(block.timestamp,giveTime,432000,">")||!isDone("rule7")){
			terminate_pay();
			end2();
			functionStatus["rule9"] = true;
			functionFinishTime["rule9"]=block.timestamp;
			emit completedRule(msg.sender,"rule9");
		}
	}
	function rule10() public payable onlyState(ContractState) onlyPlatform unDone("rule10"){
		if(isDone("rule9")){
			transferTo(Buyer.account,10**14*price);
			functionStatus["rule10"] = true;
			functionFinishTime["rule10"]=block.timestamp;
			emit completedRule(msg.sender,"rule10");
		}
	}
	function rule11() public payable onlyState(ContractState) onlyBuyer unDone("rule11"){
			terminate_pay();
			functionStatus["rule11"] = true;
			functionFinishTime["rule11"]=block.timestamp;
			emit completedRule(msg.sender,"rule11");
	}
	function rule12() public payable onlyState(ContractState) onlySeller unDone("rule12"){
			terminate_pay();
			functionStatus["rule12"] = true;
			functionFinishTime["rule12"]=block.timestamp;
			emit completedRule(msg.sender,"rule12");
	}
	function rule13() public payable onlyState(ContractState) onlyPlatform unDone("rule13"){
		if(isDone("rule11")||isDone("rule12")){
			transferTo(Buyer.account,10**14*price);
			end2();
			functionStatus["rule13"] = true;
			functionFinishTime["rule13"]=block.timestamp;
			emit completedRule(msg.sender,"rule13");
		}
	}
	function rule14() internal onlyra{
			ContractState="pause";
			functionStatus["rule14"] = true;
			functionFinishTime["rule14"]=block.timestamp;
			emit completedRule(msg.sender,"rule14");
	}
	function rule15() internal onlyra{
			ContractState="restart";
			functionStatus["rule15"] = true;
			functionFinishTime["rule15"]=block.timestamp;
			emit completedRule(msg.sender,"rule15");
	}
	function rule16(string memory _solution1) public payable onlyState(ContractState) onlyBuyer unDone("rule16"){
		solution1 = _solution1;
			functionStatus["rule16"] = true;
			functionFinishTime["rule16"]=block.timestamp;
			emit completedRule(msg.sender,"rule16");
	}
	function rule17(string memory _solution2) public payable onlyState(ContractState) onlySeller unDone("rule17"){
		solution2 = _solution2;
			functionStatus["rule17"] = true;
			functionFinishTime["rule17"]=block.timestamp;
			emit completedRule(msg.sender,"rule17");
	}
	function rule18(string memory _fault_party, uint _compensation) public payable onlyState(ContractState) onlyBuyer unDone("rule18"){
		fault_party = _fault_party;
		compensation = _compensation;
		if(compareStrings(solutionA,solution_1)||compareResult()){
			functionStatus["rule18"] = true;
			functionFinishTime["rule18"]=block.timestamp;
			emit completedRule(msg.sender,"rule18");
		}
	}
	function rule19() public payable onlyState(ContractState) onlySeller unDone("rule19"){
		if(isDone("rule18")){
			functionStatus["rule19"] = true;
			functionFinishTime["rule19"]=block.timestamp;
			emit completedRule(msg.sender,"rule19");
		}
	}
	function rule20_1() public payable onlyState(ContractState) onlyBuyer unDone("rule20_1"){
		if(chooseSolution()||compareStrings(fault_party,Buyer.name)){
			transferTo(Seller.account,10**14*compensation);
			functionStatus["rule20_1"] = true;
			functionFinishTime["rule20_1"]=block.timestamp;
			emit completedRule(msg.sender,"rule20_1");
		}
	}
	function rule20_2() public payable onlyState(ContractState) onlySeller unDone("rule20_2"){
		if(chooseSolution()||compareStrings(fault_party,Seller.name)){
			transferTo(Buyer.account,10**14*compensation);
			functionStatus["rule20_2"] = true;
			functionFinishTime["rule20_2"]=block.timestamp;
			emit completedRule(msg.sender,"rule20_2");
		}
	}
	function rule21(string memory _fault_party, uint _compensation) public payable onlyState(ContractState) onlycourt unDone("rule21"){
		fault_party = _fault_party;
		compensation = _compensation;
		if(compareStrings(solutionA,solution_2)||compareResult()){
			functionStatus["rule21"] = true;
			functionFinishTime["rule21"]=block.timestamp;
			emit completedRule(msg.sender,"rule21");
		}
	}
	function rule23(string memory _fault_party, uint _compensation) public payable onlyState(ContractState) onlyaa unDone("rule23"){
		fault_party = _fault_party;
		compensation = _compensation;
		if(compareStrings(solutionA,solution_2)||compareResult()){
			functionStatus["rule23"] = true;
			functionFinishTime["rule23"]=block.timestamp;
			emit completedRule(msg.sender,"rule23");
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
	Function to check if the value is true.
	function isTrue(bool valueToCheck) internal pure returns (bool) {
	    return valueToCheck == true;
	}
	event Transfer(address indexed from, address indexed to, uint amount);
	// Transfer to a specified address
	function transferTo(address payable recipient, uint amount) internal {
	    require(recipient != address(0), "Invalid recipient address");
	    require(amount > 0, "Amount must be greater than zero");
	    recipient.transfer(amount);
	    emit Transfer(msg.sender,recipient, amount);
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
