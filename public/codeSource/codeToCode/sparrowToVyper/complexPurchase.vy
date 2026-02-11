#pragma version >0.3.10

place: public(String[256])
giveTime: public(uint256)
signTime: public(uint256)
price: public(uint256)
late_deliveryIR: public(uint256)
terminatedIR: public(uint256)
late_days: public(uint256)
late: public(uint256)
period: public(uint256)
faultyParty: public(String[256])
compensation: public(uint256)
test_result: public(bool)
solutionA: public(String[256])
solutionB: public(String[256])
solution_1: public(String[256])
solution_2: public(String[256])
solution_3: public(String[256])
ContractState: public(String[256])
functionStatus: public(HashMap[String[32], bool])
functionFinishTime: public(HashMap[String[32], uint256])	
struct Person: 
	name: String[256]
	account: address
	
struct aa: 
	name: String[256]
	account: address
	
struct ca: 
	name: String[256]
	account: address
	key: uint256
	year: uint256
	
struct ra: 
	name: String[256]
	account: address
	
struct token: 
	name: String[256] 
	number: uint256
	unit_price: uint256
	ownership: String[256] 


Buyer: public(Person)
Seller: public(Person)
Platform: public(Person)
aaa: public(aa)
court: public(aa)
caAccount: public(ca)
raAccount: public(ra)

Service: public(token)
	
@deploy
def __init__():
	self.place = "place"
	self.giveTime = 970704000
	self.signTime = 970358400
	self.price = 100
	self.late_deliveryIR = 50
	self.terminatedIR = 200
	self.late_days = 0
	self.late = 432000
	self.period = 1296000
	self.faultyParty = ""
	self.compensation = 0
	self.test_result = False
	self.solutionA = ""
	self.solutionB = ""
	self.solution_1 = "Negotiate"
	self.solution_2 = "Court"
	self.solution_3 = "ca"
	self.ContractState = "start"
	self.Buyer = Person (name = "A", account=0x5B38Da6a701c568545dCfcB03FcB875f56beddC4)
	self.Seller = Person (name = "B", account=0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2)
	self.Platform = Person (name = "P", account=0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db)
	
	self.Service = token(name="thing", number=1, unit_price=100, ownership="A")

@internal
def onlyBuyer():
	assert msg.sender == self.Buyer.account, "Only Buyer can access this."

@internal
def onlySeller():
	assert msg.sender == self.Seller.account, "Only Seller can access this."

@internal
def onlyPlatform():
	assert msg.sender == self.Platform.account, "Only Platform can access this."

@internal
def onlyaaa():
	assert msg.sender == self.aaa.account, "Only aaa can access this."

@internal
def onlycourt():
	assert msg.sender == self.court.account, "Only court can access this."

@internal
def onlycaAccount():
	assert msg.sender == self.caAccount.account, "Only caAccount can access this."

@internal
def onlyraAccount():
	assert msg.sender == self.raAccount.account, "Only raAccount can access this."

event completedRule: 
    person: indexed(address)
    ruleName: String[256]

event Transfer: 
    sender: indexed(address)
    receiver: indexed(address)
    value: uint256

event ContractStateChange:
    newState: String[32]
@internal
def operation1():
	self.ContractState = "finish"

@internal
def operation2():
	self.ContractState = "terminate"

