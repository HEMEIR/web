# @version 0.4.3

startTime: public(uint256)
finishTime: public(uint256)
payTime: public(uint256)
period: public(uint256)
max_late: public(uint256)
late_days: public(uint256)
breakIR: public(uint256)
rent: public(uint256)
deposit: public(uint256)
continueRent: public(uint256)
iscontinue: public(bool)
continueDays: public(uint256)
checkResult: public(bool)
faultyParty: public(String[256])
compensation: public(uint256)
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
    price: uint256
    day: uint256
    ownership: String[256]
    useRight: String[256]


lessor: public(Person)
lessee: public(Person)
aaAccount: public(aa)
caAccount: public(ca)
raAccount: public(ra)

Service: public(token)


@deploy
def __init__():
    self.startTime = 970747200
    self.finishTime = 973425600
    self.payTime = 970747200
    self.period = 864000
    self.max_late = 432000
    self.late_days = 0
    self.breakIR = 200
    self.rent = 1000
    self.deposit = 500
    self.continueRent = 200
    self.iscontinue = False
    self.continueDays = 0
    self.checkResult = False
    self.faultyParty = ""
    self.compensation = 0
    self.ContractState = "start"
    self.lessor = Person(name="A", account=0x5B38Da6a701c568545dCfcB03FcB875f56beddC4)
    self.lessee = Person(name="B", account=0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2)
    self.Service = token(name="thing", price=100, day=30, ownership="A", useRight="A")


@internal
def onlylessor():
    assert msg.sender == self.lessor.account, "Only lessor can access this."


@internal
def onlylessee():
    assert msg.sender == self.lessee.account, "Only lessee can access this."


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


def operation1():
    self.Service.useRight = self.lessee.name


def operation2():
    self.Service.useRight = self.lessor.name


def operation3():
    self.ContractState = "finish"


def operation4():
    self.ContractState = "terminate"


@internal
def condition1() -> bool:
    if self.isDone("rule3"):
        return True
    else:
        return False


@external
def rule1(_checkResult: bool):
    self.onlycaAccount()
    self.onlyState(self.ContractState)
    assert not self.isDone("rule1"), "rule1 already done"
    self.checkResult = _checkResult
    if not self.isTime(self.startTime):
        self.changeRule("rule1")


@external
def rule2():
    self.onlylessee()
    self.onlyState(self.ContractState)
    assert not self.isDone("rule2"), "rule2 already done"
    if not self.isTime(self.startTime) and self.checkResult:
        self.transferTo(self.lessor.account, 10**14 * (self.rent + self.deposit))
        self.changeRule("rule2")


@external
def rule3():
    self.onlylessor()
    self.onlyState(self.ContractState)
    assert not self.isDone("rule3"), "rule3 already done"
    if self.isDone("rule2") and not self.isTime(self.startTime):
        self.operation1()
        self.changeRule("rule3")


