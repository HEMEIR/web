package main

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type CarRent struct {
	contractapi.Contract
	functionStatus     map[string]bool
	functionFinishTime map[string]int64
	contractState      string
	contractMessage    *ContractMessage
}
type Person struct {
	MSPID string `json:"MSPID"`
	Name  string `json:"name"`
}
type Ca struct {
	MSPID string `json:"MSPID"`
	Name  string `json:"name"`
	Key   int    `json:"key"`
	Year  int    `json:"year"`
}

type token struct {
	Name       string  `json:"name"`
	Number     float64 `json:"number"`
	Unit_price float64 `json:"unit_price"`
	Price      float64 `json:"price"`
}

type ContractMessage struct {
	Status      string  `json:"status"`
	Default11   float64 `json:"default11"`
	Default12   float64 `json:"default12"`
	Default2    float64 `json:"default2"`
	DayNum      float64 `json:"dayNum"`
	FaultName   string  `json:"faultName"`
	Amount      float64 `json:"amount"`
	SignTime    int64   `json:"signTime"`
	SignPlaca   string  `json:"signPlaca"`
	StartTime   int64   `json:"startTime"`
	FinishTime  int64   `json:"finishTime"`
	CheckResult bool    `json:"checkResult"`
}

func (s *CarRent) Init(ctx contractapi.TransactionContextInterface) error {
	Buyer := Person{Name: "ShanXi Provincial Department of Housing and Urban-Rural Development Agency Supplier", MSPID: 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4}
	BuyerJSON, _ := json.Marshal(Buyer)
	if err := ctx.GetStub().PutState("Buyer", BuyerJSON); err != nil {
		return fmt.Errorf("failed to put Buyer to world state. %v", err)
	}

	Seller := Person{Name: "XiAn YingBin Auto Car Service", MSPID: 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4}
	SellerJSON, _ := json.Marshal(Seller)
	if err := ctx.GetStub().PutState("Seller", SellerJSON); err != nil {
		return fmt.Errorf("failed to put Seller to world state. %v", err)
	}

	Arbitration := Ca{Name: "arbitration institution", MSPID: 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4}
	ArbitrationJSON, _ := json.Marshal(Arbitration)
	if err := ctx.GetStub().PutState("Arbitration", ArbitrationJSON); err != nil {
		return fmt.Errorf("failed to put Arbitration to world state. %v", err)
	}

	Service := token{Name: "vehicle rental service", Number: 3, Unit_price: 11600, Price: 34800}
	ServiceJSON, _ := json.Marshal(Service)
	if err := ctx.GetStub().PutState("Service", ServiceJSON); err != nil {
		return fmt.Errorf("failed to put Service to world state. %v", err)
	}

	// 初始化链码状态
	s.functionStatus = make(map[string]bool)
	s.functionFinishTime = make(map[string]int64)
	s.contractState = "start"
	s.contractMessage = &ContractMessage{
		Status:      "start",
		Default11:   20.0,
		Default12:   50.0,
		Default2:    50.0,
		DayNum:      0,
		FaultName:   "",
		Amount:      0,
		SignTime:    1667952000,
		SignPlaca:   "XiAn",
		StartTime:   1688947200,
		FinishTime:  1690761600,
		CheckResult: false,
	}
	// 存储 ContractMessage 到世界状态
	contractMessageJSON, _ := json.Marshal(s.contractMessage)
	if err := ctx.GetStub().PutState("ContractMessage", contractMessageJSON); err != nil {
		return fmt.Errorf("failed to put ContractMessage to world state: %v", err)
	}

	// 初始化状态和完成时间
	if err := ctx.GetStub().PutState("ContractState", []byte("start")); err != nil {
		return fmt.Errorf("failed to initialize contract state: %v", err)
	}
	return nil

}
func (s *CarRent) EmitTransferEvent(ctx contractapi.TransactionContextInterface, from string, to string, amount int) error {
	// 事件数据
	eventPayload := fmt.Sprintf(`{"from":"%s","to":"%s","amount":%d}`, from, to, amount)

	// 触发事件
	err := ctx.GetStub().SetEvent("Transfer", []byte(eventPayload))
	if err != nil {
		return fmt.Errorf("Failed to emit Transfer event: %v", err)
	}
	return nil
}

