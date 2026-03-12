package main

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type HouseRent struct {
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

type House struct {
	Location string `json:"location"`
	Usage    string `json:"usage"`
}

type ContractMessage struct {
	Status         string `json:"status"`
	Penalty        int64  `json:"penalty"`
	Management_fee int64  `json:"management_fee"`
	Payduration    int64  `json:"payduration"`
	StartTime      int64  `json:"startTime"`
	FinishTime     int64  `json:"finishTime"`
	PayTime        int64  `json:"payTime"`
	Time1          int64  `json:"time1"`
	Time2          int64  `json:"time2"`
	Continue       bool   `json:"continue"`
	Amount         int64  `json:"amount"`
}

func (s *HouseRent) Init(ctx contractapi.TransactionContextInterface) error {
	Landlord := Person{Name: "Fengshan Town Vegetable Village Joint Stock Economic Cooperative", MSPID: 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4}
	LandlordJSON, _ := json.Marshal(Landlord)
	if err := ctx.GetStub().PutState("Landlord", LandlordJSON); err != nil {
		return fmt.Errorf("failed to put Landlord to world state. %v", err)
	}

	Tenant := Person{Name: "Luotian County Statistics Bureau", MSPID: 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4}
	TenantJSON, _ := json.Marshal(Tenant)
	if err := ctx.GetStub().PutState("Tenant", TenantJSON); err != nil {
		return fmt.Errorf("failed to put Tenant to world state. %v", err)
	}

	house := House{Location: "Lijiawan", Usage: "office"}
	houseJSON, _ := json.Marshal(house)
	if err := ctx.GetStub().PutState("house", houseJSON); err != nil {
		return fmt.Errorf("failed to put house to world state. %v", err)
	}

	// 初始化链码状态
	s.functionStatus = make(map[string]bool)
	s.functionFinishTime = make(map[string]int64)
	s.contractState = "start"
	s.contractMessage = &ContractMessage{
		Status:         "start",
		Penalty:        3000,
		Management_fee: 4000,
		Payduration:    31536000,
		StartTime:      1602806400,
		FinishTime:     1697328000,
		PayTime:        1602806400,
		Time1:          7776000,
		Time2:          1296000,
		Continue:       false,
		Amount:         0,
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

func (s *HouseRent) rule1(ctx contractapi.TransactionContextInterface) {
	if onlyState(s.contractState) && !s.functionStatus["rule1"] {
		if !isTime(int64(s.contractMessage.StartTime)) {
			LandlordBytes, _ := ctx.GetStub().GetState("Landlord")
			// 将获取到的 token 数据反序列化为 token 结构体
			var Landlord Person
			json.Unmarshal(LandlordBytes, &Landlord)
			transferTo(ctx, Landlord, float64(s.contractMessage.Management_fee))
			changeRule("rule1", s)
		}
	}
}
func (s *HouseRent) rule2(ctx contractapi.TransactionContextInterface) {
	if onlyState(s.contractState) {
		if isDone(ctx, "rule1", s) && !isTime(int64(s.contractMessage.PayTime)+int64(s.contractMessage.Payduration)) {
			LandlordBytes, _ := ctx.GetStub().GetState("Landlord")
			// 将获取到的 token 数据反序列化为 token 结构体
			var Landlord Person
			json.Unmarshal(LandlordBytes, &Landlord)
			transferTo(ctx, Landlord, float64(s.contractMessage.Management_fee))
			s.contractMessage.PayTime = time.Now().Unix()
			changeRule("rule2", s)
		}
	}
}
func (s *HouseRent) rule3(_continue bool, ctx contractapi.TransactionContextInterface) {
	if onlyState(s.contractState) && !s.functionStatus["rule3"] {
		s.contractMessage.Continue = _continue
		if !isTime(int64(s.contractMessage.FinishTime)) {
			if s.contractMessage.Continue {
				LandlordBytes, _ := ctx.GetStub().GetState("Landlord")
				// 将获取到的 token 数据反序列化为 token 结构体
				var Landlord Person
				json.Unmarshal(LandlordBytes, &Landlord)
				transferTo(ctx, Landlord, float64(s.contractMessage.Management_fee))
				s.contractMessage.FinishTime = s.contractMessage.FinishTime + s.contractMessage.Payduration
			}
			changeRule("rule3", s)
		}
	}
}
func (s *HouseRent) rule4(_amount int64, ctx contractapi.TransactionContextInterface) {
	if onlyState(s.contractState) && !s.functionStatus["rule4"] {
		s.contractMessage.Amount = _amount
		if isTime(int64(s.contractMessage.FinishTime)) && !isTime(int64(s.contractMessage.FinishTime)+int64(s.contractMessage.Time2)) {
			changeRule("rule4", s)
		}
	}
}
func (s *HouseRent) rule5(ctx contractapi.TransactionContextInterface) {
	if onlyState(s.contractState) && !s.functionStatus["rule5"] {
		if isDone(ctx, "rule4", s) {
			LandlordBytes, _ := ctx.GetStub().GetState("Landlord")
			// 将获取到的 token 数据反序列化为 token 结构体
			var Landlord Person
			json.Unmarshal(LandlordBytes, &Landlord)
			transferTo(ctx, Landlord, float64(s.contractMessage.Amount))
			s.contractState = "finish"
			changeRule("rule5", s)
		}
	}
}
func (s *HouseRent) rule6(ctx contractapi.TransactionContextInterface) {
	if onlyState(s.contractState) && !s.functionStatus["rule6"] {
		if isDone(ctx, "rule1", s) && isTime(int64(s.contractMessage.PayTime)+int64(s.contractMessage.Payduration)+int64(s.contractMessage.Time1)) {
			s.contractState = "terminate"
			changeRule("rule6", s)
		}
	}
}
func (s *HouseRent) rule7(ctx contractapi.TransactionContextInterface) {
	if onlyState(s.contractState) && !s.functionStatus["rule7"] {
		if !isTime(int64(s.contractMessage.FinishTime)) {
			TenantBytes, _ := ctx.GetStub().GetState("Tenant")
			// 将获取到的 token 数据反序列化为 token 结构体
			var Tenant Person
			json.Unmarshal(TenantBytes, &Tenant)
			transferTo(ctx, Tenant, float64(s.contractMessage.Penalty))
			s.contractState = "terminate"
			changeRule("rule7", s)
		}
	}
}
func (s *HouseRent) rule8(ctx contractapi.TransactionContextInterface) {
	if onlyState(s.contractState) && !s.functionStatus["rule8"] {
		if !isTime(int64(s.contractMessage.FinishTime)) {
			LandlordBytes, _ := ctx.GetStub().GetState("Landlord")
			// 将获取到的 token 数据反序列化为 token 结构体
			var Landlord Person
			json.Unmarshal(LandlordBytes, &Landlord)
			transferTo(ctx, Landlord, float64(s.contractMessage.Penalty))
			s.contractState = "terminate"
			changeRule("rule8", s)
		}
	}
}

// 检查某个功能是否已经执行
func isDone(ctx contractapi.TransactionContextInterface, functionName string, s *HouseRent) bool {
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
func changeRule(expressionName string, s *HouseRent) {
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
	contract := new(HouseRent)

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
