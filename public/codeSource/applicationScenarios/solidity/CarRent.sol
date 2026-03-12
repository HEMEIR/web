pragma solidity >=0.7.0 <0.9.0;
contract CarRent  
{ 
	uint256 public default11 = 20.0 ;
	uint256 public default12 = 50.0 ;
	uint256 public default2 = 50.0 ;
	uint256 public dayNum = 0 ;
	string public faultName = "" ;
	uint256 public amount = 0 ;
	uint256 public signTime = 1667952000;
	string public signPlaca = "XiAn" ;
	uint256 public startTime = 1688947200;
	uint256 public finishTime = 1690761600;
	bool public checkResult = false ;
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
		   string   name ; 
		   uint256  number ;
		   uint256  unit_price ;
		   uint256  price ;
	}
	
	Person public Buyer = Person("ShanXi Provincial Department of Housing and Urban-Rural Development Agency Supplier", payable(0x5B38Da6a701c568545dCfcB03FcB875f56beddC4));
	Person public Seller = Person("XiAn YingBin Auto Car Service", payable(0x5B38Da6a701c568545dCfcB03FcB875f56beddC4));
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
	token public Service = token("vehicle rental service", 3, 11600, 34800);
	constructor() {
	}
	event completedRule(address indexed person, string rulename);
	function operation1() internal{
		ContractState="finish";
	}
	function operation2() internal{
		ContractState="terminate";
	}
	function condition1() internal view returns (bool) {
		if (!isTime(functionFinishTime["rule1"]+60*60*24*10)
		) return true;
		else return false;
	}
	function condition2() internal view returns (bool) {
		if (!isTime(functionFinishTime["rule2"]+60*60*24*7)
		) return true;
		else return false;
	}
	function condition3() internal view returns (bool) {
		if (isDone("rule2")) return true;
		else return false;
	}
	function condition4() internal view returns (bool) {
		if (condition3()||condition1()) return true;
		else return false;
	}
	function condition5() internal view returns (bool) {
		if (logic(Service.price*dayNum*default11,Service.price*default12,">")) return true;
		else return false;
	}
	function rule1() public payable onlyState(ContractState) onlySeller unDone("rule1"){
		if(isTime(startTime)&&!isTime(finishTime)){
			changeRule("rule1");
		}
	}
	function rule2(bool _checkResult) public payable onlyState(ContractState) onlyBuyer unDone("rule2"){
		_checkResult = checkResult;   // 保持原有赋值
		if(isDone("rule1")){
			changeRule("rule2");
		}
	}
	function rule3() public payable onlyState(ContractState) onlyBuyer unDone("rule3"){
		if(condition4()||isDone("rule7")){
			transferTo(Seller.account,10**14*(Service.price));
			operation1();
			changeRule("rule3");
		}
	}
	function rule4() public payable onlyState(ContractState) onlyBuyer unDone("rule4"){
		if(isDone("rule2")&&!checkResult&&condition2()){
			changeRule("rule4");
		}
	}
	function rule5() public payable onlyState(ContractState) onlyBuyer unDone("rule5"){
		if(isDone("rule4")&&!isTime(functionFinishTime["rule4"]+60*60*24*3)
		){
			functionStatus["rule1"]=false;
			functionStatus["rule3"]=false;
			changeRule("rule5");
		}
	}
	function rule6(uint256 _dayNum) public payable onlyState(ContractState) onlyBuyer unDone("rule6"){
		_dayNum = dayNum;   // 保持原有赋值
		if(isTime(finishTime)&&!isDone("rule1")){
			if(condition5()){
				Service.price=Service.price-Service.price*dayNum*default12;
			}
			if(!condition5()){
				Service.price=Service.price-Service.price*dayNum*default11;
			}
			changeRule("rule6");
		}
	}
	function rule7(uint256 _dayNum) public payable onlyState(ContractState) onlySeller unDone("rule7"){
		_dayNum = dayNum;   // 保持原有赋值
		if(condition3()&&!condition1()&&!isDone("rule3")){
			if(condition5()){
				Service.price=Service.price+Service.price*dayNum*default12;
			}
			if(!condition5()){
				Service.price=Service.price+Service.price*dayNum*default11;
			}
			changeRule("rule7");
		}
	}
	function rule8() public payable onlyState(ContractState) onlySeller unDone("rule8"){
			transferTo(Buyer.account,10**14*(default2*Service.price));
			operation2();
			changeRule("rule8");
	}
	function rule9() public payable onlyState(ContractState) onlyBuyer unDone("rule9"){
		if(isDone("rule10")){
			transferTo(Seller.account,10**14*(default2*Service.price));
			operation2();
			changeRule("rule9");
		}
	}
	function rule10(string memory _faultName, uint256 _amount) public payable onlyArbitration unDone("rule10"){
		_faultName = faultName;   // 保持原有赋值
		_amount = amount;   // 保持原有赋值
			changeRule("rule10");
	}
	function rule11() public payable onlyBuyer unDone("rule11"){
		if(isDone("rule10")&&logic(faultName,Buyer.name,"==")){
			transferTo(Seller.account,10**14*(amount));
			operation1();
			changeRule("rule11");
		}
	}
	function rule12() public payable onlySeller unDone("rule12"){
		if(isDone("rule10")&&logic(faultName,Seller.name,"==")){
			transferTo(Buyer.account,10**14*(amount));
			operation1();
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
