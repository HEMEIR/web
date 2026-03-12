package main

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type LightRent struct {
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

type token struct {
	Name  string  `json:"name"`
	Price float64 `json:"price"`
}

type ContractMessage struct {
	Status        string  `json:"status"`
	Extend1       float64 `json:"extend1"`
	Extend2       float64 `json:"extend2"`
	Extend3       float64 `json:"extend3"`
	Default       float64 `json:"default"`
	Proportion    float64 `json:"Proportion"`
	DayNum        float64 `json:"dayNum"`
	SignTime      int64   `json:"signTime"`
	Period        int64   `json:"period"`
	SignPlace     string  `json:"signPlace"`
	StartTime     int64   `json:"startTime"`
	FinishTime    int64   `json:"finishTime"`
	CheckStatus   bool    `json:"checkStatus"`
	DeviceAmount  float64 `json:"deviceAmount"`
	DefaultAmount float64 `json:"defaultAmount"`
}

func (s *LightRent) Init(ctx contractapi.TransactionContextInterface) error {
	Buyer := Person{Name: "LuoTian County HuangMei Drama Group", MSPID: 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4}
	BuyerJSON, _ := json.Marshal(Buyer)
	if err := ctx.GetStub().PutState("Buyer", BuyerJSON); err != nil {
		return fmt.Errorf("failed to put Buyer to world state. %v", err)
	}

	Seller := Person{Name: "GuangYing Electronic Products Sales Department, BaoHe District, HeTei City", MSPID: 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4}
	SellerJSON, _ := json.Marshal(Seller)
	if err := ctx.GetStub().PutState("Seller", SellerJSON); err != nil {
		return fmt.Errorf("failed to put Seller to world state. %v", err)
	}

	Service := token{Name: "Performance services", Price: 64807}
	ServiceJSON, _ := json.Marshal(Service)
	if err := ctx.GetStub().PutState("Service", ServiceJSON); err != nil {
		return fmt.Errorf("failed to put Service to world state. %v", err)
	}

	// 初始化链码状态
	s.functionStatus = make(map[string]bool)
	s.functionFinishTime = make(map[string]int64)
	s.contractState = "start"
	s.contractMessage = &ContractMessage{
		Status:        "start",
		Extend1:       10000,
		Extend2:       20000,
		Extend3:       30000,
		Default:       7710,
		Proportion:    400.0,
		DayNum:        0,
		SignTime:      1639526400,
		Period:        172800,
		SignPlace:     "HuangGang City, HuBei Province, HeFei",
		StartTime:     1639958400,
		FinishTime:    1640131200,
		CheckStatus:   false,
		DeviceAmount:  0,
		DefaultAmount: 10000,
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

func (s *LightRent) rule1(ctx contractapi.TransactionContextInterface) {
	if onlyState(s.contractState) && !s.functionStatus["rule1"] {
		if !isTime(int64(s.contractMessage.SignTime) + int64(s.contractMessage.Period)) {
			SellerBytes, _ := ctx.GetStub().GetState("Seller")
			// 将获取到的 token 数据反序列化为 token 结构体
			var Seller Person
			json.Unmarshal(SellerBytes, &Seller)
			ServiceBytes, _ := ctx.GetStub().GetState("Service")
			// 将获取到的 token 数据反序列化为 token 结构体
			var Service token
			json.Unmarshal(ServiceBytes, &Service)
			transferTo(ctx, Seller, float64(s.contractMessage.Proportion)*float64(Service.Price))
			changeRule("rule1", s)
		}
	}
}
func (s *LightRent) rule2(ctx contractapi.TransactionContextInterface) {
	if onlyState(s.contractState) && !s.functionStatus["rule2"] {
		if isTime(int64(s.contractMessage.SignTime)+int64(s.contractMessage.Period)) && !isDone(ctx, "rule1", s) {
			s.contractState = "terminate"
			changeRule("rule2", s)
		}
	}
}
func (s *LightRent) rule3(ctx contractapi.TransactionContextInterface) {
	if onlyState(s.contractState) && !s.functionStatus["rule3"] {
		if isDone(ctx, "rule1", s) && logic(time.Now().Unix(), s.contractMessage.StartTime, "==") {
			SellerBytes, _ := ctx.GetStub().GetState("Seller")
			// 将获取到的 token 数据反序列化为 token 结构体
			var Seller Person
			json.Unmarshal(SellerBytes, &Seller)
			ServiceBytes, _ := ctx.GetStub().GetState("Service")
			// 将获取到的 token 数据反序列化为 token 结构体
			var Service token
			json.Unmarshal(ServiceBytes, &Service)
			transferTo(ctx, Seller, float64(Service.Price)-float64(s.contractMessage.Proportion)*float64(Service.Price))
			changeRule("rule3", s)
		}
	}
}
func (s *LightRent) rule4(ctx contractapi.TransactionContextInterface) {
	if onlyState(s.contractState) && !s.functionStatus["rule4"] {
		if isDone(ctx, "rule3", s) {
			changeRule("rule4", s)
		}
	}
}
func (s *LightRent) rule5(ctx contractapi.TransactionContextInterface) {
	if onlyState(s.contractState) && !s.functionStatus["rule5"] {
		if isDone(ctx, "rule4", s) {
			changeRule("rule5", s)
		}
	}
}
func (s *LightRent) rule6(_lateDay float64, ctx contractapi.TransactionContextInterface) {
	if onlyState(s.contractState) && !s.functionStatus["rule6"] {
		lateDay := _lateDay
		if !isDone(ctx, "rule5", s) && isTime(int64(s.contractMessage.StartTime)) {
			BuyerBytes, _ := ctx.GetStub().GetState("Buyer")
			// 将获取到的 token 数据反序列化为 token 结构体
			var Buyer Person
			json.Unmarshal(BuyerBytes, &Buyer)
			transferTo(ctx, Buyer, float64(lateDay)*float64(s.contractMessage.Default))
			changeRule("rule6", s)
		}
	}
}
func (s *LightRent) rule7(_dayNum float64, ctx contractapi.TransactionContextInterface) {
	if onlyState(s.contractState) && !s.functionStatus["rule7"] {
		s.contractMessage.DayNum = _dayNum
		if isDone(ctx, "rule5", s) {
			if logic(s.contractMessage.DayNum, 1, "==") {
				SellerBytes, _ := ctx.GetStub().GetState("Seller")
				// 将获取到的 token 数据反序列化为 token 结构体
				var Seller Person
				json.Unmarshal(SellerBytes, &Seller)
				transferTo(ctx, Seller, float64(s.contractMessage.Extend1))
			}
			if logic(s.contractMessage.DayNum, 1, "!=") {
				SellerBytes, _ := ctx.GetStub().GetState("Seller")
				// 将获取到的 token 数据反序列化为 token 结构体
				var Seller Person
				json.Unmarshal(SellerBytes, &Seller)
				transferTo(ctx, Seller, float64(s.contractMessage.Extend1)+float64(s.contractMessage.Extend2)*float64(s.contractMessage.DayNum)-float64(s.contractMessage.Extend3))
			}
			changeRule("rule7", s)
		}
	}
}
func (s *LightRent) rule8(_checkStatus bool, _deviceAmount float64, ctx contractapi.TransactionContextInterface) {
	if onlyState(s.contractState) && !s.functionStatus["rule8"] {
		s.contractMessage.CheckStatus = _checkStatus
		s.contractMessage.DeviceAmount = _deviceAmount
		if isTime(int64(s.contractMessage.FinishTime) + int64(s.contractMessage.DayNum)) {
			changeRule("rule8", s)
		}
	}
}
func (s *LightRent) rule9(ctx contractapi.TransactionContextInterface) {
	if onlyState(s.contractState) && !s.functionStatus["rule9"] {
		if isDone(ctx, "rule8", s) && s.contractMessage.CheckStatus {
			s.contractState = "finish"
			changeRule("rule9", s)
		}
	}
}
func (s *LightRent) rule10(ctx contractapi.TransactionContextInterface) {
	if onlyState(s.contractState) && !s.functionStatus["rule10"] {
		if isDone(ctx, "rule8", s) && !s.contractMessage.CheckStatus {
			SellerBytes, _ := ctx.GetStub().GetState("Seller")
			// 将获取到的 token 数据反序列化为 token 结构体
			var Seller Person
			json.Unmarshal(SellerBytes, &Seller)
			transferTo(ctx, Seller, float64(s.contractMessage.DeviceAmount))
			s.contractState = "finish"
			changeRule("rule10", s)
		}
	}
}
func (s *LightRent) rule11(ctx contractapi.TransactionContextInterface) {
	if onlyState(s.contractState) && !s.functionStatus["rule11"] {
		if !isTime(int64(s.contractMessage.FinishTime) + int64(s.contractMessage.DayNum)) {
			BuyerBytes, _ := ctx.GetStub().GetState("Buyer")
			// 将获取到的 token 数据反序列化为 token 结构体
			var Buyer Person
			json.Unmarshal(BuyerBytes, &Buyer)
			transferTo(ctx, Buyer, float64(s.contractMessage.DefaultAmount))
			s.contractState = "terminate"
			changeRule("rule11", s)
		}
	}
}
func (s *LightRent) rule12(ctx contractapi.TransactionContextInterface) {
	if onlyState(s.contractState) && !s.functionStatus["rule12"] {
		if !isTime(int64(s.contractMessage.FinishTime) + int64(s.contractMessage.DayNum)) {
			SellerBytes, _ := ctx.GetStub().GetState("Seller")
			// 将获取到的 token 数据反序列化为 token 结构体
			var Seller Person
			json.Unmarshal(SellerBytes, &Seller)
			transferTo(ctx, Seller, float64(s.contractMessage.DefaultAmount))
			s.contractState = "terminate"
			changeRule("rule12", s)
		}
	}
}

// 检查某个功能是否已经执行
func isDone(ctx contractapi.TransactionContextInterface, functionName string, s *LightRent) bool {
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

// changeRule 方法用于更新 functionStatus 和 functionFinishTime 的值
func changeRule(expressionName string, s *LightRent) {
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
	contract := new(LightRent)

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