@external
def rule4(_late_days: uint256):
    self.onlylessor()
    self.onlyState(self.ContractState)
    assert not self.isDone("rule4"), "rule4 already done"
    self.late_days = _late_days
    if not self.isTime(self.startTime + self.max_late) and not self.isDone("rule3"):
        self.transferTo(self.lessee.account, 10**14 * (self.rent * 5 * self.breakIR // 1000))
        self.operation1()
        self.changeRule("rule4")


@external
def rule5():
    self.onlylessor()
    self.onlyState(self.ContractState)
    assert not self.isDone("rule5"), "rule5 already done"
    if self.isTime(self.startTime + self.max_late) and not self.isDone("rule3") and not self.isDone("rule4"):
        self.transferTo(self.lessee.account, 10**14 * (self.rent * 5 * self.breakIR // 1000 + self.rent + self.deposit))
        self.operation4()
        self.changeRule("rule5")


@external
def rule6():
    self.onlylessee()
    self.onlyState(self.ContractState)
    if self.condition1() and self.isTime(self.payTime + self.period) and not self.isTime(self.payTime + self.period + 86400) and not self.isTime(self.finishTime):
        self.transferTo(self.lessor.account, 10**14 * (self.rent))
        self.payTime = self.payTime + self.period
        self.functionStatus["rule8"] = True
        self.changeRule("rule6")


@external
def rule7(_late_days: uint256):
    self.onlylessee()
    self.onlyState(self.ContractState)
    self.late_days = _late_days
    if self.isTime(self.payTime + self.period + 86400) and not self.isTime(self.payTime + self.period + 432000):
        self.transferTo(self.lessor.account, 10**14 * (self.rent * self.late_days * self.breakIR // 1000))
        self.payTime = self.payTime + self.period
        self.functionStatus["rule8"] = True
        self.changeRule("rule7")


@external
def rule8(_late_days: uint256):
    self.onlylessor()
    self.onlyState(self.ContractState)
    assert not self.isDone("rule8"), "rule8 already done"
    self.late_days = _late_days
    if self.isTime(self.payTime + self.period + 432000):
        self.operation2()
        self.operation4()
        self.changeRule("rule8")


@external
def rule9(_continueDays: uint256):
    self.onlylessee()
    self.onlyState(self.ContractState)
    self.continueDays = _continueDays
    if not self.isTime(self.finishTime):
        self.transferTo(self.lessor.account, 10**14 * (self.rent * self.continueDays))
        self.changeRule("rule9")


@external
def rule10(_iscontinue: bool):
    self.onlylessor()
    self.onlyState(self.ContractState)
    self.iscontinue = _iscontinue
    if self.isDone("rule9"):
        if self.iscontinue:
            self.finishTime = self.finishTime + self.continueDays * 60 * 60 * 24
        if not self.iscontinue:
            self.transferTo(self.lessee.account, 10**14 * (self.rent * self.continueDays))
        self.changeRule("rule10")


@external
def rule11():
    self.onlylessor()
    self.onlyState(self.ContractState)
    assert not self.isDone("rule11"), "rule11 already done"
    if self.isTime(self.finishTime):
        self.operation2()
        self.transferTo(self.lessee.account, 10**14 * (self.deposit))
        self.operation3()
        self.changeRule("rule11")


@external
def rule12():
    self.onlyraAccount()
    self.ContractState = "pause"
    self.changeRule("rule12")


@external
def rule13():
    self.onlyraAccount()
    self.ContractState = "restart"
    self.changeRule("rule13")


@external
def rule14():
    self.onlylessee()
    self.onlyState(self.ContractState)
    assert not self.isDone("rule14"), "rule14 already done"
    self.changeRule("rule14")


@external
def rule15():
    self.onlylessor()
    self.onlyState(self.ContractState)
    assert not self.isDone("rule15"), "rule15 already done"
    self.changeRule("rule15")


@external
def rule16(_faultyParty: String[256], _compensation: uint256):
    self.onlyaaAccount()
    self.onlyState(self.ContractState)
    assert not self.isDone("rule16"), "rule16 already done"
    self.faultyParty = _faultyParty
    self.compensation = _compensation
    if self.isDone("rule14") or self.isDone("rule15"):
        self.changeRule("rule16")


@external
def rule17_1():
    self.onlylessor()
    self.onlyState(self.ContractState)
    assert not self.isDone("rule17_1"), "rule17_1 already done"
    if self.logic_str(self.faultyParty, self.lessor.name, "=="):
        self.transferTo(self.lessee.account, 10**14 * (self.compensation))
        self.operation4()
        self.changeRule("rule17_1")


@external
def rule17_2():
    self.onlylessee()
    self.onlyState(self.ContractState)
    assert not self.isDone("rule17_2"), "rule17_2 already done"
    if self.logic_str(self.faultyParty, self.lessee.name, "=="):
        self.transferTo(self.lessor.account, 10**14 * (self.compensation))
        self.operation4()
        self.changeRule("rule17_2")


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
    assert self.logic_str(State, "start", "==") or self.logic_str(State, "restart", "=="), "Not allowed in this state"


@internal
def changeRule(ruleName: String[32]):
    self.functionStatus[ruleName] = True
    self.functionFinishTime[ruleName] = block.timestamp
    log completedRule(msg.sender, ruleName)