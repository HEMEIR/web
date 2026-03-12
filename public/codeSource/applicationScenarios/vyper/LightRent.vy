#pragma version >0.3.10

extend1 : public (uint256)
extend2 : public (uint256)
extend3 : public (uint256)
default1 : public (uint256)
Proportion : public (uint256)
dayNum : public (uint256)
signTime : public (uint256)
period : public (uint256)
signPlace : public (String[256])
startTime : public (uint256)
finishTime : public (uint256)
checkStatus : public (bool)
deviceAmount : public (uint256)
defaultAmount : public (uint256)
ContractState: public(String[256])
functionStatus: public(HashMap[String[32],bool])
functionFinishTime: public(HashMap[String[32],uint256])	
struct Person: 
	name: String[256]
	account: address
	
struct token: 
    name: String[256]
    price: uint256


Buyer: public(Person)
Seller: public(Person)

Service: public(token)

@deploy
def __init__():
	self.extend1 = 10000
	self.extend2 = 20000
	self.extend3 = 30000
	self.default1 = 7710
	self.Proportion = 400
	self.dayNum = 0
	self.signTime = 1639526400
	self.period = 172800
	self.signPlace = "HuangGang City, HuBei Province, HeFei"
	self.startTime = 1639958400
	self.finishTime = 1640131200
	self.checkStatus = False
	self.deviceAmount = 0
	self.defaultAmount = 10000
	self.ContractState = "start"
	self.Buyer = Person (name = "LuoTian County HuangMei Drama Group", account=0x5B38Da6a701c568545dCfcB03FcB875f56beddC4)
	self.Seller = Person (name = "GuangYing Electronic Products Sales Department, BaoHe District, HeTei City", account=0x5B38Da6a701c568545dCfcB03FcB875f56beddC4)

	self.Service = token(name="Performance services", price=64807)

@internal
def onlyBuyer():
	assert msg.sender == self.Buyer.account, "Only Buyer can access this."

@internal
def onlySeller():
	assert msg.sender == self.Seller.account, "Only Seller can access this."

event completedRule:
    person: indexed(address)
    ruleName: String[256]

event Transfer:
    sender: indexed(address)
    receiver: indexed(address)
    value: uint256

event ContractStateChange:
    newState: String[32]
@external
def rule1():
	self.onlyBuyer()
	self.onlyState(self.ContractState)
	assert not self.isDone("rule1"),"rule1 already done"
	if not self.isTime( self.signTime+ self.period):
		self.transferTo(self.Seller.account,10**14*( self.Proportion*self.Service.price))
		self.changeRule("rule1")

@external
def rule2():
	self.onlySeller()
	self.onlyState(self.ContractState)
	assert not self.isDone("rule2"),"rule2 already done"
	if self.isTime( self.signTime+ self.period) and not self.isDone("rule1"):
		self.ContractState="terminate"
		self.changeRule("rule2")

@external
def rule3():
	self.onlyBuyer()
	self.onlyState(self.ContractState)
	assert not self.isDone("rule3"),"rule3 already done"
	if self.isDone("rule1") and self.logic( block.timestamp,  self.startTime, "=="):
		self.transferTo(self.Seller.account,10**14*(self.Service.price- self.Proportion*self.Service.price))
		self.changeRule("rule3")

@external
def rule4():
	self.onlySeller()
	self.onlyState(self.ContractState)
	assert not self.isDone("rule4"),"rule4 already done"
	if self.isDone("rule3"):
		self.changeRule("rule4")

@external
def rule5():
	self.onlyBuyer()
	self.onlyState(self.ContractState)
	assert not self.isDone("rule5"),"rule5 already done"
	if self.isDone("rule4"):
		self.changeRule("rule5")

@external
def rule6(_lateDay: uint256):
	self.onlySeller()
	self.onlyState(self.ContractState)
	assert not self.isDone("rule6"),"rule6 already done"
	lateDay: uint256 = _lateDay
	if not self.isDone("rule5") and self.isTime( self.startTime):
		self.transferTo(self.Buyer.account,10**14*( lateDay* self.default1))
		self.changeRule("rule6")

@external
def rule7(_dayNum: uint256):
	self.onlyBuyer()
	self.onlyState(self.ContractState)
	assert not self.isDone("rule7"),"rule7 already done"
	self.dayNum = _dayNum
	if self.isDone("rule5"):
		if self.logic( self.dayNum,  1, "=="):
			self.transferTo(self.Seller.account,10**14*( self.extend1))
		if self.logic( self.dayNum,  1, "!="):
			self.transferTo(self.Seller.account,10**14*( self.extend1+ self.extend2* self.dayNum- self.extend3))
		self.changeRule("rule7")

@external
def rule8(_checkStatus: bool, _deviceAmount: uint256):
	self.onlySeller()
	self.onlyState(self.ContractState)
	assert not self.isDone("rule8"),"rule8 already done"
	self.checkStatus = _checkStatus
	self.deviceAmount = _deviceAmount
	if self.isTime( self.finishTime+ self.dayNum):
		self.changeRule("rule8")

@external
def rule9():
	self.onlyBuyer()
	self.onlyState(self.ContractState)
	assert not self.isDone("rule9"),"rule9 already done"
	if self.isDone("rule8") and  self.checkStatus:
		self.ContractState="finish"
		self.changeRule("rule9")

@external
def rule10():
	self.onlyBuyer()
	self.onlyState(self.ContractState)
	assert not self.isDone("rule10"),"rule10 already done"
	if self.isDone("rule8") and not  self.checkStatus:
		self.transferTo(self.Seller.account,10**14*( self.deviceAmount))
		self.ContractState="finish"
		self.changeRule("rule10")

@external
def rule11():
	self.onlySeller()
	self.onlyState(self.ContractState)
	assert not self.isDone("rule11"),"rule11 already done"
	if not self.isTime( self.finishTime+ self.dayNum):
		self.transferTo(self.Buyer.account,10**14*( self.defaultAmount))
		self.ContractState="terminate"
		self.changeRule("rule11")

@external
def rule12():
	self.onlyBuyer()
	self.onlyState(self.ContractState)
	assert not self.isDone("rule12"),"rule12 already done"
	if not self.isTime( self.finishTime+ self.dayNum):
		self.transferTo(self.Seller.account,10**14*( self.defaultAmount))
		self.ContractState="terminate"
		self.changeRule("rule12")

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


@internal
def onlyState(State: String[256]):
    assert self.logic_str(State, "start","==") or self.logic_str(State, "restart","=="), "Not allowed in this state"

@internal
def changeRule(ruleName: String[32]):
    self.functionStatus[ruleName] = True
    self.functionFinishTime[ruleName] = block.timestamp
    log completedRule(msg.sender, ruleName)

