#pragma version >0.3.10

place : public (String[256])
giveTime : public (uint256)
faultName : public (String[256])
amount : public (uint256)
checkResult : public (bool)
period : public (uint256)
dayNum : public (uint256)
Proportion : public (uint256)
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
    unit_weight: uint256
    price: uint256
    other: String[256]

Buyer: public(Person)
Seller: public(Person)
Arbitration: public(Ca)

Service: public(token)

@deploy
def __init__():
	self.place = ""
	self.giveTime = 0
	self.faultName = ""
	self.amount = 0
	self.checkResult = False
	self.period = 432000
	self.dayNum = 0
	self.Proportion = 5
	self.ContractState = "start"
	self.Buyer = Person (name = "JingMen City DongBao District Agriculture and Rural Affairs Bureau", account=0x5B38Da6a701c568545dCfcB03FcB875f56beddC4)
	self.Seller = Person (name = "HuBei NanGuo Chemical Co., Ltd.", account=0x5B38Da6a701c568545dCfcB03FcB875f56beddC4)
	self.Arbitration = Ca (name = "arbitration institution", account=0x5B38Da6a701c568545dCfcB03FcB875f56beddC4, key=0, year=0)

	self.Service = token(name="fertilizer", number=6000, unit_price=91250, unit_weight=25, price=547500, other="=30-0-15")

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
def end():
	self.ContractState="finish"

def end2():
	self.ContractState="terminate"

@external
def rule1(_place: String[256], _giveTime: uint256):
	self.onlyBuyer()
	self.onlyState(self.ContractState)
	assert not self.isDone("rule1"),"rule1 already done"
	self.place = _place
	self.giveTime = _giveTime
	self.changeRule("rule1")

@external
def rule2():
	self.onlySeller()
	self.onlyState(self.ContractState)
	assert not self.isDone("rule2"),"rule2 already done"
	if self.isDone("rule1") and self.logic( block.timestamp,  self.giveTime, "=="):
		self.changeRule("rule2")

@external
def rule2_2(_dayNum: uint256):
	self.onlySeller()
	self.onlyState(self.ContractState)
	assert not self.isDone("rule2_2"),"rule2_2 already done"
	self.dayNum = _dayNum
	if self.isTime( self.giveTime) and not self.isTime( self.giveTime+ self.period) and not self.isDone("rule2"):
		self.transferTo(self.Buyer.account,10**14*( self.dayNum* self.Proportion*self.Service.price))
		self.changeRule("rule2_2")

@external
def rule2_3():
	self.onlyBuyer()
	self.onlyState(self.ContractState)
	assert not self.isDone("rule2_3"),"rule2_3 already done"
	if self.isTime( self.giveTime+ self.period) and not self.isDone("rule2") and not self.isDone("rule2_2"):
		self.ContractState="terminate"
		self.changeRule("rule2_3")

@external
def rule3(_checkResult: bool):
	self.onlyBuyer()
	self.onlyState(self.ContractState)
	assert not self.isDone("rule3"),"rule3 already done"
	self.checkResult = _checkResult
	if self.isDone("rule2") and not self.isTime(self.functionFinishTime["rule2"]+60*60*24*15):
		if not  self.checkResult:
			self.ContractState="terminate"
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
		self.transferTo(self.Seller.account,10**14*(self.Service.price))
		self.end()
		self.changeRule("rule5")

@external
def rule6(_faultName: String[256], _amount: uint256):
	self.onlyArbitration()
	assert not self.isDone("rule6"),"rule6 already done"
	self.faultName = _faultName
	self.amount = _amount
	self.changeRule("rule6")

@external
def rule7():
	self.onlyBuyer()
	assert not self.isDone("rule7"),"rule7 already done"
	if self.isDone("rule6") and self.logic_str(self.faultName,  self.Buyer.name, "=="):
		self.transferTo(self.Seller.account,10**14*( self.amount))
		self.end2()
		self.changeRule("rule7")

@external
def rule8():
	self.onlySeller()
	assert not self.isDone("rule8"),"rule8 already done"
	if self.isDone("rule6") and self.logic_str(self.faultName,  self.Seller.name, "=="):
		self.transferTo(self.Buyer.account,10**14*( self.amount))
		self.end2()
		self.changeRule("rule8")

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

