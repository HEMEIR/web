pragma solidity >=0.7.0 <0.9.0;
contract complexRent  
{ 
	uint256 public startTime = 970747200;
	uint256 public finishTime = 973425600;
	uint256 public payTime = 970747200;
	uint256 public period = 864000 ;
	uint256 public max_late = 432000 ;
	uint public late_days = 0 ;
	uint256 public breakIR = 200.0 ;
	uint public rent = 1000 ;
	uint public despoit = 500 ;
	uint public continueRent = 200 ;
	bool public continue = false ;
	uint public continueDays = 0 ;
	bool public checkResult = false ;
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
		   uint   price ;
		   uint   day ;
		   string   ownership ;
		   string   useRight ;
	}
	
	Person public lessor = Person("A", payable(0x5B38Da6a701c568545dCfcB03FcB875f56beddC4));
	Person public lessee = Person("B", payable(0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2));
	aa public aa = aa("aa", payable(0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db));
	ca public ca = ca("ca", payable(0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db), 123, 3);
	ra public ra = ra("ra", payable(0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db));
	modifier onlylessor(){
		require(msg.sender == lessor.account,"Only lessor can access this.");
		 _; 
	}
	modifier onlylessee(){
		require(msg.sender == lessee.account,"Only lessee can access this.");
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
	token public thing = token("thing", 100, 30, "A", "A");
	constructor() {
	// Initialize the group
	}
	event completedRule(address indexed person, string rulename);
	function giveUse() internal{
		thing.useRight=lessee.name;
	}
	function getUse() internal{
		thing.useRight=lessor.name;
	}
	function end() internal{
		ContractState="finish";
	}
	function end2() internal{
		ContractState="terminate";
	}
	function give() internal view returns (bool) {
		if (isDone("rule3")||isDone("rule4")) return true;
		else return false;
	}
	function rule1(bool _checkResult) public payable onlyState(ContractState) onlyca unDone("rule1"){
		checkResult = _checkResult;
		if(!isTime(startTime)){
			functionStatus["rule1"] = true;
			functionFinishTime["rule1"]=block.timestamp;
			emit completedRule(msg.sender,"rule1");
		}
	}
	function rule2() public payable onlyState(ContractState) onlylessee unDone("rule2"){
		if(!isTime(startTime)||isTrue(checkResult)){
			transferTo(lessor.account,10**14*rent+despoit);
			functionStatus["rule2"] = true;
			functionFinishTime["rule2"]=block.timestamp;
			emit completedRule(msg.sender,"rule2");
		}
	}
	function rule3() public payable onlyState(ContractState) onlylessor unDone("rule3"){
		if(isDone("rule2")||!isTime(startTime)){
			giveUse();
			functionStatus["rule3"] = true;
			functionFinishTime["rule3"]=block.timestamp;
			emit completedRule(msg.sender,"rule3");
		}
	}
	function rule4(uint _late_days) public payable onlyState(ContractState) onlylessor unDone("rule4"){
		late_days = _late_days;
		if(!isTime(startTime+max_late)||!isDone("rule3")){
			transferTo(lessee.account,10**14*rent*5*breakIR/1000);
			giveUse();
			functionStatus["rule4"] = true;
			functionFinishTime["rule4"]=block.timestamp;
			emit completedRule(msg.sender,"rule4");
		}
	}
	function rule5() public payable onlyState(ContractState) onlylessor unDone("rule5"){
		if(isTime(startTime+max_late)||!isDone("rule3")||!isDone("rule4")){
			transferTo(lessee.account,10**14*rent*5*breakIR/1000+rent+despoit);
			end2();
			functionStatus["rule5"] = true;
			functionFinishTime["rule5"]=block.timestamp;
			emit completedRule(msg.sender,"rule5");
		}
	}
	function rule6() public payable onlyState(ContractState) onlylessee {
		if(give()||isTime(payTime+period)||!isTime(payTime+period+86400)||!isTime(finishTime)){
			transferTo(lessor.account,10**14*rent);
			payTime=payTime+period;
			functionStatus["rule8"]=true;
			functionStatus["rule6"] = true;
			functionFinishTime["rule6"]=block.timestamp;
			emit completedRule(msg.sender,"rule6");
		}
	}
	function rule7(uint _late_days) public payable onlyState(ContractState) onlylessee {
		late_days = _late_days;
		if(isTime(payTime+period+86400)||!isTime(payTime+period+432000)){
			transferTo(lessor.account,10**14*rent*late_days*breakIR/1000);
			payTime=payTime+period;
			functionStatus["rule8"]=true;
			functionStatus["rule7"] = true;
			functionFinishTime["rule7"]=block.timestamp;
			emit completedRule(msg.sender,"rule7");
		}
	}
	function rule8(uint _late_days) public payable onlyState(ContractState) onlylessor unDone("rule8"){
		late_days = _late_days;
		if(isTime(payTime+period+432000)){
			getUse();
			end2();
			functionStatus["rule8"] = true;
			functionFinishTime["rule8"]=block.timestamp;
			emit completedRule(msg.sender,"rule8");
		}
	}
	function rule9(uint _continueDays) public payable onlyState(ContractState) onlylessee {
		continueDays = _continueDays;
		if(!isTime(finishTime)){
			transferTo(lessor.account,10**14*rent*continueDays);
			functionStatus["rule9"] = true;
			functionFinishTime["rule9"]=block.timestamp;
			emit completedRule(msg.sender,"rule9");
		}
	}
	function rule10(bool _continue) public payable onlyState(ContractState) onlylessor {
		continue = _continue;
		if(isDone("rule9")){
			if(isTrue(continue)){
				finishTime=finishTime+continueDays*60*60*24;
			}
			if(!isTrue(continue)){
				transferTo(lessee.account,10**14*rent*continueDays);
			}
			functionStatus["rule10"] = true;
			functionFinishTime["rule10"]=block.timestamp;
			emit completedRule(msg.sender,"rule10");
		}
	}
	function rule11() public payable onlyState(ContractState) onlylessor unDone("rule11"){
		if(isTime(finishTime)){
			getUse();
			transferTo(lessee.account,10**14*deposit);
			end();
			functionStatus["rule11"] = true;
			functionFinishTime["rule11"]=block.timestamp;
			emit completedRule(msg.sender,"rule11");
		}
	}
	function rule12() internal onlyra{
			ContractState="pause";
			functionStatus["rule12"] = true;
			functionFinishTime["rule12"]=block.timestamp;
			emit completedRule(msg.sender,"rule12");
	}
	function rule13() internal onlyra{
			ContractState="restart";
			functionStatus["rule13"] = true;
			functionFinishTime["rule13"]=block.timestamp;
			emit completedRule(msg.sender,"rule13");
	}
	function rule14() public payable onlyState(ContractState) onlylessee unDone("rule14"){
			functionStatus["rule14"] = true;
			functionFinishTime["rule14"]=block.timestamp;
			emit completedRule(msg.sender,"rule14");
	}
	function rule15() public payable onlyState(ContractState) onlylessor unDone("rule15"){
			functionStatus["rule15"] = true;
			functionFinishTime["rule15"]=block.timestamp;
			emit completedRule(msg.sender,"rule15");
	}
	function rule16(string memory _fault_party, uint _compensation) public payable onlyState(ContractState) onlyaa unDone("rule16"){
		fault_party = _fault_party;
		compensation = _compensation;
		if(isDone("rule14")||isDone("rule15")){
			functionStatus["rule16"] = true;
			functionFinishTime["rule16"]=block.timestamp;
			emit completedRule(msg.sender,"rule16");
		}
	}
	function rule17_1() public payable onlyState(ContractState) onlylessor unDone("rule17_1"){
		if(compareStrings(fault_party,lessor.name)){
			transferTo(lessee.account,10**14*compensation);
			end2();
			functionStatus["rule17_1"] = true;
			functionFinishTime["rule17_1"]=block.timestamp;
			emit completedRule(msg.sender,"rule17_1");
		}
	}
	function rule17_2() public payable onlyState(ContractState) onlylessee unDone("rule17_2"){
		if(compareStrings(fault_party,lessee.name)){
			transferTo(lessor.account,10**14*compensation);
			end2();
			functionStatus["rule17_2"] = true;
			functionFinishTime["rule17_2"]=block.timestamp;
			emit completedRule(msg.sender,"rule17_2");
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