// Function: operation1
func (s *CarRent) operation1(ctx contractapi.TransactionContextInterface, from string, to string, amount int) error {
	// Update contract state
	if err := ctx.GetStub().PutState("ContractState", []byte("finish")); err != nil {
		return fmt.Errorf("failed to update contract state to finish: %v", err)
	}

	// 触发事件
	err := s.EmitTransferEvent(ctx, from, to, amount)
	if err != nil {
		return err
	}

	return nil
}

// Function: operation2
func (s *CarRent) operation2(ctx contractapi.TransactionContextInterface) error {
	// Update contract state
	if err := ctx.GetStub().PutState("ContractState", []byte("terminate")); err != nil {
		return fmt.Errorf("failed to update contract state to terminate: %v", err)
	}
	return nil
}
func (s *CarRent) condition1(ctx contractapi.TransactionContextInterface) bool {
	if !isTime(s.functionFinishTime["rule1"] + 60*60*24*10) {
		return true
	}
	return false
}
func (s *CarRent) condition2(ctx contractapi.TransactionContextInterface) bool {
	if !isTime(s.functionFinishTime["rule2"] + 60*60*24*7) {
		return true
	}
	return false
}
func (s *CarRent) condition3(ctx contractapi.TransactionContextInterface) bool {
	if isDone(ctx, "rule2", s) && s.contractMessage.CheckResult {
		return true
	}
	return false
}
func (s *CarRent) condition4(ctx contractapi.TransactionContextInterface) bool {
	if s.condition3(ctx) && s.condition1(ctx) || s.condition1(ctx) {
		return true
	}
	return false
}
func (s *CarRent) condition5(ctx contractapi.TransactionContextInterface) bool {
	tokenBytes, err := ctx.GetStub().GetState("Service")
	if err != nil {
		return false // 出现错误时返回 false
	}
	if tokenBytes == nil {
		return false // 如果找不到 token 数据，返回 false
	}

	// 将获取到的 token 数据反序列化为 token 结构体
	var token token
	if err := json.Unmarshal(tokenBytes, &token); err != nil {
		return false // 反序列化失败时返回 false
	}
	if logic(token.Price*s.contractMessage.DayNum*s.contractMessage.Default11, token.Price*s.contractMessage.Default12, ">") {
		return true
	}
	return false
}
func (s *CarRent) rule1(ctx contractapi.TransactionContextInterface) {
	if onlyState(s.contractState) && !s.functionStatus["rule1"] {
		if isTime(int64(s.contractMessage.StartTime)) && !isTime(s.contractMessage.FinishTime) {
			changeRule("rule1", s)
		}
	}
}
func (s *CarRent) rule2(_checkResult bool, ctx contractapi.TransactionContextInterface) {
	if onlyState(s.contractState) && !s.functionStatus["rule2"] {
		s.contractMessage.CheckResult = _checkResult
		if isDone(ctx, "rule1", s) {
			changeRule("rule2", s)
		}
	}
}
func (s *CarRent) rule3(ctx contractapi.TransactionContextInterface) {
	if onlyState(s.contractState) && !s.functionStatus["rule3"] {
		if s.condition4(ctx) || isDone(ctx, "rule7", s) {
			SellerBytes, _ := ctx.GetStub().GetState("Seller")
			// 将获取到的 token 数据反序列化为 token 结构体
			var Seller Person
			json.Unmarshal(SellerBytes, &Seller)
			ServiceBytes, _ := ctx.GetStub().GetState("Service")
			// 将获取到的 token 数据反序列化为 token 结构体
			var Service token
			json.Unmarshal(ServiceBytes, &Service)
			transferTo(ctx, Seller, float64(Service.Price))
			s.operation1(ctx)
			changeRule("rule3", s)
		}
	}
}
func (s *CarRent) rule4(ctx contractapi.TransactionContextInterface) {
	if onlyState(s.contractState) && !s.functionStatus["rule4"] {
		if isDone(ctx, "rule2", s) && !s.contractMessage.CheckResult && s.condition2(ctx) {
			changeRule("rule4", s)
		}
	}
}
func (s *CarRent) rule5(ctx contractapi.TransactionContextInterface) {
	if onlyState(s.contractState) && !s.functionStatus["rule5"] {
		if isDone(ctx, "rule4", s) && !isTime(s.functionFinishTime["rule4"]+60*60*24*3) {
			s.functionStatus["rule1"] = false
			s.functionStatus["rule3"] = false
			changeRule("rule5", s)
		}
	}
}
func (s *CarRent) rule6(_dayNum float64, ctx contractapi.TransactionContextInterface) {
	if onlyState(s.contractState) && !s.functionStatus["rule6"] {
		s.contractMessage.DayNum = _dayNum
		if isTime(int64(s.contractMessage.FinishTime)) && !isDone(ctx, "rule1", s) {
			if s.condition5(ctx) {
				ServiceBytes, _ := ctx.GetStub().GetState("Service")
				// 将获取到的 token 数据反序列化为 token 结构体
				var Service token
				json.Unmarshal(ServiceBytes, &Service)
				Service.Price = Service.Price - Service.Price*s.contractMessage.DayNum*s.contractMessage.Default12
			}
			if !s.condition5(ctx) {
				ServiceBytes, _ := ctx.GetStub().GetState("Service")
				// 将获取到的 token 数据反序列化为 token 结构体
				var Service token
				json.Unmarshal(ServiceBytes, &Service)
				Service.Price = Service.Price - Service.Price*s.contractMessage.DayNum*s.contractMessage.Default11
			}
			changeRule("rule6", s)
		}
	}
}
func (s *CarRent) rule7(_dayNum float64, ctx contractapi.TransactionContextInterface) {
	if onlyState(s.contractState) && !s.functionStatus["rule7"] {
		s.contractMessage.DayNum = _dayNum
		if s.condition3(ctx) && !s.condition1(ctx) && !isDone(ctx, "rule3", s) {
			if s.condition5(ctx) {
				ServiceBytes, _ := ctx.GetStub().GetState("Service")
				// 将获取到的 token 数据反序列化为 token 结构体
				var Service token
				json.Unmarshal(ServiceBytes, &Service)
				Service.Price = Service.Price + Service.Price*s.contractMessage.DayNum*s.contractMessage.Default12
			}
			if !s.condition5(ctx) {
				ServiceBytes, _ := ctx.GetStub().GetState("Service")
				// 将获取到的 token 数据反序列化为 token 结构体
				var Service token
				json.Unmarshal(ServiceBytes, &Service)
				Service.Price = Service.Price + Service.Price*s.contractMessage.DayNum*s.contractMessage.Default11
			}
			changeRule("rule7", s)
		}
	}
}
func (s *CarRent) rule8(ctx contractapi.TransactionContextInterface) {
	if onlyState(s.contractState) && !s.functionStatus["rule8"] {
		BuyerBytes, _ := ctx.GetStub().GetState("Buyer")
		// 将获取到的 token 数据反序列化为 token 结构体
		var Buyer Person
		json.Unmarshal(BuyerBytes, &Buyer)
		ServiceBytes, _ := ctx.GetStub().GetState("Service")
		// 将获取到的 token 数据反序列化为 token 结构体
		var Service token
		json.Unmarshal(ServiceBytes, &Service)
		transferTo(ctx, Buyer, float64(s.contractMessage.Default2)*float64(Service.Price))
		s.operation2(ctx)
		changeRule("rule8", s)
	}
}
func (s *CarRent) rule9(ctx contractapi.TransactionContextInterface) {
	if onlyState(s.contractState) && !s.functionStatus["rule9"] {
		if isDone(ctx, "rule10", s) {
			SellerBytes, _ := ctx.GetStub().GetState("Seller")
			// 将获取到的 token 数据反序列化为 token 结构体
			var Seller Person
			json.Unmarshal(SellerBytes, &Seller)
			ServiceBytes, _ := ctx.GetStub().GetState("Service")
			// 将获取到的 token 数据反序列化为 token 结构体
			var Service token
			json.Unmarshal(ServiceBytes, &Service)
			transferTo(ctx, Seller, float64(s.contractMessage.Default2)*float64(Service.Price))
			s.operation2(ctx)
			changeRule("rule9", s)
		}
	}
}
func (s *CarRent) rule10(_faultName string, _amount float64, ctx contractapi.TransactionContextInterface) {
	if !s.functionStatus["rule10"] {
		s.contractMessage.FaultName = _faultName
		s.contractMessage.Amount = _amount
		changeRule("rule10", s)
	}
}
func (s *CarRent) rule11(ctx contractapi.TransactionContextInterface) {
	if !s.functionStatus["rule11"] {
		BuyerBytes, _ := ctx.GetStub().GetState("Buyer")
		var Buyer Person
		json.Unmarshal(BuyerBytes, &Buyer)
		if isDone(ctx, "rule10", s) && logic(s.contractMessage.FaultName, Buyer.Name, "==") {
			SellerBytes, _ := ctx.GetStub().GetState("Seller")
			// 将获取到的 token 数据反序列化为 token 结构体
			var Seller Person
			json.Unmarshal(SellerBytes, &Seller)
			transferTo(ctx, Seller, float64(s.contractMessage.Amount))
			s.operation1(ctx)
			changeRule("rule11", s)
		}
	}
}
func (s *CarRent) rule12(ctx contractapi.TransactionContextInterface) {
	if !s.functionStatus["rule12"] {
		SellerBytes, _ := ctx.GetStub().GetState("Seller")
		var Seller Person
		json.Unmarshal(SellerBytes, &Seller)
		if isDone(ctx, "rule10", s) && logic(s.contractMessage.FaultName, Seller.Name, "==") {
			BuyerBytes, _ := ctx.GetStub().GetState("Buyer")
			// 将获取到的 token 数据反序列化为 token 结构体
			var Buyer Person
			json.Unmarshal(BuyerBytes, &Buyer)
			transferTo(ctx, Buyer, float64(s.contractMessage.Amount))
			s.operation1(ctx)
			changeRule("rule12", s)
		}
	}
}

