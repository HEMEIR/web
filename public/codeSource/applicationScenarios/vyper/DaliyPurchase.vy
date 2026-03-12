#pragma version >0.3.10

place : public (String[256])
giveTime : public (uint256)
ContractState: public(String[256])
functionStatus: public(HashMap[String[32],bool])
functionFinishTime: public(HashMap[String[32],uint256])	
struct Person: 
	name: String[256]
	account: address
	
struct token: 
    name: String[256]
    ID: String[256]
    number: uint256
    unit_price: uint256
    price: uint256


Buyer: public(Person)
Seller: public(Person)

Service: public(token)

@deploy
def __init__():
	self.place = ""
	self.giveTime = 0
	self.ContractState = "start"
	self.Buyer = Person (name = "Wuhan Caidian District Justice Bureau", account=0x5B38Da6a701c568545dCfcB03FcB875f56beddC4)
	self.Seller = Person (name = "Shengxing Hardware Store, Caidian District, Wuhan City", account=0x5B38Da6a701c568545dCfcB03FcB875f56beddC4)

	self.Service = token(name="Daliy", ID="many", number=1, unit_price=4801, price=4801)

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
	if self.logic( block.timestamp,  self.giveTime, "=="):
		self.changeRule("rule2")

@external
def rule3():
	self.onlyBuyer()
	self.onlyState(self.ContractState)
	assert not self.isDone("rule3"),"rule3 already done"
	if self.isDone("rule2"):
		self.transferTo(self.Seller.account,10**14*(self.Service.price))
		self.ContractState="finish"
		self.changeRule("rule3")

@internal
@view
def isDone(functionName: String[32]) -> bool:
    return self.functionStatus[functionName]


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

