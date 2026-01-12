pragma solidity >=0.7.0 <0.9.0;
contract CarRent  
{ 
	uint256 public default11 = 20.0 ;
	uint256 public default12 = 50.0 ;
	uint256 public default2 = 50.0 ;
	uint public dayNum = 0 ;
	string public faultName = "" ;
	bool public checkResult = false ;
	uint public penatly = 0 ;
	uint256 public signTime = 1667952000;
	string public signPlaca = "XiAn" ;
	uint256 public startTime = 1688947200;
	uint256 public finishTime = 1690761600;
	uint public price = 34800 ;
	string public ContractState="start";
	mapping(string => bool) public functionStatus;
	mapping(string => uint) public functionFinishTime;	
	struct Person {
		string name;
		address payable account;
	}
	struct Aa {
		string name;
		address payable account;
	}
		struct token {
		   string   name ;
		   uint   number ;
		   uint   unit_price ;
	}
	
	Person public Buyer = Person("ShanXi Provincial Department of Housing and Urban-Rural Development Agency Supplier", payable(0x5B38Da6a701c568545dCfcB03FcB875f56beddC4));
	Person public Seller = Person("XiAn YingBin Auto Car Service", payable(0x5B38Da6a701c568545dCfcB03FcB875f56beddC4));
	Aa public Arbitration = Aa("arbitration institution", payable(0x5B38Da6a701c568545dCfcB03FcB875f56beddC4));
	modifier onlyBuyer(){
		require(msg.sender == Buyer.account,"Only Buyer can access this.");
		 _; 
	}
	modifier onlySeller(){
		require(msg.sender == Seller.account,"Only Seller can access this.");
		 _; 
	}
	modifier onlyArbitration(){
		require(msg.sender == Arbitration.account,"Only Arbitration can access this.");
		 _; 
	}
	token public Service = token("vehicle rental service", 3, 11600);
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
	function time1() internal view returns (bool) {
		if (!isTime(functionFinishTime["checkThing"]+60*60*24*10)
		) return true;
		else return false;
	}
	function time2() internal view returns (bool) {
		if (!isTime(functionFinishTime["checkThing"]+60*60*24*7)
		) return true;
		else return false;
	}
	function trueCheck() internal view returns (bool) {
		if (isDone("checkThing")&&isTrue(checkResult)) return true;
		else return false;
	}
	function totalCheck() internal view returns (bool) {
		if (trueCheck()&&time1()||time1()) return true;
		else return false;
	}
	function logic1() internal view returns (bool) {
		if (logic(price*dayNum*default11/1000,price*default12/1000,">")) return true;
		else return false;
	}
	function delivery() public payable onlyState(ContractState) onlySeller unDone("delivery"){
		if(isTime(startTime)||!isTime(finishTime)){
			functionStatus["delivery"] = true;
			functionFinishTime["delivery"]=block.timestamp;
			emit completedRule(msg.sender,"delivery");
		}
	}
	function checkThing(bool _checkResult) public payable onlyState(ContractState) onlyBuyer unDone("checkThing"){
		checkResult = _checkResult;
		if(isDone("delivery")){
			functionStatus["checkThing"] = true;
			functionFinishTime["checkThing"]=block.timestamp;
			emit completedRule(msg.sender,"checkThing");
		}
	}
	function check_good() public payable onlyState(ContractState) onlyBuyer unDone("check_good"){
		if(totalCheck()||isDone("postpone_Buyer")){
			transferTo(Seller.account,10**14*price);
			end();
			functionStatus["check_good"] = true;
			functionFinishTime["check_good"]=block.timestamp;
			emit completedRule(msg.sender,"check_good");
		}
	}
	function check_false() public payable onlyState(ContractState) onlyBuyer unDone("check_false"){
		if(isDone("checkThing")||!isTrue(checkResult)||time2()){
			functionStatus["check_false"] = true;
			functionFinishTime["check_false"]=block.timestamp;
			emit completedRule(msg.sender,"check_false");
		}
	}
	function return_things() public payable onlyState(ContractState) onlyBuyer unDone("return_things"){
		if(isDone("check_false")||!isTime(functionFinishTime["check_false"]+60*60*24*3)
		){
			functionStatus["delivery"]=false;
			functionStatus["check_good"]=false;
			functionStatus["return_things"] = true;
			functionFinishTime["return_things"]=block.timestamp;
			emit completedRule(msg.sender,"return_things");
		}
	}
	function postpone_Seller(uint _dayNum) public payable onlyState(ContractState) onlyBuyer unDone("postpone_Seller"){
		dayNum = _dayNum;
		if(isTime(finishTime)||!isDone("delivery")){
			functionStatus["delivery"]=true;
			if(logic1()){
				price=price-price*dayNum*default12/1000;
			}
			if(!logic1()){
				price=price-price*dayNum*default11/1000;
			}
			functionStatus["postpone_Seller"] = true;
			functionFinishTime["postpone_Seller"]=block.timestamp;
			emit completedRule(msg.sender,"postpone_Seller");
		}
	}
	function postpone_Buyer(uint _dayNum) public payable onlyState(ContractState) onlySeller unDone("postpone_Buyer"){
		dayNum = _dayNum;
		if(trueCheck()||!time1()||!isDone("check_good")){
			if(logic1()){
				price=price+price*dayNum*default12/1000;
			}
			if(!logic1()){
				price=price+price*dayNum*default11/1000;
			}
			functionStatus["postpone_Buyer"] = true;
			functionFinishTime["postpone_Buyer"]=block.timestamp;
			emit completedRule(msg.sender,"postpone_Buyer");
		}
	}
	function terminate_Seller() public payable onlyState(ContractState) onlySeller unDone("terminate_Seller"){
			transferTo(Buyer.account,10**14*price*default2/1000);
			end2();
			functionStatus["terminate_Seller"] = true;
			functionFinishTime["terminate_Seller"]=block.timestamp;
			emit completedRule(msg.sender,"terminate_Seller");
	}
	function terminate_Buyer() public payable onlyState(ContractState) onlyBuyer unDone("terminate_Buyer"){
			transferTo(Seller.account,10**14*price*default2/1000);
			end2();
			functionStatus["terminate_Buyer"] = true;
			functionFinishTime["terminate_Buyer"]=block.timestamp;
			emit completedRule(msg.sender,"terminate_Buyer");
	}
	function arbitrationClause(string memory _faultName, uint _penatly) internal onlyArbitration unDone("arbitrationClause"){
		faultName = _faultName;
		penatly = _penatly;
			functionStatus["arbitrationClause"] = true;
			functionFinishTime["arbitrationClause"]=block.timestamp;
			emit completedRule(msg.sender,"arbitrationClause");
	}
	function buyer_fault() internal onlyBuyer unDone("buyer_fault"){
		if(isDone("arbitrationClause")||compareStrings(faultName,Buyer.name)){
			transferTo(Seller.account,10**14*penatly);
			end();
			functionStatus["buyer_fault"] = true;
			functionFinishTime["buyer_fault"]=block.timestamp;
			emit completedRule(msg.sender,"buyer_fault");
		}
	}
	function seller_fault() internal onlySeller unDone("seller_fault"){
		if(isDone("arbitrationClause")||compareStrings(faultName,Seller.name)){
			transferTo(Buyer.account,10**14*penatly);
			end();
			functionStatus["seller_fault"] = true;
			functionFinishTime["seller_fault"]=block.timestamp;
			emit completedRule(msg.sender,"seller_fault");
		}
	}
	// Check whether a specific function has already been executed
	function isDone(string memory functionName) internal view returns (bool) {
	    return functionStatus[functionName];
	}
	// Check if the current time reaches the target time
	function isTime(uint256 targetTime) internal view returns (bool) {
	    return block.timestamp >= targetTime;
	}
	// Parameterized function to check whether a value is true
	function isTrue(bool valueToCheck) internal pure returns (bool) {
	    return valueToCheck == true;
	}
	event Transfer(address indexed from, address indexed to, uint amount);
	// Used to transfer funds to a specified address
	function transferTo(address payable recipient, uint amount) internal {
	    require(recipient != address(0), "Invalid recipient address");
	    require(amount > 0, "Amount must be greater than zero");
	    recipient.transfer(amount);
	    emit Transfer(msg.sender,recipient, amount);
	}
	// Helper function to perform comparisons based on a comparison operator
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
	
	
	    // Only allow execution of the setValue function if the condition valueA > valueB is met
	    function logic(uint256 valueA, uint256 valueB, string memory symbol) internal pure returns (bool) {
	        return compare(valueA, valueB, symbol);
	    }
		
    modifier unDone(string memory functionName){
        require(!(functionStatus[functionName]),"require do this function unsucessfully");
        _;
    }
	event ContractStateChange(string newState);
	// Custom modifier: allow or restrict execution based on the value of a string parameter
	modifier onlyState(string memory State) {
	    require(compareStrings(State, "start") || compareStrings(State, "restart"), "Not allowed in this state");
	     emit ContractStateChange(State);
	    _;
	}
	// Helper function to compare whether two strings are equal
	function compareStrings(string memory a, string memory b) internal pure returns (bool) {
	    return (keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b)));
	}
}
