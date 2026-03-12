pragma solidity >=0.7.0 <0.9.0;
contract LightRent  
{ 
	uint256 public extend1 = 10000 ;
	uint256 public extend2 = 20000 ;
	uint256 public extend3 = 30000 ;
	uint256 public default1 = 7710 ;
	uint256 public Proportion = 400.0 ;
	uint256 public dayNum = 0 ;
	uint256 public signTime = 1639526400;
	uint256 public period = 172800 ;
	string public signPlace = "HuangGang City, HuBei Province, HeFei" ;
	uint256 public startTime = 1639958400;
	uint256 public finishTime = 1640131200;
	bool public checkStatus = false ;
	uint256 public deviceAmount = 0 ;
	uint256 public defaultAmount = 10000 ;
	string public ContractState="start";
	mapping(string => bool) public functionStatus;
	mapping(string => uint) public functionFinishTime;	
	struct Person {
		string name;
		address payable account;
	}
		struct token {
		   string   name ; 
		   uint256  price ;
	}
	
	Person public Buyer = Person("LuoTian County HuangMei Drama Group", payable(0x5B38Da6a701c568545dCfcB03FcB875f56beddC4));
	Person public Seller = Person("GuangYing Electronic Products Sales Department, BaoHe District, HeTei City", payable(0x5B38Da6a701c568545dCfcB03FcB875f56beddC4));
	modifier onlyBuyer(){
		require(msg.sender == Buyer.account,"Only Buyer can access this.");
		 _; 
	}
	modifier onlySeller(){
		require(msg.sender == Seller.account,"Only Seller can access this.");
		 _; 
	}
	token public Service = token("Performance services", 64807);
	constructor() {
	}
	event completedRule(address indexed person, string rulename);
	function rule1() public payable onlyState(ContractState) onlyBuyer unDone("rule1"){
		if(!isTime(signTime+period)){
			transferTo(Seller.account,10**14*(Proportion*Service.price));
			changeRule("rule1");
		}
	}
	function rule2() public payable onlyState(ContractState) onlySeller unDone("rule2"){
		if(isTime(signTime+period)&&!isDone("rule1")){
			ContractState="terminate";
			changeRule("rule2");
		}
	}
	function rule3() public payable onlyState(ContractState) onlyBuyer unDone("rule3"){
		if(isDone("rule1")&&logic(block.timestamp,startTime,"==")){
			transferTo(Seller.account,10**14*(Service.price-Proportion*Service.price));
			changeRule("rule3");
		}
	}
	function rule4() public payable onlyState(ContractState) onlySeller unDone("rule4"){
		if(isDone("rule3")){
			changeRule("rule4");
		}
	}
	function rule5() public payable onlyState(ContractState) onlyBuyer unDone("rule5"){
		if(isDone("rule4")){
			changeRule("rule5");
		}
	}
	function rule6(uint256 _lateDay) public payable onlyState(ContractState) onlySeller unDone("rule6"){
		uint256 lateDay = uint256(_lateDay);  // 转换为 uint256
		if(!isDone("rule5")&&isTime(startTime)){
			transferTo(Buyer.account,10**14*(lateDay*default1));
			changeRule("rule6");
		}
	}
	function rule7(uint256 _dayNum) public payable onlyState(ContractState) onlyBuyer unDone("rule7"){
		_dayNum = dayNum;   // 保持原有赋值
		if(isDone("rule5")){
			if(logic(dayNum,1,"==")){
				transferTo(Seller.account,10**14*(extend1));
			}
			if(logic(dayNum,1,"!=")){
				transferTo(Seller.account,10**14*(extend1+extend2*dayNum-extend3));
			}
			changeRule("rule7");
		}
	}
	function rule8(bool _checkStatus, uint256 _deviceAmount) public payable onlyState(ContractState) onlySeller unDone("rule8"){
		_checkStatus = checkStatus;   // 保持原有赋值
		_deviceAmount = deviceAmount;   // 保持原有赋值
		if(isTime(finishTime+dayNum)){
			changeRule("rule8");
		}
	}
	function rule9() public payable onlyState(ContractState) onlyBuyer unDone("rule9"){
		if(isDone("rule8")&&checkStatus){
			ContractState="finish";
			changeRule("rule9");
		}
	}
	function rule10() public payable onlyState(ContractState) onlyBuyer unDone("rule10"){
		if(isDone("rule8")&&!checkStatus){
			transferTo(Seller.account,10**14*(deviceAmount));
			ContractState="finish";
			changeRule("rule10");
		}
	}
	function rule11() public payable onlyState(ContractState) onlySeller unDone("rule11"){
		if(!isTime(finishTime+dayNum)){
			transferTo(Buyer.account,10**14*(defaultAmount));
			ContractState="terminate";
			changeRule("rule11");
		}
	}
	function rule12() public payable onlyState(ContractState) onlyBuyer unDone("rule12"){
		if(!isTime(finishTime+dayNum)){
			transferTo(Seller.account,10**14*(defaultAmount));
			ContractState="terminate";
			changeRule("rule12");
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
