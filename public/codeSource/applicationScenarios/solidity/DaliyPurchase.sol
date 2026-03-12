pragma solidity >=0.7.0 <0.9.0;
contract DaliyPurchase  
{ 
	string public place = "" ;
	uint256 public giveTime = 0;
	string public ContractState="start";
	mapping(string => bool) public functionStatus;
	mapping(string => uint) public functionFinishTime;	
	struct Person {
		string name;
		address payable account;
	}
		struct token {
		   string   name ; 
		   string   ID ; 
		   uint   number ; 
		   uint256  unit_price ;
		   uint   price ; 
	}
	
	Person public Buyer = Person("Wuhan Caidian District Justice Bureau", payable(0x5B38Da6a701c568545dCfcB03FcB875f56beddC4));
	Person public Seller = Person("Shengxing Hardware Store, Caidian District, Wuhan City", payable(0x5B38Da6a701c568545dCfcB03FcB875f56beddC4));
	modifier onlyBuyer(){
		require(msg.sender == Buyer.account,"Only Buyer can access this.");
		 _; 
	}
	modifier onlySeller(){
		require(msg.sender == Seller.account,"Only Seller can access this.");
		 _; 
	}
	token public Service = token("Daliy", "many", 1, 4801, 4801);
	constructor() {
	}
	event completedRule(address indexed person, string rulename);
	function rule1(string memory _place, uint _giveTime) public payable onlyState(ContractState) onlyBuyer unDone("rule1"){
		_place = place;   // 保持原有赋值
		_giveTime = giveTime;   // 保持原有赋值
			changeRule("rule1");
	}
	function rule2() public payable onlyState(ContractState) onlySeller unDone("rule2"){
		if(logic(block.timestamp,giveTime,"==")){
			changeRule("rule2");
		}
	}
	function rule3() public payable onlyState(ContractState) onlyBuyer unDone("rule3"){
		if(isDone("rule2")){
			transferTo(Seller.account,10**14*(Service.price));
			ContractState="finish";
			changeRule("rule3");
		}
	}
	// 检查某个功能是否已经执行
	function isDone(string memory functionName) internal view returns (bool) {
	    return functionStatus[functionName];
	}
	event Transfer(address indexed from, address indexed to, uint256 amount);
	// 用于给指定地址转账
	function transferTo(address payable recipient, uint256 _amount) internal {
	    require(recipient != address(0), "Invalid recipient address");
	    require(_amount > 0, "Amount must be greater than zero");
	    recipient.transfer(_amount);
	    emit Transfer(msg.sender,recipient, _amount);
	}
	// 辅助函数，根据比较符号执行比较
	    function compare(uint256 a, uint256 b, string memory op) internal pure returns (bool) {
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
	
	
	    // 只有当满足条件 valueA > valueB 时，才能执行 setValue 函数
	    function logic(uint256 valueA, uint256 valueB, string memory symbol) internal pure returns (bool) {
	        return compare(valueA, valueB, symbol);
	    }
	    
	    function logic(string memory valueA, string memory valueB, string memory symbol) internal pure returns (bool) {
			    	    	return compareStrings(valueA, valueB);
			    	    }
    modifier unDone(string memory functionName){
        require(!(functionStatus[functionName]),"require do this function unsucessfully");
        _;
    }
	event ContractStateChange(string newState);
	// 自定义 modifier：根据字符串参数值允许或禁止执行
	modifier onlyState(string memory State) {
	    require(compareStrings(State, "start") || compareStrings(State, "restart"), "Not allowed in this state");
	     emit ContractStateChange(State);
	    _;
	}
	// 辅助函数，比较两个字符串是否相等
	function compareStrings(string memory a, string memory b) internal pure returns (bool) {
	    return (keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b)));
	}
	
	//每个条款固定调用函数，条款执行后更改条款状态，记录事件和时间
	function changeRule(string memory ruleName) internal {
		functionStatus[ruleName] = true;
		functionFinishTime[ruleName]=block.timestamp;
		emit completedRule(msg.sender,ruleName);
}
}
