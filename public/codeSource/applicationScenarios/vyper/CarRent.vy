#pragma version >0.3.10

default11 : public (uint256)
default12 : public (uint256)
default2 : public (uint256)
dayNum : public (uint256)
faultName : public (String[256])
amount : public (uint256)
signTime : public (uint256)
signPlaca : public (String[256])
startTime : public (uint256)
finishTime : public (uint256)
checkResult : public (bool)
ContractState: public(String[256])
functionStatus: public(HashMap[String[32],bool])
functionFinishTime: public(HashMap[String[32],uint256])	
struct Person: 
	name: String[256]
	account: address
	
struct Ca: 
    name: String[256]
    account: address
    key: uint256
    year: uint256

struct token:
    name: String[256]
    number: uint256
    unit_price: uint256
    price: uint256


Buyer: public(Person)
Seller: public(Person)
Arbitration: public(Ca)

Service: public(token)

@deploy
def __init__():
	self.default11 = 20
	self.default12 = 50
	self.default2 = 50
	self.dayNum = 0
	self.faultName = ""
	self.amount = 0
	self.signTime = 1667952000
	self.signPlaca = "XiAn"
	self.startTime = 1688947200
	self.finishTime = 1690761600
	self.checkResult = False
	self.ContractState = "start"
	self.Buyer = Person (name = "ShanXi Provincial Department of Housing and Urban-Rural Development Agency Supplier", account=0x5B38Da6a701c568545dCfcB03FcB875f56beddC4)
	self.Seller = Person (name = "XiAn YingBin Auto Car Service", account=0x5B38Da6a701c568545dCfcB03FcB875f56beddC4)
	self.Arbitration = Ca (name = "arbitration institution", account=0x5B38Da6a701c568545dCfcB03FcB875f56beddC4, key=0, year=0)

	self.Service = token(name="vehicle rental service", number=3, unit_price=11600, price=34800)

@internal
def onlyBuyer():
	assert msg.sender == self.Buyer.account, "Only Buyer can access this."

@internal
def onlySeller():
	assert msg.sender == self.Seller.account, "Only Seller can access this."

@internal
def onlyArbitration():
	assert msg.sender == self.Arbitration.account, "Only Arbitration can access this."

event completedRule:
    person: indexed(address)
    ruleName: String[256]

event Transfer:
    sender: indexed(address)
    receiver: indexed(address)
    value: uint256

event ContractStateChange:
    newState: String[32]
def operation1():
	self.ContractState="finish"

def operation2():
	self.ContractState="terminate"

@internal
def condition1() -> bool:
	if not self.isTime(self.functionFinishTime["rule1"]+60*60*24*10): return True
	else:
	 	return False

@internal
def condition2() -> bool:
	if not self.isTime(self.functionFinishTime["rule2"]+60*60*24*7): return True
	else:
	 	return False

@internal
def condition3() -> bool:
	if self.isDone("rule2"): return True
	else:
	 	return False

@internal
def condition4() -> bool:
	if self.condition3() or self.condition1(): return True
	else:
	 	return False

@internal
def condition5() -> bool:
	if self.logic( self.Service.price*self.dayNum*self.default11,  self.Service.price*self.default12, ">"): return True
	else:
	 	return False

@external
def rule1():
	self.onlySeller()
	self.onlyState(self.ContractState)
	assert not self.isDone("rule1"),"rule1 already done"
	if self.isTime(self.startTime) and not self.isTime(self.finishTime):
		self.changeRule("rule1")

@external
def rule2(_checkResult: bool):
	self.onlyBuyer()
	self.onlyState(self.ContractState)
	assert not self.isDone("rule2"),"rule2 already done"
	self.checkResult = _checkResult
	if self.isDone("rule1"):
		self.changeRule("rule2")

@external
def rule3():
	self.onlyBuyer()
	self.onlyState(self.ContractState)
	assert not self.isDone("rule3"),"rule3 already done"
	if self.condition4() or self.isDone("rule7"):
		self.transferTo(self.Seller.account,10**14*(self.Service.price))
		self.operation1()
		self.changeRule("rule3")

@external
def rule4():
	self.onlyBuyer()
	self.onlyState(self.ContractState)
	assert not self.isDone("rule4"),"rule4 already done"
	if self.isDone("rule2") and not self.checkResult and self.condition2():
		self.changeRule("rule4")

@external
def rule5():
	self.onlyBuyer()
	self.onlyState(self.ContractState)
	assert not self.isDone("rule5"),"rule5 already done"
	if self.isDone("rule4") and not self.isTime(self.functionFinishTime["rule4"]+60*60*24*3):
		self.functionStatus["rule1"]=False
		self.functionStatus["rule3"]=False
		self.changeRule("rule5")

@external
def rule6(_dayNum: uint256):
	self.onlyBuyer()
	self.onlyState(self.ContractState)
	assert not self.isDone("rule6"),"rule6 already done"
	self.dayNum = _dayNum
	if self.isTime(self.finishTime) and not self.isDone("rule1"):
		if self.condition5():
			self.Service.price=self.Service.price-self.Service.price*self.dayNum*self.default12
		if not self.condition5():
			self.Service.price=self.Service.price-self.Service.price*self.dayNum*self.default11
		self.changeRule("rule6")

@external
def rule7(_dayNum: uint256):
	self.onlySeller()
	self.onlyState(self.ContractState)
	assert not self.isDone("rule7"),"rule7 already done"
	self.dayNum = _dayNum
	if self.condition3() and not self.condition1() and not self.isDone("rule3"):
		if self.condition5():
			self.Service.price=self.Service.price+self.Service.price*self.dayNum*self.default12
		if not self.condition5():
			self.Service.price=self.Service.price+self.Service.price*self.dayNum*self.default11
		self.changeRule("rule7")

@external
def rule8():
	self.onlySeller()
	self.onlyState(self.ContractState)
	assert not self.isDone("rule8"),"rule8 already done"
	self.transferTo(self.Buyer.account,10**14*(self.default2*self.Service.price))
	self.operation2()
	self.changeRule("rule8")

@external
def rule9():
	self.onlyBuyer()
	self.onlyState(self.ContractState)
	assert not self.isDone("rule9"),"rule9 already done"
	if self.isDone("rule10"):
		self.transferTo(self.Seller.account,10**14*(self.default2*self.Service.price))
		self.operation2()
		self.changeRule("rule9")

@external
def rule10(_faultName: String[256], _amount: uint256):
	self.onlyArbitration()
	assert not self.isDone("rule10"),"rule10 already done"
	self.faultName = _faultName
	self.amount = _amount
	self.changeRule("rule10")

@external
def rule11():
	self.onlyBuyer()
	assert not self.isDone("rule11"),"rule11 already done"
	if self.isDone("rule10") and self.logic_str(self.faultName,  self.Buyer.name, "=="):
		self.transferTo(self.Seller.account,10**14*(self.amount))
		self.operation1()
		self.changeRule("rule11")

@external
def rule12():
	self.onlySeller()
	assert not self.isDone("rule12"),"rule12 already done"
	if self.isDone("rule10") and self.logic_str(self.faultName,  self.Seller.name, "=="):
		self.transferTo(self.Buyer.account,10**14*(self.amount))
		self.operation1()
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