@internal
def operation3():
	self.transferTo(self.Buyer.account, 10**14 * (self.price * self.terminatedIR // 1000))

@internal
def operation4():
	self.Service.ownership = self.Buyer.name

@internal
@view
def condition1() -> bool:
	if self.compareStrings(self.solutionA, self.solutionB):
		return True
	else:
		return False

@internal
@view
def condition2() -> bool:
	if self.isDone("rule19"):
		return True
	else:
		return False

@external
def rule1(_test_result: bool):
	self.onlycaAccount()
	self.onlyState(self.ContractState)
	assert not self.isDone("rule1"),"rule1 already done"
	self.test_result = _test_result
	if not self.isTime( self.giveTime):
		self.changeRule("rule1")

@external
def rule2():
	self.onlyBuyer()
	self.onlyState(self.ContractState)
	assert not self.isDone("rule2"),"rule2 already done"
	if not self.isTime( self.giveTime) and  self.test_result:
		self.transferTo(self.Platform.account,10**14*( self.price))
		self.changeRule("rule2")

@external
def rule3():
	self.onlySeller()
	self.onlyState(self.ContractState)
	assert not self.isDone("rule3"),"rule3 already done"
	if self.isDone("rule1") and self.compareTimestamps(block.timestamp, self.giveTime,86400,"<"):
		self.changeRule("rule3")

@external
def rule4():
	self.onlyPlatform()
	self.onlyState(self.ContractState)
	assert not self.isDone("rule4"),"rule4 already done"
	if self.isDone("rule2") or self.isDone("rule8"):
		self.changeRule("rule4")

@external
def rule5():
	self.onlyBuyer()
	self.onlyState(self.ContractState)
	assert not self.isDone("rule5"), "rule5 already done"
	if not self.isTime(self.functionFinishTime["rule3"] + 60 * 60 * 24 * 15):
		self.operation4()
		self.changeRule("rule5")

@external
def rule6():
	self.onlyPlatform()
	self.onlyState(self.ContractState)
	assert not self.isDone("rule6"),"rule6 already done"
	if self.isDone("rule5"):
		self.transferTo(self.Seller.account,10**14*( self.price))
		self.operation1()
		self.changeRule("rule6")

@external
def rule7():
	self.onlyPlatform()
	self.onlyState(self.ContractState)
	assert not self.isDone("rule7"),"rule7 already done"
	if self.isDone("rule4") and self.isTime(self.functionFinishTime["rule4"]+1296000):
		self.transferTo(self.Seller.account,10**14*( self.price))
		self.operation4()
		self.operation1()
		self.changeRule("rule7")

@external
def rule8(_late_days: uint256):
	self.onlySeller()
	self.onlyState(self.ContractState)
	assert not self.isDone("rule8"),"rule8 already done"
	self.late_days = _late_days
	if self.compareTimestamps(block.timestamp, self.giveTime,432000,"<="):
		self.transferTo(self.Buyer.account,10**14*( self.late_days* self.price*self.late_deliveryIR//1000))
		self.changeRule("rule8")

@external
def rule9():
	self.onlySeller()
	self.onlyState(self.ContractState)
	assert not self.isDone("rule9"),"rule9 already done"
	if self.compareTimestamps(block.timestamp, self.giveTime,432000,">") and not self.isDone("rule7"):
		self.operation3()
		self.operation2()
		self.changeRule("rule9")

@external
def rule10():
	self.onlyPlatform()
	self.onlyState(self.ContractState)
	assert not self.isDone("rule10"),"rule10 already done"
	if self.isDone("rule9"):
		self.transferTo(self.Buyer.account,10**14*( self.price))
		self.changeRule("rule10")

@external
def rule11():
	self.onlyBuyer()
	self.onlyState(self.ContractState)
	assert not self.isDone("rule11"), "rule11 already done"
	self.operation3()
	self.changeRule("rule11")

@external
def rule12():
	self.onlySeller()
	self.onlyState(self.ContractState)
	assert not self.isDone("rule12"), "rule12 already done"
	self.operation3()
	self.changeRule("rule12")

@external
def rule13():
	self.onlyPlatform()
	self.onlyState(self.ContractState)
	assert not self.isDone("rule13"),"rule13 already done"
	if self.isDone("rule11") or self.isDone("rule12"):
		self.transferTo(self.Buyer.account,10**14*( self.price))
		self.operation2()
		self.changeRule("rule13")

@external
def rule14():
	self.onlyraAccount()
	self.ContractState = "pause"
	self.changeRule("rule14")

@external
def rule15():
	self.onlyraAccount()
	self.ContractState = "restart"
	self.changeRule("rule15")

@external
def rule16(_solution_1: String[256]):
	self.onlyBuyer()
	self.onlyState(self.ContractState)
	assert not self.isDone("rule16"), "rule16 already done"
	self.solution_1 = _solution_1
	self.changeRule("rule16")

@external
def rule17(_solution_2: String[256]):
	self.onlySeller()
	self.onlyState(self.ContractState)
	assert not self.isDone("rule17"), "rule17 already done"
	self.solution_2 = _solution_2
	self.changeRule("rule17")

@external
def rule18(_faultyParty: String[256], _compensation: uint256):
	self.onlyBuyer()
	self.onlyState(self.ContractState)
	assert not self.isDone("rule18"),"rule18 already done"
	self.faultyParty = _faultyParty
	self.compensation = _compensation
	if self.logic_str(self.solutionA, self.solution_1, "==") and self.condition1():
		self.changeRule("rule18")

@external
def rule19():
	self.onlySeller()
	self.onlyState(self.ContractState)
	assert not self.isDone("rule19"),"rule19 already done"
	if self.isDone("rule18"):
		self.changeRule("rule19")

@external
def rule20_1():
	self.onlyBuyer()
	self.onlyState(self.ContractState)
	assert not self.isDone("rule20_1"),"rule20_1 already done"
	if self.condition2() and self.logic_str(self.faultyParty,  self.Buyer.name, "=="):
		self.transferTo(self.Seller.account,10**14*( self.compensation))
		self.changeRule("rule20_1")

@external
def rule20_2():
	self.onlySeller()
	self.onlyState(self.ContractState)
	assert not self.isDone("rule20_2"),"rule20_2 already done"
	if self.condition2() and self.logic_str(self.faultyParty,  self.Seller.name, "=="):
		self.transferTo(self.Buyer.account,10**14*( self.compensation))
		self.changeRule("rule20_2")

@external
def rule21(_faultyParty: String[256], _compensation: uint256):
	self.onlycourt()
	self.onlyState(self.ContractState)
	assert not self.isDone("rule21"),"rule21 already done"
	self.faultyParty = _faultyParty
	self.compensation = _compensation
	if self.compareStrings( self.solutionA, self.solution_2) and self.condition1():
		self.changeRule("rule21")

@external
def rule23(_faultyParty: String[256], _compensation: uint256):
	self.onlyaaa()
	self.onlyState(self.ContractState)
	assert not self.isDone("rule23"),"rule23 already done"
	self.faultyParty = _faultyParty
	self.compensation = _compensation
	if self.compareStrings( self.solutionA, self.solution_2) and self.condition1():
		self.changeRule("rule23")

@internal
@view
def isDone(functionName: String[32]) -> bool:
    return self.functionStatus[functionName]
			

@view
def isTime(targetTime: uint256) -> bool:
    return block.timestamp >= targetTime



@internal
@payable
def transferTo(recipient: address, amount: uint256):
    assert recipient != 0x0000000000000000000000000000000000000000, "Invalid recipient address"
    assert amount > 0, "Amount must be greater than zero"
    send(recipient, amount)
    log Transfer(msg.sender, recipient, amount)

@view
def compareTimestamps(timestamp1: uint256, timestamp2: uint256, custom_seconds: uint256, operator: String[32]) -> bool:
	
	time_difference: uint256 = timestamp1 - timestamp2
	
	if operator == ">":
		return time_difference > custom_seconds
	elif operator == "<":
		return time_difference < custom_seconds
	elif operator == "==":
		return time_difference == custom_seconds
	elif operator == "!=":
		return time_difference != custom_seconds
	else:
		raise "Invalid operator."

@view
def logic(a: uint256, b: uint256, op: String[32]) -> bool:
    return self.compare_uint(a, b, op)
		
@view
def logic_str(a: String[256], b: String[256], op: String[32]) -> bool:
    return self.compare_string(a, b, op)
    
@view
def compare_uint(a: uint256, b: uint256, op: String[32]) -> bool:
    if op == ">":
        return a > b
    elif op == "<":
        return a < b
    elif op == ">=":
        return a >= b
    elif op == "<=":
        return a <= b
    elif op == "==":
        return a == b
    elif op == "!=":
        return a != b
    else:
        raise "Invalid operator."

@view
def compare_string(a: String[256], b: String[256], op: String[32]) -> bool:
    if op == "==":
        return a == b
    elif op == "!=":
        return a != b
    else:
        raise "Invalid operator."
	

    
@view
def compareStrings(str1: String[256], str2: String[256]) -> bool:
	return str1 == str2
    			


@internal
def onlyState(State: String[256]):
    assert self.logic_str(State, "start","==") or self.logic_str(State, "restart","=="), "Not allowed in this state"

@internal
def changeRule(ruleName: String[32]):
    self.functionStatus[ruleName] = True
    self.functionFinishTime[ruleName] = block.timestamp
    log completedRule(msg.sender, ruleName)

