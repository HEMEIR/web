package main
import (
	"encoding/json"
	"fmt"
	"strings"
	"time"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)
type complexAuction struct {
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
Ownership string `json:"ownership"`
}

type ContractMessage struct{
	Status string `json:"status"`
	StartTime int64 `json:"startTime"`
	GiveTime int64 `json:"giveTime"`
	FinishTime int64 `json:"finishTime"`
	HighestBidder string `json:"highestBidder"`				
	HighestBid int64 `json:"highestBid"`
	Bidder string `json:"bidder"`				
	Bid int64 `json:"bid"`
	BiddingTime int64 `json:"biddingTime"`
	ReservePrice int64 `json:"reservePrice"`
	Commission int64 `json:"Commission"`
	SignTime int64 `json:"signTime"`
	FineIR int64 `json:"FineIR"`
	PayTime int64 `json:"payTime"`
	Test_result bool `json:"test_result"`				
	FaultyParty string `json:"faultyParty"`				
	Compensation int64 `json:"compensation"`
}
func (s *complexAuction) Init(ctx contractapi.TransactionContextInterface) error {
	Platform := Person{Name:"B",MSPID:"0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db",}
	PlatformJSON, _ := json.Marshal(Platform)
	if err := ctx.GetStub().PutState("Platform", PlatformJSON); err != nil{
		return fmt.Errorf("failed to put Platform to world state. %v", err)
	}

	Auctioneer := Person{Name:"A",MSPID:"0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",}
	AuctioneerJSON, _ := json.Marshal(Auctioneer)
	if err := ctx.GetStub().PutState("Auctioneer", AuctioneerJSON); err != nil{
		return fmt.Errorf("failed to put Auctioneer to world state. %v", err)
	}

	aaAccount := aa{Name:"aa",MSPID:"0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db",}
	aaAccountJSON, _ := json.Marshal(aaAccount)
	if err := ctx.GetStub().PutState("aaAccount", aaAccountJSON); err != nil{
		return fmt.Errorf("failed to put aaAccount to world state. %v", err)
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

Service := token{Name:"thing",Number:1,Ownership:"A",}
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
	StartTime: 970754400 ,
	GiveTime: 970704000 ,
	FinishTime: 970758000 ,
	HighestBidder: "" ,
	HighestBid: 0 ,
	Bidder: "" ,
	Bid: 0 ,
	BiddingTime: 3600 ,
	ReservePrice: 10000 ,
	Commission: 1000 ,
	SignTime: 970272000 ,
	FineIR: 200 ,
	PayTime: 43200 ,
	Test_result: false ,
	FaultyParty: "" ,
	Compensation: 0 ,
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

func (s *complexAuction)Rule1(_test_result bool,ctx contractapi.TransactionContextInterface) {
	if OnlyState(s.contractState)&&!s.functionStatus["rule1"]{
	s.contractMessage.Test_result = _test_result;
	 if(!IsTime(int64(s.contractMessage.GiveTime))){
		ChangeRule("rule1",s);
	}
}
}
func (s *complexAuction)Rule2(ctx contractapi.TransactionContextInterface) {
	if OnlyState(s.contractState)&&!s.functionStatus["rule2"]{
	  if(!IsTime(int64(s.contractMessage.StartTime))&&s.contractMessage.Test_result){
		PlatformBytes, _ := ctx.GetStub().GetState("Platform")
			            // 将获取到的 token 数据反序列化为 token 结构体
			            var Platform Person
			            json.Unmarshal(PlatformBytes, &Platform)
		TransferTo(ctx, Platform, float64(s.contractMessage.Commission));
		ServiceBytes, _ := ctx.GetStub().GetState("Service")
		// 将获取到的 token 数据反序列化为 token 结构体
		var Service token
		json.Unmarshal(ServiceBytes, &Service)
		Service.Ownership=Platform.Name
		ChangeRule("rule2",s);
	}
}
}
func (s *complexAuction)Rule3(ctx contractapi.TransactionContextInterface) {
	if OnlyState(s.contractState)&&!s.functionStatus["rule3"]{
	  if(IsDone(ctx,"rule1",s)&&CompareTimestamps(s.contractMessage.StartTime,time.Now().Unix(),3600,"<")){
		ChangeRule("rule3",s);
	}
}
}
func (s *complexAuction)Rule4(_bidder string, _bid int64,ctx contractapi.TransactionContextInterface) {
	if OnlyState(s.contractState){
	s.contractMessage.Bidder = _bidder;
	s.contractMessage.Bid = _bid;
	   if(IsDone(ctx,"rule3",s)&&IsTime(int64(s.contractMessage.StartTime))&&!IsTime(int64(s.contractMessage.FinishTime))&&Logic(s.contractMessage.Bid,s.contractMessage.HighestBid,">")&&Logic(s.contractMessage.Bid,s.contractMessage.ReservePrice,">=")){
		s.contractMessage.HighestBid=s.contractMessage.Bid
		s.contractMessage.HighestBidder=s.contractMessage.Bidder
		ChangeRule("rule4",s);
	}
}
}
func (s *complexAuction)Rule5(_bidder string,ctx contractapi.TransactionContextInterface) {
	if OnlyState(s.contractState)&&!s.functionStatus["rule5"]{
	s.contractMessage.Bidder = _bidder;
	  if(IsTime(int64(s.contractMessage.FinishTime))&&Logic(s.contractMessage.Bidder,s.contractMessage.HighestBidder,"==")&&CompareTimestamps(time.Now().Unix(),s.contractMessage.FinishTime,43200,"<")){
		PlatformBytes, _ := ctx.GetStub().GetState("Platform")
			            // 将获取到的 token 数据反序列化为 token 结构体
			            var Platform Person
			            json.Unmarshal(PlatformBytes, &Platform)
		TransferTo(ctx, Platform, float64(s.contractMessage.HighestBid));
		ChangeRule("rule5",s);
	}
}
}
func (s *complexAuction)Rule6(ctx contractapi.TransactionContextInterface) {
	if OnlyState(s.contractState)&&!s.functionStatus["rule6"]{
	 if(IsDone(ctx,"rule5",s)){
		AuctioneerBytes, _ := ctx.GetStub().GetState("Auctioneer")
			            // 将获取到的 token 数据反序列化为 token 结构体
			            var Auctioneer Person
			            json.Unmarshal(AuctioneerBytes, &Auctioneer)
		TransferTo(ctx, Auctioneer, float64(s.contractMessage.HighestBid));
		ServiceBytes, _ := ctx.GetStub().GetState("Service")
		// 将获取到的 token 数据反序列化为 token 结构体
		var Service token
		json.Unmarshal(ServiceBytes, &Service)
		Service.Ownership=s.contractMessage.Bidder
		s.contractState="finish";
		ChangeRule("rule6",s);
	}
}
}
func (s *complexAuction)Rule8(_bidder string,ctx contractapi.TransactionContextInterface) {
	if OnlyState(s.contractState)&&!s.functionStatus["rule8"]{
	s.contractMessage.Bidder = _bidder;
	  if(Logic(s.contractMessage.Bidder,s.contractMessage.HighestBidder,"==")&&CompareTimestamps(time.Now().Unix(),s.contractMessage.FinishTime,43200,">=")&&!IsDone(ctx,"rule5",s)){
		PlatformBytes, _ := ctx.GetStub().GetState("Platform")
			            // 将获取到的 token 数据反序列化为 token 结构体
			            var Platform Person
			            json.Unmarshal(PlatformBytes, &Platform)
		TransferTo(ctx, Platform, float64(s.contractMessage.HighestBid)*float64(s.contractMessage.FineIR)/float64(1000));
		ChangeRule("rule8",s);
	}
}
}
func (s *complexAuction)Rule9(ctx contractapi.TransactionContextInterface) {
	if OnlyState(s.contractState)&&!s.functionStatus["rule9"]{
	 if(IsDone(ctx,"rule8",s)){
		AuctioneerBytes, _ := ctx.GetStub().GetState("Auctioneer")
			            // 将获取到的 token 数据反序列化为 token 结构体
			            var Auctioneer Person
			            json.Unmarshal(AuctioneerBytes, &Auctioneer)
		TransferTo(ctx, Auctioneer, float64(s.contractMessage.HighestBid)*float64(s.contractMessage.FineIR)/float64(1000));
		ChangeRule("rule9",s);
	}
}
}
func (s *complexAuction)Rule10(ctx contractapi.TransactionContextInterface) {
	if true{
		s.contractState="pause";
		ChangeRule("rule10",s);
}
}
func (s *complexAuction)Rule11(ctx contractapi.TransactionContextInterface) {
	if true{
		s.contractState="restart";
		ChangeRule("rule11",s);
}
}
func (s *complexAuction)Rule12(ctx contractapi.TransactionContextInterface) {
	if OnlyState(s.contractState)&&!s.functionStatus["rule12"]{
	  if(!IsDone(ctx,"rule4",s)&&!IsDone(ctx,"rule8",s)){
		ChangeRule("rule12",s);
	}
}
}
func (s *complexAuction)Rule13(_faultyParty string, _compensation int64,ctx contractapi.TransactionContextInterface) {
	if OnlyState(s.contractState)&&!s.functionStatus["rule13"]{
	s.contractMessage.FaultyParty = _faultyParty;
	s.contractMessage.Compensation = _compensation;
	 if(IsDone(ctx,"rule12",s)){
		ChangeRule("rule13",s);
	}
}
}
func (s *complexAuction)Rule14_1(_bidder string,ctx contractapi.TransactionContextInterface) {
	if OnlyState(s.contractState)&&!s.functionStatus["rule14_1"]{
	s.contractMessage.Bidder = _bidder;
	PlatformBytes, _ := ctx.GetStub().GetState("Platform")
		                    var Platform Person
		                    json.Unmarshal(PlatformBytes, &Platform)
	if(Logic(s.contractMessage.FaultyParty,Platform.Name,"==")){
		ChangeRule("rule14_1",s);
	}
}
}
func (s *complexAuction)Rule14_2(ctx contractapi.TransactionContextInterface) {
	if OnlyState(s.contractState)&&!s.functionStatus["rule14_2"]{
	if(Logic(s.contractMessage.FaultyParty,s.contractMessage.HighestBidder,"==")){
		PlatformBytes, _ := ctx.GetStub().GetState("Platform")
			            // 将获取到的 token 数据反序列化为 token 结构体
			            var Platform Person
			            json.Unmarshal(PlatformBytes, &Platform)
		TransferTo(ctx, Platform, float64(s.contractMessage.Compensation));
		ChangeRule("rule14_2",s);
	}
}
}

// 检查某个功能是否已经执行
func IsDone(ctx contractapi.TransactionContextInterface, functionName string, s *complexAuction) bool {
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

func CompareStrings(a, b string) bool {
	return a == b
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

// changeRule 方法用于更新 functionStatus 和 functionFinishTime 的值
func ChangeRule(expressionName string,s *complexAuction) {
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
	contract := new(complexAuction)

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