// 检查某个功能是否已经执行
func isDone(ctx contractapi.TransactionContextInterface, functionName string, s *CarRent) bool {
	return s.functionStatus[functionName]
}

// 用于判断是否达到指定时间的函数
func isTime(targetTime int64) bool {
	return int64(time.Now().Unix()) >= targetTime
}

// transferTo 用于给指定地址转账并执行模拟支付流程
func transferTo(ctx contractapi.TransactionContextInterface, recipient Person, amount float64) error {
	recipientMSPID := recipient.MSPID
	if recipientMSPID == "" {
		return fmt.Errorf("Invalid recipient address")
	}
	if amount <= 0 {
		return fmt.Errorf("Amount must be greater than zero")
	}

	// 获取调用者的余额
	clientMSPID, err := ctx.GetClientIdentity().GetMSPID()
	if err != nil {
		return fmt.Errorf("failed to get client MSPID: %v", err)
	}
	callerKey := fmt.Sprintf("account_%s", clientMSPID)
	callerBalanceBytes, err := ctx.GetStub().GetState(callerKey)
	if err != nil {
		return fmt.Errorf("failed to get caller balance: %v", err)
	}
	if callerBalanceBytes == nil {
		return fmt.Errorf("caller account does not exist")
	}

	// 获取接收方余额
	recipientKey := fmt.Sprintf("account_%s", recipientMSPID)
	recipientBalanceBytes, err := ctx.GetStub().GetState(recipientKey)
	if err != nil {
		return fmt.Errorf("failed to get recipient balance: %v", err)
	}
	if recipientBalanceBytes == nil {
		return fmt.Errorf("recipient account does not exist")
	}
	var callerBalance float64
	if err := json.Unmarshal(callerBalanceBytes, &callerBalance); err != nil {
		return fmt.Errorf("failed to unmarshal caller balance: %v", err)
	}

	// 确保调用方有足够的余额支付
	var recipientBalance float64
	if err := json.Unmarshal(recipientBalanceBytes, &recipientBalance); err != nil {
		return fmt.Errorf("failed to unmarshal recipient balance: %v", err)
	}

	if callerBalance < amount {
		return fmt.Errorf("insufficient balance in caller account")
	}

	// 扣除调用方的金额
	callerBalance -= amount

	// 增加接收方的金额
	recipientBalance += amount

	// 更新调用方余额
	updatedCallerBalanceBytes, err := json.Marshal(callerBalance)
	if err != nil {
		return fmt.Errorf("failed to marshal updated caller balance: %v", err)
	}
	if err := ctx.GetStub().PutState(callerKey, updatedCallerBalanceBytes); err != nil {
		return fmt.Errorf("failed to update caller balance: %v", err)
	}

	// 更新接收方的余额
	updatedRecipientBalanceBytes, err := json.Marshal(recipientBalance)
	if err != nil {
		return fmt.Errorf("failed to marshal updated recipient balance: %v", err)
	}
	if err := ctx.GetStub().PutState(recipientKey, updatedRecipientBalanceBytes); err != nil {
		return fmt.Errorf("failed to update recipient balance: %v", err)
	}

	return nil
}

