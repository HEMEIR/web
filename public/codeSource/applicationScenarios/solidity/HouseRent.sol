pragma solidity >=0.7.0 <0.9.0;
contract HouseRent  
{ 
	uint public penalty = 3000 ;
	uint public management_fee = 4000 ;
	uint256 public payduration = 31536000 ;
	uint256 public startTime = 1602806400;
	uint256 public finishTime = 1697328000;
	uint256 public payTime = 1602806400;
	uint public time1 = 7776000 ;
	uint public time2 = 1296000 ;
	bool public isContinue = false ;
	uint public amount = 0 ;
	string public ContractState="start";
	mapping(string => bool) public functionStatus;
	mapping(string => uint) public functionFinishTime;	
	struct Person {
		string name;
		address payable account;
	}
		struct House {
		   string   location ; 
		   string   usage ; 
	}
	
	Person public Landlord = Person("Fengshan Town Vegetable Village Joint Stock Economic Cooperative", payable(0x5B38Da6a701c568545dCfcB03FcB875f56beddC4));
	Person public Tenant = Person("Luotian County Statistics Bureau", payable(0x5B38Da6a701c568545dCfcB03FcB875f56beddC4));
	modifier onlyLandlord(){
		require(msg.sender == Landlord.account,"Only Landlord can access this.");
		 _; 
	}
	modifier onlyTenant(){
		require(msg.sender == Tenant.account,"Only Tenant can access this.");
		 _; 
	}
	House public house = House("Lijiawan", "office");
	constructor() {
	}
	event completedRule(address indexed person, string rulename);
	function rule1() public payable onlyState(ContractState) onlyTenant unDone("rule1"){
		if(!isTime(startTime)){
			transferTo(Landlord.account,10**14*(management_fee));
			changeRule("rule1");
		}
	}
	function rule2() public payable onlyState(ContractState) onlyTenant {
		if(isDone("rule1")&&!isTime(payTime+payduration)){
			transferTo(Landlord.account,10**14*(management_fee));
			payTime=block.timestamp;
			changeRule("rule2");
		}
	}
	function rule3(bool _isContinue) public payable onlyState(ContractState) onlyTenant unDone("rule3"){
		_isContinue = isContinue;   // 保持原有赋值
		if(!isTime(finishTime)){
			if(isContinue){
				transferTo(Landlord.account,10**14*(management_fee));
				finishTime=finishTime+payduration;
			}
			changeRule("rule3");
		}
	}
	function rule4(uint _amount) public payable onlyState(ContractState) onlyLandlord unDone("rule4"){
		_amount = amount;   // 保持原有赋值
		if(isTime(finishTime)&&!isTime(finishTime+time2)){
			changeRule("rule4");
		}
	}
	function rule5() public payable onlyState(ContractState) onlyTenant unDone("rule5"){
		if(isDone("rule4")){
			transferTo(Landlord.account,10**14*(amount));
			ContractState="finish";
			changeRule("rule5");
		}
	}
	function rule6() public payable onlyState(ContractState) onlyLandlord unDone("rule6"){
		if(isDone("rule1")&&isTime(payTime+payduration+time1)){
			ContractState="terminate";
			changeRule("rule6");
		}
	}
	function rule7() public payable onlyState(ContractState) onlyLandlord unDone("rule7"){
		if(!isTime(finishTime)){
			transferTo(Tenant.account,10**14*(penalty));
			ContractState="terminate";
			changeRule("rule7");
		}
	}
	function rule8() public payable onlyState(ContractState) onlyTenant unDone("rule8"){
		if(!isTime(finishTime)){
			transferTo(Landlord.account,10**14*(penalty));
			ContractState="terminate";
			changeRule("rule8");
		}
	}
	// 检查某个功能是否已经执行
	function isDone(string memory functionName) internal view returns (bool) {
	    return functionStatus[functionName];
	}
	// 用于判断是否达到指定时间的函数
	function isTime(uint256 targetTime) internal view returns (bool) {
	    return block.timestamp >= targetTime;
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
