#pragma version >0.3.10

faultName : public (String[256])
signTime : public (uint256)
signPlace : public (String[256])
shippingFee : public (uint256)
default1 : public (uint256)
checkResult : public (bool)
period : public (uint256)
warranty : public (uint256)
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
    model: String[256]
    name: String[256]
    color: String[256]
    seat: String[256]
    Voltage: uint256
    power: uint256
    quantity: uint256
    price: uint256
    sumtotal: uint256
    Remark: String[256]


Buyer: public(Person)
Seller: public(Person)
Arbitration: public(Ca)

Service: public(token)

@deploy
def __init__():
	self.faultName = ""
	self.signTime = 1441065600
	self.signPlace = "ShenZhen"
	self.shippingFee = 0
	self.default1 = 1000
	self.checkResult = False
	self.period = 864000
	self.warranty = 31536000
	self.Proportion = 500
	self.ContractState = "start"
	self.Buyer = Person (name = "ChongQing Olympic Sports Center", account=0x5B38Da6a701c568545dCfcB03FcB875f56beddC4)
	self.Seller = Person (name = "ShenZhen AoHu Electric Vehicle Co., Ltd.", account=0x5B38Da6a701c568545dCfcB03FcB875f56beddC4)
	self.Arbitration = Ca (name = "arbitration institution", account=0x5B38Da6a701c568545dCfcB03FcB875f56beddC4, key=0, year=0)

	self.Service = token(model="AH-Y14B", name="14ElectricVehicle", color="white", seat="regular", Voltage=72, power=7500, quantity=1, price=49800, sumtotal=49800, Remark="Shipping fee not included")

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
@external
def rule1():
	self.onlyBuyer()
	self.onlyState(self.ContractState)
	assert not self.isDone("rule1"),"rule1 already done"
	self.transferTo(self.Seller.account,10**14*(self.Service.sumtotal* self.Proportion))
	self.changeRule("rule1")

@external
def rule2(_shippingFee: uint256):
	self.onlySeller()
	self.onlyState(self.ContractState)
	assert not self.isDone("rule2"),"rule2 already done"
	self.shippingFee = _shippingFee
	if self.isDone("rule1") and not self.isTime( self.signTime+ self.period):
		self.changeRule("rule2")

@external
def rule3(_checkResult: bool):
	self.onlyBuyer()
	self.onlyState(self.ContractState)
	self.checkResult = _checkResult
	if self.isDone("rule2") and self.isTime( self.signTime+ self.period):
		if  self.checkResult:
			self.transferTo(self.Seller.account,10**14*(self.Service.sumtotal* self.Proportion+ self.shippingFee))
			self.ContractState="finish"
		self.changeRule("rule3")

@external
def rule4():
	self.onlyBuyer()
	self.onlyState(self.ContractState)
	if self.isDone("rule3") and not self.isTime( self.signTime+ self.warranty):
		self.changeRule("rule4")

@external
def rule5(_daynum: uint256):
	self.onlySeller()
	self.onlyState(self.ContractState)
	assert not self.isDone("rule5"),"rule5 already done"
	daynum: uint256 = _daynum
	if not self.isDone("rule3") and self.isTime( self.signTime+2* self.period):
		self.transferTo(self.Buyer.account,10**14*( self.default1* daynum))
		self.ContractState="terminate"
		self.changeRule("rule5")

@external
def rule6(_daynum: uint256):
	self.onlyBuyer()
	self.onlyState(self.ContractState)
	assert not self.isDone("rule6"),"rule6 already done"
	daynum: uint256 = _daynum
	if not self.isDone("rule2") and self.isTime( self.signTime+2* self.period):
		self.transferTo(self.Seller.account,10**14*( self.default1* daynum))
		self.ContractState="terminate"
		self.changeRule("rule6")

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

