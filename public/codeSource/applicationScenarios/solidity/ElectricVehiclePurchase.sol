pragma solidity >=0.7.0 <0.9.0;
contract ElectricVehiclePurchase  
{ 
	string public faultName = "" ;
	uint256 public signTime = 1441065600;
	string public signPlace = "ShenZhen" ;
	uint256 public shippingFee = 0 ;
	uint256 public default1 = 1000 ;
	bool public checkResult = false ;
	uint256 public period = 864000 ;
	uint256 public warranty = 31536000 ;
	uint256 public Proportion = 500.0 ;
	string public ContractState="start";
	mapping(string => bool) public functionStatus;
	mapping(string => uint) public functionFinishTime;	
	struct Person {
		string name;
		address payable account;
	}
	struct Ca {
		string name;
		address payable account;
		uint256 key;
		uint256 year;
	}
		struct token {
		   string   model ; 
		   string   name ; 
		   string   color ; 
		   string   seat ; 
		   uint   Voltage ; 
		   uint256  power ;
		   uint   quantity ; 
		   uint   price ; 
		   uint   sumtotal ; 
		   string   Remark ; 
	}
	
	Person public Buyer = Person("ChongQing Olympic Sports Center", payable(0x5B38Da6a701c568545dCfcB03FcB875f56beddC4));
	Person public Seller = Person("ShenZhen AoHu Electric Vehicle Co., Ltd.", payable(0x5B38Da6a701c568545dCfcB03FcB875f56beddC4));
	Ca public Arbitration = Ca("arbitration institution", payable(0x5B38Da6a701c568545dCfcB03FcB875f56beddC4), 0, 0);
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
	token public Service = token("AH-Y14B", "14ElectricVehicle", "white", "regular", 72, 7500.0, 1, 49800, 49800, "Shipping fee not included");
	constructor() {
	}
	event completedRule(address indexed person, string rulename);
	function rule1() public payable onlyState(ContractState) onlyBuyer unDone("rule1"){
			transferTo(Seller.account,10**14*(Service.sumtotal*Proportion));
			changeRule("rule1");
	}
	function rule2(uint256 _shippingFee) public payable onlyState(ContractState) onlySeller unDone("rule2"){
		_shippingFee = shippingFee;   // 保持原有赋值
		if(isDone("rule1")&&!isTime(signTime+period)){
			changeRule("rule2");
		}
	}
	function rule3(bool _checkResult) public payable onlyState(ContractState) onlyBuyer {
		_checkResult = checkResult;   // 保持原有赋值
		if(isDone("rule2")&&isTime(signTime+period)){
			if(checkResult){
				transferTo(Seller.account,10**14*(Service.sumtotal*Proportion+shippingFee));
				ContractState="finish";
			}
			changeRule("rule3");
		}
	}
	function rule4() public payable onlyState(ContractState) onlyBuyer {
		if(isDone("rule3")&&!isTime(signTime+warranty)){
			changeRule("rule4");
		}
	}
	function rule5(uint _daynum) public payable onlyState(ContractState) onlySeller unDone("rule5"){
		uint daynum = _daynum;   // 使用正确的类型进行赋值
		if(!isDone("rule3")&&isTime(signTime+2*period)){
			transferTo(Buyer.account,10**14*(default1*daynum));
			ContractState="terminate";
			changeRule("rule5");
		}
	}
	function rule6(uint _daynum) public payable onlyState(ContractState) onlyBuyer unDone("rule6"){
		uint daynum = _daynum;   // 使用正确的类型进行赋值
		if(!isDone("rule2")&&isTime(signTime+2*period)){
			transferTo(Seller.account,10**14*(default1*daynum));
			ContractState="terminate";
			changeRule("rule6");
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
