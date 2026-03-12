package main
import (
	"encoding/json"
	"fmt"
	"strings"
	"time"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)
type complexPurchase struct {
	contractapi.Contract
	functionStatus map[string]bool
	functionFinishTime map[string]int64
	contractState string
	contractMessage *ContractMessage
}
type Person struct {
  MSPID  string `json:"MSPID"`
  Name   string `json:"name"`
}
type aa struct {
  MSPID  string `json:"MSPID"`
  Name   string `json:"name"`
}
type ca struct {
  MSPID  string `json:"MSPID"`
  Name   string `json:"name"`
Key  int `json:"key"`
Year   int `json:"year"`
}
type ra struct {
  MSPID  string `json:"MSPID"`
  Name   string `json:"name"`
}

type token struct {
Name string `json:"name"`
Number	int64 `json:"number"`
Unit_price	float64 `json:"unit_price"`
Ownership string `json:"ownership"`
}

type ContractMessage struct{
	Status string `json:"status"`
	Place string `json:"place"`				
	GiveTime int64 `json:"giveTime"`
	SignTime int64 `json:"signTime"`
	Price int64 `json:"price"`
	Late_deliveryIR float64 `json:"late_deliveryIR"`
	TerminatedIR float64 `json:"terminatedIR"`
	Late_days int64 `json:"late_days"`
	Late int64 `json:"late"`
	Period int64 `json:"period"`
	FaultyParty string `json:"faultyParty"`				
	Compensation int64 `json:"compensation"`
	Test_result bool `json:"test_result"`				
	SolutionA string `json:"solutionA"`				
	SolutionB string `json:"solutionB"`				
	Solution_1 string `json:"solution_1"`				
	Solution_2 string `json:"solution_2"`				
	Solution_3 string `json:"solution_3"`				
}
func (s *complexPurchase) Init(ctx contractapi.TransactionContextInterface) error {
	Buyer := Person{Name:"A",MSPID:"0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",}
	BuyerJSON, _ := json.Marshal(Buyer)
	if err := ctx.GetStub().PutState("Buyer", BuyerJSON); err != nil{
		return fmt.Errorf("failed to put Buyer to world state. %v", err)
	}

	Seller := Person{Name:"B",MSPID:"0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2",}
	SellerJSON, _ := json.Marshal(Seller)
	if err := ctx.GetStub().PutState("Seller", SellerJSON); err != nil{
		return fmt.Errorf("failed to put Seller to world state. %v", err)
	}

	Platform := Person{Name:"P",MSPID:"0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db",}
	PlatformJSON, _ := json.Marshal(Platform)
	if err := ctx.GetStub().PutState("Platform", PlatformJSON); err != nil{
		return fmt.Errorf("failed to put Platform to world state. %v", err)
	}

	aaa := aa{Name:"aaa",MSPID:"0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db",}
	aaaJSON, _ := json.Marshal(aaa)
	if err := ctx.GetStub().PutState("aaa", aaaJSON); err != nil{
		return fmt.Errorf("failed to put aaa to world state. %v", err)
	}

	court := aa{Name:"court",MSPID:"0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db",}
	courtJSON, _ := json.Marshal(court)
	if err := ctx.GetStub().PutState("court", courtJSON); err != nil{
		return fmt.Errorf("failed to put court to world state. %v", err)
	}

	caAccount := ca{Name:"ca",MSPID:"0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db",Year:123,Key:3,}
	caAccountJSON, _ := json.Marshal(caAccount)
	if err := ctx.GetStub().PutState("caAccount", caAccountJSON); err != nil{
		return fmt.Errorf("failed to put caAccount to world state. %v", err)
	}

	raAccount := ra{Name:"ra",MSPID:"0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db",}
	raAccountJSON, _ := json.Marshal(raAccount)
	if err := ctx.GetStub().PutState("raAccount", raAccountJSON); err != nil{
		return fmt.Errorf("failed to put raAccount to world state. %v", err)
	}

Service := token{Name:"thing",Number:1,Unit_price:100,Ownership:"A",}
ServiceJSON, _ := json.Marshal(Service)
if err := ctx.GetStub().PutState("Service", ServiceJSON); err != nil{
	return fmt.Errorf("failed to put Service to world state. %v", err)
}



// 初始化链码状态
s.functionStatus = make(map[string]bool)
s.functionFinishTime= make(map[string]int64)
s.contractState = "start"
s.contractMessage = &ContractMessage{
	Status: "start",
	Place: "place" ,
	GiveTime: 970704000 ,
	SignTime: 970358400 ,
	Price: 100 ,
	Late_deliveryIR: 50.0 ,
	TerminatedIR: 200.0 ,
	Late_days: 0 ,
	Late: 432000 ,
	Period: 1296000 ,
	FaultyParty: "" ,
	Compensation: 0 ,
	Test_result: false ,
	SolutionA: "" ,
	SolutionB: "" ,
	Solution_1: "Negotiate" ,
	Solution_2: "Court" ,
	Solution_3: "ca" ,
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

// Function: operation1
func (s *complexPurchase) Operation1(ctx contractapi.TransactionContextInterface) error {
    // Update contract state
    if err := ctx.GetStub().PutState("ContractState", []byte("finish")); err != nil {
        return fmt.Errorf("failed to update contract state to finish: %v", err)
    }
    return nil
}
// Function: operation2
func (s *complexPurchase) Operation2(ctx contractapi.TransactionContextInterface) error {
    // Update contract state
    if err := ctx.GetStub().PutState("ContractState", []byte("terminate")); err != nil {
        return fmt.Errorf("failed to update contract state to terminate: %v", err)
    }
    return nil
}
// Function: operation3
func (s *complexPurchase) Operation3(ctx contractapi.TransactionContextInterface) error {
    BuyerBytes, _ := ctx.GetStub().GetState("Buyer")
    	            // 将获取到的 token 数据反序列化为 token 结构体
    	            var Buyer Person
    	            json.Unmarshal(BuyerBytes, &Buyer)
    TransferTo(ctx, Buyer, float64(s.contractMessage.Price)*float64(s.contractMessage.TerminatedIR)/float64(1000))
    return nil
}
// Function: operation4
func (s *complexPurchase) Operation4(ctx contractapi.TransactionContextInterface) error {
    ServiceBytes, _ := ctx.GetStub().GetState("Service")
    // 将获取到的 token 数据反序列化为 token 结构体
    var Service token
    json.Unmarshal(ServiceBytes, &Service)
    BuyerBytes, _ := ctx.GetStub().GetState("Buyer")
    		                    var Buyer Person
    		                    json.Unmarshal(BuyerBytes, &Buyer)
    Service.Ownership=Buyer.Name
    return nil
}
func (s *complexPurchase) Condition1 (ctx contractapi.TransactionContextInterface) bool {
	if (CompareStrings(s.contractMessage.SolutionA,s.contractMessage.SolutionB)){ 
		return true
	}
	return false
}
func (s *complexPurchase) Condition2 (ctx contractapi.TransactionContextInterface) bool {
	if (IsDone(ctx,"rule19",s)||IsDone(ctx,"rule21",s)||IsDone(ctx,"rule23",s)){ 
		return true
	}
	return false
}
func (s *complexPurchase) Rule1(_test_result bool, ctx contractapi.TransactionContextInterface) {
	if OnlyState(s.contractState) && !s.functionStatus["rule1"] {
		s.contractMessage.Test_result = _test_result
		if (!IsTime(int64(s.contractMessage.GiveTime))) {
			ChangeRule("rule1", s)
		}
	}
}
func (s *complexPurchase) Rule2(ctx contractapi.TransactionContextInterface) {
	if OnlyState(s.contractState) && !s.functionStatus["rule2"] {
		if (!IsTime(int64(s.contractMessage.GiveTime)) && s.contractMessage.Test_result) {
			PlatformBytes, _ := ctx.GetStub().GetState("Platform")
			// 将获取到的 token 数据反序列化为 token 结构体
			var Platform Person
			json.Unmarshal(PlatformBytes, &Platform)
			TransferTo(ctx, Platform, float64(s.contractMessage.Price))
			ChangeRule("rule2", s)
		}
	}
}
func (s *complexPurchase) Rule3(ctx contractapi.TransactionContextInterface) {
	if OnlyState(s.contractState) && !s.functionStatus["rule3"] {
		if (IsDone(ctx, "rule1", s) && CompareTimestamps(time.Now().Unix(), s.contractMessage.GiveTime, 86400, "<")) {
			ChangeRule("rule3", s)
		}
	}
}
func (s *complexPurchase) Rule4(ctx contractapi.TransactionContextInterface) {
	if OnlyState(s.contractState) && !s.functionStatus["rule4"] {
		if (IsDone(ctx, "rule2", s) || IsDone(ctx, "rule8", s)) {
			ChangeRule("rule4", s)
		}
	}
}
func (s *complexPurchase) Rule5(ctx contractapi.TransactionContextInterface) {
	if OnlyState(s.contractState) && !s.functionStatus["rule5"] {
		if (!IsTime(s.functionFinishTime["rule3"] + 60*60*24*15)) {
			s.Operation4(ctx)
			ChangeRule("rule5", s)
		}
	}
}
func (s *complexPurchase) Rule6(ctx contractapi.TransactionContextInterface) {
	if OnlyState(s.contractState) && !s.functionStatus["rule6"] {
		if (IsDone(ctx, "rule5", s)) {
			SellerBytes, _ := ctx.GetStub().GetState("Seller")
			// 将获取到的 token 数据反序列化为 token 结构体
			var Seller Person
			json.Unmarshal(SellerBytes, &Seller)
			TransferTo(ctx, Seller, float64(s.contractMessage.Price))
			s.Operation1(ctx)
			ChangeRule("rule6", s)
		}
	}
}
func (s *complexPurchase) Rule7(ctx contractapi.TransactionContextInterface) {
	if OnlyState(s.contractState)&&!s.functionStatus["rule7"]{
	  if(IsDone(ctx,"rule4",s)&&IsTime(int64(s.functionFinishTime["rule4"])+int64(1296000))){
		SellerBytes, _ := ctx.GetStub().GetState("Seller")
			            // 将获取到的 token 数据反序列化为 token 结构体
			            var Seller Person
			            json.Unmarshal(SellerBytes, &Seller)
		TransferTo(ctx, Seller, float64(s.contractMessage.Price));
		s.Operation4(ctx);
		s.Operation1(ctx);
		ChangeRule("rule7",s);
	}
}
}
func (s *complexPurchase) Rule8(_late_days int64, ctx contractapi.TransactionContextInterface) {
	if OnlyState(s.contractState)&&!s.functionStatus["rule8"]{
	s.contractMessage.Late_days = _late_days;
	 if(CompareTimestamps(time.Now().Unix(),s.contractMessage.GiveTime,432000,"<=")){
		BuyerBytes, _ := ctx.GetStub().GetState("Buyer")
			            // 将获取到的 token 数据反序列化为 token 结构体
			            var Buyer Person
			            json.Unmarshal(BuyerBytes, &Buyer)
		TransferTo(ctx, Buyer, float64(s.contractMessage.Late_days)*float64(s.contractMessage.Price)*float64(s.contractMessage.Late_deliveryIR)/float64(1000));
		ChangeRule("rule8",s);
	}
}
}
func (s *complexPurchase) Rule9(ctx contractapi.TransactionContextInterface) {
	if OnlyState(s.contractState)&&!s.functionStatus["rule9"]{
	  if(CompareTimestamps(time.Now().Unix(),s.contractMessage.GiveTime,432000,">")&&!IsDone(ctx,"rule7",s)){
		s.Operation3(ctx);
		s.Operation2(ctx);
		ChangeRule("rule9",s);
	}
}
}
func (s *complexPurchase) Rule10(ctx contractapi.TransactionContextInterface) {
	if OnlyState(s.contractState)&&!s.functionStatus["rule10"]{
	 if(IsDone(ctx,"rule9",s)){
		BuyerBytes, _ := ctx.GetStub().GetState("Buyer")
			            // 将获取到的 token 数据反序列化为 token 结构体
			            var Buyer Person
			            json.Unmarshal(BuyerBytes, &Buyer)
		TransferTo(ctx, Buyer, float64(s.contractMessage.Price));
		ChangeRule("rule10",s);
	}
}
}
func (s *complexPurchase) Rule11(ctx contractapi.TransactionContextInterface) {
	if OnlyState(s.contractState)&&!s.functionStatus["rule11"]{
		s.Operation3(ctx);
		ChangeRule("rule11",s);
}
}
func (s *complexPurchase) Rule12(ctx contractapi.TransactionContextInterface) {
	if OnlyState(s.contractState)&&!s.functionStatus["rule12"]{
		s.Operation3(ctx);
		ChangeRule("rule12",s);
}
}
func (s *complexPurchase) Rule13(ctx contractapi.TransactionContextInterface) {
	if OnlyState(s.contractState)&&!s.functionStatus["rule13"]{
	 if(IsDone(ctx,"rule11",s)||IsDone(ctx,"rule12",s)){
		BuyerBytes, _ := ctx.GetStub().GetState("Buyer")
			            // 将获取到的 token 数据反序列化为 token 结构体
			            var Buyer Person
			            json.Unmarshal(BuyerBytes, &Buyer)
		TransferTo(ctx, Buyer, float64(s.contractMessage.Price));
		s.Operation2(ctx);
		ChangeRule("rule13",s);
	}
}
}
func (s *complexPurchase) Rule14(ctx contractapi.TransactionContextInterface) {
	if true{
		s.contractState="pause";
		ChangeRule("rule14",s);
}
}
func (s *complexPurchase) Rule15(ctx contractapi.TransactionContextInterface) {
	if true{
		s.contractState="restart";
		ChangeRule("rule15",s);
}
}
func (s *complexPurchase) Rule16(_solution_1 string, ctx contractapi.TransactionContextInterface) {
	if OnlyState(s.contractState)&&!s.functionStatus["rule16"]{
	s.contractMessage.Solution_1 = _solution_1;
		ChangeRule("rule16",s);
}
}
func (s *complexPurchase) Rule17(_solution_2 string, ctx contractapi.TransactionContextInterface) {
	if OnlyState(s.contractState)&&!s.functionStatus["rule17"]{
	s.contractMessage.Solution_2 = _solution_2;
		ChangeRule("rule17",s);
}
}
func (s *complexPurchase) Rule18(_faultyParty string, _compensation int64, ctx contractapi.TransactionContextInterface) {
	if OnlyState(s.contractState)&&!s.functionStatus["rule18"]{
	s.contractMessage.FaultyParty = _faultyParty;
	s.contractMessage.Compensation = _compensation;
	if(Logic(s.contractMessage.SolutionA,s.contractMessage.Solution_1,"==")&&s.Condition1(ctx)){
		ChangeRule("rule18",s);
	}
}
}
func (s *complexPurchase) Rule19(ctx contractapi.TransactionContextInterface) {
	if OnlyState(s.contractState)&&!s.functionStatus["rule19"]{
	 if(IsDone(ctx,"rule18",s)){
		ChangeRule("rule19",s);
	}
}
}
func (s *complexPurchase) Rule20_1(ctx contractapi.TransactionContextInterface) {
	if OnlyState(s.contractState)&&!s.functionStatus["rule20_1"]{
	BuyerBytes, _ := ctx.GetStub().GetState("Buyer")
		                    var Buyer Person
		                    json.Unmarshal(BuyerBytes, &Buyer)
	if(s.Condition2(ctx)&&Logic(s.contractMessage.FaultyParty,Buyer.Name,"==")){
		SellerBytes, _ := ctx.GetStub().GetState("Seller")
			            // 将获取到的 token 数据反序列化为 token 结构体
			            var Seller Person
			            json.Unmarshal(SellerBytes, &Seller)
		TransferTo(ctx, Seller, float64(s.contractMessage.Compensation));
		ChangeRule("rule20_1",s);
	}
}
}
func (s *complexPurchase) Rule20_2(ctx contractapi.TransactionContextInterface) {
	if OnlyState(s.contractState)&&!s.functionStatus["rule20_2"]{
	SellerBytes, _ := ctx.GetStub().GetState("Seller")
		                    var Seller Person
		                    json.Unmarshal(SellerBytes, &Seller)
	if(s.Condition2(ctx)&&Logic(s.contractMessage.FaultyParty,Seller.Name,"==")){
		BuyerBytes, _ := ctx.GetStub().GetState("Buyer")
			            // 将获取到的 token 数据反序列化为 token 结构体
			            var Buyer Person
			            json.Unmarshal(BuyerBytes, &Buyer)
		TransferTo(ctx, Buyer, float64(s.contractMessage.Compensation));
		ChangeRule("rule20_2",s);
	}
}
}
func (s *complexPurchase) Rule21(_faultyParty string, _compensation int64, ctx contractapi.TransactionContextInterface) {
	if OnlyState(s.contractState)&&!s.functionStatus["rule21"]{
	s.contractMessage.FaultyParty = _faultyParty;
	s.contractMessage.Compensation = _compensation;
	 if(CompareStrings(s.contractMessage.SolutionA,s.contractMessage.Solution_2)&&s.Condition1(ctx)){
		ChangeRule("rule21",s);
	}
}
}
func (s *complexPurchase) Rule23(_faultyParty string, _compensation int64, ctx contractapi.TransactionContextInterface) {
	if OnlyState(s.contractState)&&!s.functionStatus["rule23"]{
	s.contractMessage.FaultyParty = _faultyParty;
	s.contractMessage.Compensation = _compensation;
	 if(CompareStrings(s.contractMessage.SolutionA,s.contractMessage.Solution_2)&&s.Condition1(ctx)){
		ChangeRule("rule23",s);
	}
}
}

// 检查某个功能是否已经执行
func IsDone(ctx contractapi.TransactionContextInterface, functionName string, s *complexPurchase) bool {
	return s.functionStatus[functionName]
}
// 用于判断是否达到指定时间的函数
func IsTime(targetTime int64) bool {
    return int64(time.Now().Unix()) >= targetTime;
}
// transferTo 用于给指定地址转账并执行模拟支付流程
func TransferTo(ctx contractapi.TransactionContextInterface, recipient Person, amount float64) error {
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
// compareTimestamps 比较两个时间戳，并根据给定的操作符和自定义秒数返回布尔值
func CompareTimestamps(timestamp1 int64, timestamp2 int64, customSeconds int64, operator string) bool {
	// 计算两个时间戳的差值（取绝对值）
	var timeDifference int64
	if timestamp1 > timestamp2 {
		timeDifference = timestamp1 - timestamp2
	} else {
		timeDifference = timestamp2 - timestamp1
	}

	// 判断操作符并执行相应的比较
	switch strings.TrimSpace(operator) {
	case ">":
		return timeDifference > customSeconds
	case "<":
		return timeDifference < customSeconds
	case "==":
		return timeDifference == customSeconds
	case "!==":
		return timeDifference != customSeconds
	default:
		panic("Invalid operator")
	}
}
// 辅助函数，根据比较符号执行比较
func Logic(a, b interface{}, op string) bool {
	switch a := a.(type) {
	case int:
		b, ok := b.(int)
		if !ok {
			return false
		}
		return Compare(float64(a), float64(b), op)
	case float64:
		b, ok := b.(float64)
		if !ok {
			return false
		}
		return Compare(a, b, op)
	case string:
		b, ok := b.(string)
		if !ok {
			return false
		}
		return CompareString(a, b, op)
	default:
		return false
	}
}

func Compare(a, b float64, op string) bool {
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

func CompareString(a, b string, op string) bool {
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
func CompareStrings(str1, str2 string) bool {
    return str1 == str2
}

// changeRule 方法用于更新 functionStatus 和 functionFinishTime 的值
func ChangeRule(expressionName string,s *complexPurchase) {
	// 更新 functionStatus
	s.functionStatus[expressionName] = true
	// 更新 functionFinishTime
	s.functionFinishTime[expressionName] = int64(time.Now().Unix())
}

func OnlyState(State string) bool {
	if CompareStrings(State, "start") || CompareStrings(State, "restart"){ 
		return true
	}
	return false
}

func OnlySomeone(ctx contractapi.TransactionContextInterface, expectedPerson Person) error {
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
	contract := new(complexPurchase)

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
