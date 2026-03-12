pragma solidity >=0.7.0 <0.9.0;
contract FertilizerPurchase  
{ 
	string public place = "" ;
	uint public giveTime = 0 ;
	string public faultName = "" ;
	uint256 public amount = 0 ;
	bool public checkResult = false ;
	uint256 public period = 432000 ;
	uint256 public dayNum = 0 ;
	uint256 public Proportion = 5.0 ;
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
		   uint   number ; 
		   uint256  unit_price ;
		   uint   unit_weight ; 
		   uint256  price ;
		   string   other ; 
	}
	
	Person public Buyer = Person("JingMen City DongBao District Agriculture and Rural Affairs Bureau", payable(0x5B38Da6a701c568545dCfcB03FcB875f56beddC4));
	Person public Seller = Person("HuBei NanGuo Chemical Co., Ltd.", payable(0x5B38Da6a701c568545dCfcB03FcB875f56beddC4));
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
	token public Service = token("fertilizer", 6000, 91250.0, 25, 547500, "=30-0-15");
	constructor() {
	}
	event completedRule(address indexed person, string rulename);
	function end() internal{
		ContractState="finish";
	}
	function end2() internal{
		ContractState="terminate";
	}
	function rule1(string memory _place, uint _giveTime) public payable onlyState(ContractState) onlyBuyer unDone("rule1"){
		_place = place;   // 保持原有赋值
		_giveTime = giveTime;   // 保持原有赋值
			changeRule("rule1");
	}
	function rule2() public payable onlyState(ContractState) onlySeller unDone("rule2"){
		if(isDone("rule1")&&logic(block.timestamp,giveTime,"==")){
			changeRule("rule2");
		}
	}
	function rule2_2(uint256 _dayNum) public payable onlyState(ContractState) onlySeller unDone("rule2_2"){
		_dayNum = dayNum;   // 保持原有赋值
		if(isTime(giveTime)&&!isTime(giveTime+period)&&!isDone("rule2")){
			transferTo(Buyer.account,10**14*(dayNum*Proportion*Service.price));
			changeRule("rule2_2");
		}
	}
	function rule2_3() public payable onlyState(ContractState) onlyBuyer unDone("rule2_3"){
		if(isTime(giveTime+period)&&!isDone("rule2")&&!isDone("rule2_2")){
			ContractState="terminate";
			changeRule("rule2_3");
		}
	}
	function rule3(bool _checkResult) public payable onlyState(ContractState) onlyBuyer unDone("rule3"){
		_checkResult = checkResult;   // 保持原有赋值
		if(isDone("rule2")&&!isTime(functionFinishTime["rule2"]+60*60*24*15)
		){
			if(!checkResult){
				ContractState="terminate";
			}
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
			transferTo(Seller.account,10**14*(Service.price));
			end();
			changeRule("rule5");
		}
	}
	function rule6(string memory _faultName, uint256 _amount) public payable onlyArbitration unDone("rule6"){
		_faultName = faultName;   // 保持原有赋值
		_amount = amount;   // 保持原有赋值
			changeRule("rule6");
	}
	function rule7() public payable onlyBuyer unDone("rule7"){
		if(isDone("rule6")&&logic(faultName,Buyer.name,"==")){
			transferTo(Seller.account,10**14*(amount));
			end2();
			changeRule("rule7");
		}
	}
	function rule8() public payable onlySeller unDone("rule8"){
		if(isDone("rule6")&&logic(faultName,Seller.name,"==")){
			transferTo(Buyer.account,10**14*(amount));
			end2();
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
