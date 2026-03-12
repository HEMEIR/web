#pragma version >0.3.10

penalty : public (uint256)
management_fee : public (uint256)
payduration : public (uint256)
startTime : public (uint256)
finishTime : public (uint256)
payTime : public (uint256)
time1 : public (uint256)
time2 : public (uint256)
isContinue : public (bool)
amount : public (uint256)
ContractState: public(String[256])
functionStatus: public(HashMap[String[32],bool])
functionFinishTime: public(HashMap[String[32],uint256])	
struct Person: 
	name: String[256]
	account: address
	
struct House: 
    location: String[256]
    usage: String[256]


Landlord: public(Person)
Tenant: public(Person)

house: public(House)

@deploy
def __init__():
	self.penalty = 3000
	self.management_fee = 4000
	self.payduration = 31536000
	self.startTime = 1602806400
	self.finishTime = 1697328000
	self.payTime = 1602806400
	self.time1 = 7776000
	self.time2 = 1296000
	self.isContinue = False
	self.amount = 0
	self.ContractState = "start"
	self.Landlord = Person (name = "Fengshan Town Vegetable Village Joint Stock Economic Cooperative", account=0x5B38Da6a701c568545dCfcB03FcB875f56beddC4)
	self.Tenant = Person (name = "Luotian County Statistics Bureau", account=0x5B38Da6a701c568545dCfcB03FcB875f56beddC4)

	self.house = House(location="Lijiawan", usage="office")

@internal
def onlyLandlord():
	assert msg.sender == self.Landlord.account, "Only Landlord can access this."

@internal
def onlyTenant():
	assert msg.sender == self.Tenant.account, "Only Tenant can access this."

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
	self.onlyTenant()
	self.onlyState(self.ContractState)
	assert not self.isDone("rule1"),"rule1 already done"
	if not self.isTime( self.startTime):
		self.transferTo(self.Landlord.account,10**14*( self.management_fee))
		self.changeRule("rule1")

@external
def rule2():
	self.onlyTenant()
	self.onlyState(self.ContractState)
	if self.isDone("rule1") and not self.isTime( self.payTime+ self.payduration):
		self.transferTo(self.Landlord.account,10**14*( self.management_fee))
		self.payTime=block.timestamp
		self.changeRule("rule2")

@external
def rule3(_isContinue: bool):
	self.onlyTenant()
	self.onlyState(self.ContractState)
	assert not self.isDone("rule3"),"rule3 already done"
	self.isContinue = _isContinue
	if not self.isTime( self.finishTime):
		if  self.isContinue:
			self.transferTo(self.Landlord.account,10**14*( self.management_fee))
			self.finishTime= self.finishTime+ self.payduration
		self.changeRule("rule3")

@external
def rule4(_amount: uint256):
	self.onlyLandlord()
	self.onlyState(self.ContractState)
	assert not self.isDone("rule4"),"rule4 already done"
	self.amount = _amount
	if self.isTime( self.finishTime) and not self.isTime( self.finishTime+ self.time2):
		self.changeRule("rule4")

@external
def rule5():
	self.onlyTenant()
	self.onlyState(self.ContractState)
	assert not self.isDone("rule5"),"rule5 already done"
	if self.isDone("rule4"):
		self.transferTo(self.Landlord.account,10**14*( self.amount))
		self.ContractState="finish"
		self.changeRule("rule5")

@external
def rule6():
	self.onlyLandlord()
	self.onlyState(self.ContractState)
	assert not self.isDone("rule6"),"rule6 already done"
	if self.isDone("rule1") and self.isTime( self.payTime+ self.payduration+ self.time1):
		self.ContractState="terminate"
		self.changeRule("rule6")

@external
def rule7():
	self.onlyLandlord()
	self.onlyState(self.ContractState)
	assert not self.isDone("rule7"),"rule7 already done"
	if not self.isTime( self.finishTime):
		self.transferTo(self.Tenant.account,10**14*( self.penalty))
		self.ContractState="terminate"
		self.changeRule("rule7")

@external
def rule8():
	self.onlyTenant()
	self.onlyState(self.ContractState)
	assert not self.isDone("rule8"),"rule8 already done"
	if not self.isTime( self.finishTime):
		self.transferTo(self.Landlord.account,10**14*( self.penalty))
		self.ContractState="terminate"
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

