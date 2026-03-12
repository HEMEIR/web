package main

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type FertilizerPurchase struct {
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
	Name        string  `json:"name"`
	Number      int64   `json:"number"`
	Unit_price  float64 `json:"unit_price"`
	Unit_weight int64   `json:"unit_weight"`
	Price       float64 `json:"price"`
	Other       string  `json:"other"`
}

type ContractMessage struct {
	Status      string  `json:"status"`
	Place       string  `json:"place"`
	GiveTime    int64   `json:"giveTime"`
	FaultName   string  `json:"faultName"`
	Amount      float64 `json:"amount"`
	CheckResult bool    `json:"checkResult"`
	Period      int64   `json:"period"`
	DayNum      float64 `json:"dayNum"`
	Proportion  float64 `json:"Proportion"`
}

func (s *FertilizerPurchase) Init(ctx contractapi.TransactionContextInterface) error {
	Buyer := Person{Name: "JingMen City DongBao District Agriculture and Rural Affairs Bureau", MSPID: 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4}
	BuyerJSON, _ := json.Marshal(Buyer)
	if err := ctx.GetStub().PutState("Buyer", BuyerJSON); err != nil {
		return fmt.Errorf("failed to put Buyer to world state. %v", err)
	}

	Seller := Person{Name: "HuBei NanGuo Chemical Co., Ltd.", MSPID: 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4}
	SellerJSON, _ := json.Marshal(Seller)
	if err := ctx.GetStub().PutState("Seller", SellerJSON); err != nil {
		return fmt.Errorf("failed to put Seller to world state. %v", err)
	}

	Arbitration := Ca{Name: "arbitration institution", MSPID: 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4}
	ArbitrationJSON, _ := json.Marshal(Arbitration)
	if err := ctx.GetStub().PutState("Arbitration", ArbitrationJSON); err != nil {
		return fmt.Errorf("failed to put Arbitration to world state. %v", err)
	}

	Service := token{Name: "fertilizer", Number: 6000, Unit_price: 91250.0, Unit_weight: 25, Price: 547500, Other: "=30-0-15"}
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
		Place:       "",
		GiveTime:    0,
		FaultName:   "",
		Amount:      0,
		CheckResult: false,
		Period:      432000,
		DayNum:      0,
		Proportion:  5.0,
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

// Function: end
func (s *FertilizerPurchase) end(ctx contractapi.TransactionContextInterface) error {
	// Update contract state
	if err := ctx.GetStub().PutState("ContractState", []byte("finish")); err != nil {
		return fmt.Errorf("failed to update contract state to finish: %v", err)
	}
	return nil
}

// Function: end2
func (s *FertilizerPurchase) end2(ctx contractapi.TransactionContextInterface) error {
	// Update contract state
	if err := ctx.GetStub().PutState("ContractState", []byte("terminate")); err != nil {
		return fmt.Errorf("failed to update contract state to terminate: %v", err)
	}
	return nil
}
func (s *FertilizerPurchase) rule1(_place string, _giveTime int64, ctx contractapi.TransactionContextInterface) {
	if onlyState(s.contractState) && !s.functionStatus["rule1"] {
		s.contractMessage.Place = _place
		s.contractMessage.GiveTime = _giveTime
		changeRule("rule1", s)
	}
}
func (s *FertilizerPurchase) rule2(ctx contractapi.TransactionContextInterface) {
	if onlyState(s.contractState) && !s.functionStatus["rule2"] {
		if isDone(ctx, "rule1", s) && logic(time.Now().Unix(), s.contractMessage.GiveTime, "==") {
			changeRule("rule2", s)
		}
	}
}
func (s *FertilizerPurchase) rule2_2(_dayNum float64, ctx contractapi.TransactionContextInterface) {
	if onlyState(s.contractState) && !s.functionStatus["rule2_2"] {
		s.contractMessage.DayNum = _dayNum
		if isTime(int64(s.contractMessage.GiveTime)) && !isTime(int64(s.contractMessage.GiveTime)+int64(s.contractMessage.Period)) && !isDone(ctx, "rule2", s) {
			BuyerBytes, _ := ctx.GetStub().GetState("Buyer")
			// 将获取到的 token 数据反序列化为 token 结构体
			var Buyer Person
			json.Unmarshal(BuyerBytes, &Buyer)
			ServiceBytes, _ := ctx.GetStub().GetState("Service")
			// 将获取到的 token 数据反序列化为 token 结构体
			var Service token
			json.Unmarshal(ServiceBytes, &Service)
			transferTo(ctx, Buyer, float64(s.contractMessage.DayNum)*float64(s.contractMessage.Proportion)*float64(Service.Price))
			changeRule("rule2_2", s)
		}
	}
}
func (s *FertilizerPurchase) rule2_3(ctx contractapi.TransactionContextInterface) {
	if onlyState(s.contractState) && !s.functionStatus["rule2_3"] {
		if isTime(int64(s.contractMessage.GiveTime)+int64(s.contractMessage.Period)) && !isDone(ctx, "rule2", s) && !isDone(ctx, "rule2_2", s) {
			s.contractState = "terminate"
			changeRule("rule2_3", s)
		}
	}
}
func (s *FertilizerPurchase) rule3(_checkResult bool, ctx contractapi.TransactionContextInterface) {
	if onlyState(s.contractState) && !s.functionStatus["rule3"] {
		s.contractMessage.CheckResult = _checkResult
		if isDone(ctx, "rule2", s) && !isTime(s.functionFinishTime["rule2"]+60*60*24*15) {
			if !s.contractMessage.CheckResult {
				s.contractState = "terminate"
			}
			changeRule("rule3", s)
		}
	}
}
func (s *FertilizerPurchase) rule4(ctx contractapi.TransactionContextInterface) {
	if onlyState(s.contractState) && !s.functionStatus["rule4"] {
		if isDone(ctx, "rule3", s) {
			changeRule("rule4", s)
		}
	}
}
func (s *FertilizerPurchase) rule5(ctx contractapi.TransactionContextInterface) {
	if onlyState(s.contractState) && !s.functionStatus["rule5"] {
		if isDone(ctx, "rule4", s) {
			SellerBytes, _ := ctx.GetStub().GetState("Seller")
			// 将获取到的 token 数据反序列化为 token 结构体
			var Seller Person
			json.Unmarshal(SellerBytes, &Seller)
			ServiceBytes, _ := ctx.GetStub().GetState("Service")
			// 将获取到的 token 数据反序列化为 token 结构体
			var Service token
			json.Unmarshal(ServiceBytes, &Service)
			transferTo(ctx, Seller, float64(Service.Price))
			s.end(ctx)
			changeRule("rule5", s)
		}
	}
}
func (s *FertilizerPurchase) rule6(_faultName string, _amount float64, ctx contractapi.TransactionContextInterface) {
	if !s.functionStatus["rule6"] {
		s.contractMessage.FaultName = _faultName
		s.contractMessage.Amount = _amount
		changeRule("rule6", s)
	}
}
func (s *FertilizerPurchase) rule7(ctx contractapi.TransactionContextInterface) {
	if !s.functionStatus["rule7"] {
		BuyerBytes, _ := ctx.GetStub().GetState("Buyer")
		var Buyer Person
		json.Unmarshal(BuyerBytes, &Buyer)
		if isDone(ctx, "rule6", s) && logic(s.contractMessage.FaultName, Buyer.Name, "==") {
			SellerBytes, _ := ctx.GetStub().GetState("Seller")
			// 将获取到的 token 数据反序列化为 token 结构体
			var Seller Person
			json.Unmarshal(SellerBytes, &Seller)
			transferTo(ctx, Seller, float64(s.contractMessage.Amount))
			s.end2(ctx)
			changeRule("rule7", s)
		}
	}
}
func (s *FertilizerPurchase) rule8(ctx contractapi.TransactionContextInterface) {
	if !s.functionStatus["rule8"] {
		SellerBytes, _ := ctx.GetStub().GetState("Seller")
		var Seller Person
		json.Unmarshal(SellerBytes, &Seller)
		if isDone(ctx, "rule6", s) && logic(s.contractMessage.FaultName, Seller.Name, "==") {
			BuyerBytes, _ := ctx.GetStub().GetState("Buyer")
			// 将获取到的 token 数据反序列化为 token 结构体
			var Buyer Person
			json.Unmarshal(BuyerBytes, &Buyer)
			transferTo(ctx, Buyer, float64(s.contractMessage.Amount))
			s.end2(ctx)
			changeRule("rule8", s)
		}
	}
}

// 检查某个功能是否已经执行
func isDone(ctx contractapi.TransactionContextInterface, functionName string, s *FertilizerPurchase) bool {
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

// changeRule 方法用于更新 functionStatus 和 functionFinishTime 的值
func changeRule(expressionName string, s *FertilizerPurchase) {
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
	contract := new(FertilizerPurchase)

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
