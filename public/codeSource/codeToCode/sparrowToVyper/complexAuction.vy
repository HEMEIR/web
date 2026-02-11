#pragma version >0.3.10

startTime : public (uint256)
giveTime : public (uint256)
finishTime : public (uint256)
highestBidder : public (String[256])
highestBid : public (uint256)
bidder : public (String[256])
bid : public (uint256)
biddingTime : public (uint256)
reservePrice : public (uint256)
Commission : public (uint256)
signTime : public (uint256)
FineIR : public (uint256)
payTime : public (uint256)
test_result : public (bool)
faultyParty : public (String[256])
compensation : public (uint256)
ContractState: public(String[256])
functionStatus: public(HashMap[String[32],bool])
functionFinishTime: public(HashMap[String[32],uint256])	
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
	ownership: String[256] 


Platform: public(Person)
Auctioneer: public(Person)
aaAccount: public(aa)
caAccount: public(ca)
raAccount: public(ra)

Service: public(token)
	
@deploy
def __init__():
	self.startTime = 970754400
	self.giveTime = 970704000
	self.finishTime = 970758000
	self.highestBidder = ""
	self.highestBid = 0
	self.bidder = ""
	self.bid = 0
	self.biddingTime = 3600
	self.reservePrice = 10000
	self.Commission = 1000
	self.signTime = 970272000
	self.FineIR = 200
	self.payTime = 43200
	self.test_result = False
	self.faultyParty = ""
	self.compensation = 0
	self.ContractState = "start"
	self.Platform = Person (name = "B", account=0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db)
	self.Auctioneer = Person (name = "A", account=0x5B38Da6a701c568545dCfcB03FcB875f56beddC4)
	
	self.Service = token(name="thing", number=1, ownership="A")

@internal
def onlyPlatform():
	assert msg.sender == self.Platform.account, "Only Platform can access this."

@internal
def onlyAuctioneer():
	assert msg.sender == self.Auctioneer.account, "Only Auctioneer can access this."

@internal
def onlyaaAccount():
	assert msg.sender == self.aaAccount.account, "Only aaAccount can access this."

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
	self.onlyAuctioneer()
	self.onlyState(self.ContractState)
	assert not self.isDone("rule2"),"rule2 already done"
	if not self.isTime( self.startTime) and  self.test_result:
		self.transferTo(self.Platform.account,10**14*( self.Commission))
		self.Service.ownership=self.Platform.name
		self.changeRule("rule2")

@external
def rule3():
	self.onlyPlatform()
	self.onlyState(self.ContractState)
	assert not self.isDone("rule3"),"rule3 already done"
	if self.isDone("rule1") and self.compareTimestamps( self.startTime,block.timestamp,3600,"<"):
		self.changeRule("rule3")

@external
def rule4(_bidder: String[256], _bid: uint256): 
	self.onlyState(self.ContractState)
	self.bidder = _bidder
	self.bid = _bid
	if self.isDone("rule3") and self.isTime( self.startTime) and not self.isTime( self.finishTime) and self.logic( self.bid,  self.highestBid, ">") and self.logic( self.bid,  self.reservePrice, ">="):
		 self.highestBid= self.bid
		 self.highestBidder= self.bidder
		 self.changeRule("rule4")

@external
def rule5(_bidder: String[256]):
  	self.onlyState(self.ContractState)
  	assert not self.isDone("rule5"),"rule5 already done"
  	self.bidder = _bidder
  	if self.isTime( self.finishTime) and self.logic_str( self.bidder,  self.highestBidder, "==") and self.compareTimestamps(block.timestamp,  self.finishTime,43200,"<"):
  		self.transferTo( self.Platform.account,10**14*( self.highestBid))
  		self.changeRule("rule5")

@external
def rule6():
  	self.onlyPlatform()
  	self.onlyState(self.ContractState)
  	assert not self.isDone("rule6"),"rule6 already done"
  	if self.isDone("rule5"):
  		self.transferTo( self.Auctioneer.account,10**14*( self.highestBid))
  		self.Service.ownership = self.bidder
  		self.ContractState = "finish"
  		self.changeRule("rule6")

@external
def rule8(_bidder: String[256]):
  	self.onlyState(self.ContractState)
  	assert not self.isDone("rule8"),"rule8 already done"
  	self.bidder = _bidder
  	if self.logic_str( self.bidder,  self.highestBidder, "==") and self.compareTimestamps(block.timestamp,  self.finishTime,43200,">=") and not self.isDone("rule5"):
  		self.transferTo( self.Platform.account,10**14*( (self.highestBid * self.FineIR) // 1000))
  		self.changeRule("rule8")

@external
def rule9():
  	self.onlyPlatform()
  	self.onlyState(self.ContractState)
  	assert not self.isDone("rule9"),"rule9 already done"
  	if self.isDone("rule8"):
  		self.transferTo( self.Auctioneer.account,10**14*( (self.highestBid * self.FineIR) // 1000))
  		self.changeRule("rule9")

@external
def rule10():
  	self.onlyraAccount()
  	self.ContractState="pause"
  	self.changeRule("rule10")

@external
def rule11():
  	self.onlyraAccount()
  	self.ContractState="restart"
  	self.changeRule("rule11")

@external
def rule12():
  	self.onlyPlatform()
  	self.onlyState(self.ContractState)
  	assert not self.isDone("rule12"),"rule12 already done"
  	if not self.isDone("rule4") and not self.isDone("rule8"):
  		self.changeRule("rule12")

@external
def rule13(_faultyParty: String[256], _compensation: uint256):
  	self.onlyaaAccount()
  	self.onlyState(self.ContractState)
  	assert not self.isDone("rule13"),"rule13 already done"
  	self.faultyParty = _faultyParty
  	self.compensation = _compensation
  	if self.isDone("rule12"):
  		self.changeRule("rule13")

@external
def rule14_1(_bidder: String[256]):
  	self.onlyPlatform()
  	self.onlyState(self.ContractState)
  	assert not self.isDone("rule14_1"),"rule14_1 already done"
  	self.bidder = _bidder
  	if self.logic_str( self.faultyParty,  self.Platform.name, "=="):
  		self.changeRule("rule14_1")

@external
def rule14_2():
  	self.onlyState(self.ContractState)
  	assert not self.isDone("rule14_2"),"rule14_2 already done"
  	if self.logic_str( self.faultyParty,  self.highestBidder, "=="):
  		self.transferTo( self.Platform.account,10**14*( self.compensation))
  		self.changeRule("rule14_2")

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
	

def compareTimestamps(timestamp1: uint256, timestamp2: uint256, custom_seconds: uint256, operator: String[32]) -> bool:
   
    time_difference: uint256 = timestamp1 - timestamp2
   
    if operator == ">":
        return time_difference > custom_seconds
    elif operator =="<":
        return time_difference < custom_seconds
    elif operator == "==":
        return time_difference == custom_seconds
    elif operator == "!=":
        return time_difference != custom_seconds
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