// 辅助函数，根据比较符号执行比较
func logic(a, b interface{}, op string) bool {
	switch a := a.(type) {
	case int:
		b, ok := b.(int)
		if !ok {
			return false
		}
		return compare(float64(a), float64(b), op)
	case float64:
		b, ok := b.(float64)
		if !ok {
			return false
		}
		return compare(a, b, op)
	case string:
		b, ok := b.(string)
		if !ok {
			return false
		}
		return compareString(a, b, op)
	default:
		return false
	}
}

func compare(a, b float64, op string) bool {
	switch op {
	case "<":
		return a < b
	case "<=":
		return a <= b
	case "==":
		return a == b
	case "!=":
		return a != b
	case ">":
		return a > b
	case ">=":
		return a >= b
	default:
		return false
	}
}

func compareString(a, b string, op string) bool {
	switch op {
	case "<":
		return a < b
	case "<=":
		return a <= b
	case "==":
		return a == b
	case "!=":
		return a != b
	case ">":
		return a > b
	case ">=":
		return a >= b
	default:
		return false
	}
}
func compareStrings(str1, str2 string) bool {
	return str1 == str2
}

// changeRule 方法用于更新 functionStatus 和 functionFinishTime 的值
func changeRule(expressionName string, s *CarRent) {
	// 更新 functionStatus
	s.functionStatus[expressionName] = true
	// 更新 functionFinishTime
	s.functionFinishTime[expressionName] = int64(time.Now().Unix())
}

func onlyState(State string) bool {
	if compareStrings(State, "start") || compareStrings(State, "restart") {
		return true
	}
	return false
}

func onlySomeone(ctx contractapi.TransactionContextInterface, expectedPerson Person) error {
	// 获取调用者的 MSP ID
	callerMSPID, err := ctx.GetClientIdentity().GetMSPID()
	if err != nil {
		return fmt.Errorf("failed to get caller MSP ID: %v", err)
	}

	// 验证调用者是否符合预期的 MSP ID
	if callerMSPID != expectedPerson.MSPID {
		return fmt.Errorf("caller does not have the required permissions: expected MSPID %s, got %s", expectedPerson.MSPID, callerMSPID)
	}

	// 验证通过
	return nil
}

func main() {
	// 初始化Contract结构体的map变量
	contract := new(CarRent)

	// 启动Fabric链码服务
	cc, err := contractapi.NewChaincode(contract)
	if err != nil {
		fmt.Printf("Error starting SimpleContract chaincode: %v\n", err)
		return
	}

	if err := cc.Start(); err != nil {
		fmt.Printf("Error starting SimpleContract chaincode: %v\n", err)
	}

}
