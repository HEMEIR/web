package main
import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)
type complexRent struct {
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
Price	int64 `json:"price"`
Day	int64 `json:"day"`
Ownership string `json:"ownership"`
UseRight string `json:"useRight"`
}

type ContractMessage struct{
	Status string `json:"status"`
	StartTime int64 `json:"startTime"`
	FinishTime int64 `json:"finishTime"`
	PayTime int64 `json:"payTime"`
	Period int64 `json:"period"`
	Max_late int64 `json:"max_late"`
	Late_days int64 `json:"late_days"`
	BreakIR float64 `json:"breakIR"`
	Rent int64 `json:"rent"`
	Deposit int64 `json:"deposit"`
	ContinueRent int64 `json:"continueRent"`
	Iscontinue bool `json:"iscontinue"`				
	ContinueDays int64 `json:"continueDays"`
	CheckResult bool `json:"checkResult"`				
	FaultyParty string `json:"faultyParty"`				
	Compensation int64 `json:"compensation"`
}
func (s *complexRent) Init(ctx contractapi.TransactionContextInterface) error {
	lessor := Person{Name:"A",MSPID:"0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",}
	lessorJSON, _ := json.Marshal(lessor)
	if err := ctx.GetStub().PutState("lessor", lessorJSON); err != nil{
		return fmt.Errorf("failed to put lessor to world state. %v", err)
	}

	lessee := Person{Name:"B",MSPID:"0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2",}
	lesseeJSON, _ := json.Marshal(lessee)
	if err := ctx.GetStub().PutState("lessee", lesseeJSON); err != nil{
		return fmt.Errorf("failed to put lessee to world state. %v", err)
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

Service := token{Name:"thing",Price:100,Day:30,Ownership:"A",UseRight:"A",}
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
	StartTime: 970747200 ,
	FinishTime: 973425600 ,
	PayTime: 970747200 ,
	Period: 864000 ,
	Max_late: 432000 ,
	Late_days: 0 ,
	BreakIR: 200.0 ,
	Rent: 1000 ,
	Deposit: 500 ,
	ContinueRent: 200 ,
	Iscontinue: false ,
	ContinueDays: 0 ,
	CheckResult: false ,
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

// Function: operation1
func (s *complexRent) Operation1(ctx contractapi.TransactionContextInterface) error {
    ServiceBytes, _ := ctx.GetStub().GetState("Service")
    // 将获取到的 token 数据反序列化为 token 结构体
    var Service token
    json.Unmarshal(ServiceBytes, &Service)
    lesseeBytes, _ := ctx.GetStub().GetState("lessee")
    		                    var lessee Person
    		                    json.Unmarshal(lesseeBytes, &lessee)
    Service.UseRight=lessee.Name
    return nil
}
// Function: operation2
func (s *complexRent) Operation2(ctx contractapi.TransactionContextInterface) error {
    ServiceBytes, _ := ctx.GetStub().GetState("Service")
    // 将获取到的 token 数据反序列化为 token 结构体
    var Service token
    json.Unmarshal(ServiceBytes, &Service)
    lessorBytes, _ := ctx.GetStub().GetState("lessor")
    		                    var lessor Person
    		                    json.Unmarshal(lessorBytes, &lessor)
    Service.UseRight=lessor.Name
    return nil
}
// Function: operation3
func (s *complexRent) Operation3(ctx contractapi.TransactionContextInterface) error {
    // Update contract state
    if err := ctx.GetStub().PutState("ContractState", []byte("finish")); err != nil {
        return fmt.Errorf("failed to update contract state to finish: %v", err)
    }
    return nil
}
// Function: operation4
func (s *complexRent) Operation4(ctx contractapi.TransactionContextInterface) error {
    // Update contract state
    if err := ctx.GetStub().PutState("ContractState", []byte("terminate")); err != nil {
        return fmt.Errorf("failed to update contract state to terminate: %v", err)
    }
    return nil
}
func (s *complexRent) Condition1 (ctx contractapi.TransactionContextInterface) bool {
	if (IsDone(ctx,"rule3",s)||IsDone(ctx,"rule4",s)){ 
		return true
	}
	return false
}
func (s *complexRent)Rule1(_checkResult bool,ctx contractapi.TransactionContextInterface) {
	if OnlyState(s.contractState)&&!s.functionStatus["rule1"]{
	s.contractMessage.CheckResult = _checkResult;
	 if(!IsTime(int64(s.contractMessage.StartTime))){
		ChangeRule("rule1",s);
	}
}
}
func (s *complexRent)Rule2(ctx contractapi.TransactionContextInterface) {
	if OnlyState(s.contractState)&&!s.functionStatus["rule2"]{
	  if(!IsTime(int64(s.contractMessage.StartTime))&&s.contractMessage.CheckResult){
		lessorBytes, _ := ctx.GetStub().GetState("lessor")
			            // 将获取到的 token 数据反序列化为 token 结构体
			            var lessor Person
			            json.Unmarshal(lessorBytes, &lessor)
		TransferTo(ctx, lessor, float64(s.contractMessage.Rent)+float64(s.contractMessage.Deposit));
		ChangeRule("rule2",s);
	}
}
}
func (s *complexRent)Rule3(ctx contractapi.TransactionContextInterface) {
	if OnlyState(s.contractState)&&!s.functionStatus["rule3"]{
	  if(IsDone(ctx,"rule2",s)&&!IsTime(int64(s.contractMessage.StartTime))){
		s.Operation1(ctx);
		ChangeRule("rule3",s);
	}
}
}
func (s *complexRent)Rule4(_late_days int64,ctx contractapi.TransactionContextInterface) {
	if OnlyState(s.contractState)&&!s.functionStatus["rule4"]{
	s.contractMessage.Late_days = _late_days;
	  if(!IsTime(int64(s.contractMessage.StartTime)+int64(s.contractMessage.Max_late))&&!IsDone(ctx,"rule3",s)){
		lesseeBytes, _ := ctx.GetStub().GetState("lessee")
			            // 将获取到的 token 数据反序列化为 token 结构体
			            var lessee Person
			            json.Unmarshal(lesseeBytes, &lessee)
		TransferTo(ctx, lessee, float64(s.contractMessage.Rent)*float64(5)*float64(s.contractMessage.BreakIR)/float64(1000));
		s.Operation1(ctx);
		ChangeRule("rule4",s);
	}
}
}
func (s *complexRent)Rule5(ctx contractapi.TransactionContextInterface) {
	if OnlyState(s.contractState)&&!s.functionStatus["rule5"]{
	   if(IsTime(int64(s.contractMessage.StartTime)+int64(s.contractMessage.Max_late))&&!IsDone(ctx,"rule3",s)&&!IsDone(ctx,"rule4",s)){
		lesseeBytes, _ := ctx.GetStub().GetState("lessee")
			            // 将获取到的 token 数据反序列化为 token 结构体
			            var lessee Person
			            json.Unmarshal(lesseeBytes, &lessee)
		TransferTo(ctx, lessee, float64(s.contractMessage.Rent)*float64(5)*float64(s.contractMessage.BreakIR)/float64(1000)+float64(s.contractMessage.Rent)+float64(s.contractMessage.Deposit));
		s.Operation4(ctx);
		ChangeRule("rule5",s);
	}
}
}
func (s *complexRent)Rule6(ctx contractapi.TransactionContextInterface) {
	if OnlyState(s.contractState){
	   if(s.Condition1(ctx)&&IsTime(int64(s.contractMessage.PayTime)+int64(s.contractMessage.Period))&&!IsTime(int64(s.contractMessage.PayTime)+int64(s.contractMessage.Period)+int64(86400))&&!IsTime(int64(s.contractMessage.FinishTime))){
		lessorBytes, _ := ctx.GetStub().GetState("lessor")
			            // 将获取到的 token 数据反序列化为 token 结构体
			            var lessor Person
			            json.Unmarshal(lessorBytes, &lessor)
		TransferTo(ctx, lessor, float64(s.contractMessage.Rent));
		s.contractMessage.PayTime=s.contractMessage.PayTime+s.contractMessage.Period
		s.functionStatus["rule8"]=true;
		ChangeRule("rule6",s);
	}
}
}
func (s *complexRent)Rule7(_late_days int64,ctx contractapi.TransactionContextInterface) {
	if OnlyState(s.contractState){
	s.contractMessage.Late_days = _late_days;
	  if(IsTime(int64(s.contractMessage.PayTime)+int64(s.contractMessage.Period)+int64(86400))&&!IsTime(int64(s.contractMessage.PayTime)+int64(s.contractMessage.Period)+int64(432000))){
		lessorBytes, _ := ctx.GetStub().GetState("lessor")
			            // 将获取到的 token 数据反序列化为 token 结构体
			            var lessor Person
			            json.Unmarshal(lessorBytes, &lessor)
		TransferTo(ctx, lessor, float64(s.contractMessage.Rent)*float64(s.contractMessage.Late_days)*float64(s.contractMessage.BreakIR)/float64(1000));
		s.contractMessage.PayTime=s.contractMessage.PayTime+s.contractMessage.Period
		s.functionStatus["rule8"]=true;
		ChangeRule("rule7",s);
	}
}
}
func (s *complexRent)Rule8(_late_days int64,ctx contractapi.TransactionContextInterface) {
	if OnlyState(s.contractState)&&!s.functionStatus["rule8"]{
	s.contractMessage.Late_days = _late_days;
	 if(IsTime(int64(s.contractMessage.PayTime)+int64(s.contractMessage.Period)+int64(432000))){
		s.Operation2(ctx);
		s.Operation4(ctx);
		ChangeRule("rule8",s);
	}
}
}
func (s *complexRent)Rule9(_continueDays int64,ctx contractapi.TransactionContextInterface) {
	if OnlyState(s.contractState){
	s.contractMessage.ContinueDays = _continueDays;
	 if(!IsTime(int64(s.contractMessage.FinishTime))){
		lessorBytes, _ := ctx.GetStub().GetState("lessor")
			            // 将获取到的 token 数据反序列化为 token 结构体
			            var lessor Person
			            json.Unmarshal(lessorBytes, &lessor)
		TransferTo(ctx, lessor, float64(s.contractMessage.Rent)*float64(s.contractMessage.ContinueDays));
		ChangeRule("rule9",s);
	}
}
}
func (s *complexRent)Rule10(_iscontinue bool,ctx contractapi.TransactionContextInterface) {
	if OnlyState(s.contractState){
	s.contractMessage.Iscontinue = _iscontinue;
	 if(IsDone(ctx,"rule9",s)){
		if(s.contractMessage.Iscontinue){
			s.contractMessage.FinishTime=s.contractMessage.FinishTime+s.contractMessage.ContinueDays*60*60*24
		}
		if(!s.contractMessage.Iscontinue){
			lesseeBytes, _ := ctx.GetStub().GetState("lessee")
				            // 将获取到的 token 数据反序列化为 token 结构体
				            var lessee Person
				            json.Unmarshal(lesseeBytes, &lessee)
			TransferTo(ctx, lessee, float64(s.contractMessage.Rent)*float64(s.contractMessage.ContinueDays));
		}
		ChangeRule("rule10",s);
	}
}
}
func (s *complexRent)Rule11(ctx contractapi.TransactionContextInterface) {
	if OnlyState(s.contractState)&&!s.functionStatus["rule11"]{
	 if(IsTime(int64(s.contractMessage.FinishTime))){
		s.Operation2(ctx);
		lesseeBytes, _ := ctx.GetStub().GetState("lessee")
			            // 将获取到的 token 数据反序列化为 token 结构体
			            var lessee Person
			            json.Unmarshal(lesseeBytes, &lessee)
		TransferTo(ctx, lessee, float64(s.contractMessage.Deposit));
		s.Operation3(ctx);
		ChangeRule("rule11",s);
	}
}
}
func (s *complexRent)Rule12(ctx contractapi.TransactionContextInterface) {
	if true{
		s.contractState="pause";
		ChangeRule("rule12",s);
}
}
func (s *complexRent)Rule13(ctx contractapi.TransactionContextInterface) {
	if true{
		s.contractState="restart";
		ChangeRule("rule13",s);
}
}
func (s *complexRent)Rule14(ctx contractapi.TransactionContextInterface) {
	if OnlyState(s.contractState)&&!s.functionStatus["rule14"]{
		ChangeRule("rule14",s);
}
}
func (s *complexRent)Rule15(ctx contractapi.TransactionContextInterface) {
	if OnlyState(s.contractState)&&!s.functionStatus["rule15"]{
		ChangeRule("rule15",s);
}
}
func (s *complexRent)Rule16(_faultyParty string, _compensation int64,ctx contractapi.TransactionContextInterface) {
	if OnlyState(s.contractState)&&!s.functionStatus["rule16"]{
	s.contractMessage.FaultyParty = _faultyParty;
	s.contractMessage.Compensation = _compensation;
	 if(IsDone(ctx,"rule14",s)||IsDone(ctx,"rule15",s)){
		ChangeRule("rule16",s);
	}
}
}
func (s *complexRent)Rule17_1(ctx contractapi.TransactionContextInterface) {
	if OnlyState(s.contractState)&&!s.functionStatus["rule17_1"]{
	lessorBytes, _ := ctx.GetStub().GetState("lessor")
		                    var lessor Person
		                    json.Unmarshal(lessorBytes, &lessor)
	if(Logic(s.contractMessage.FaultyParty,lessor.Name,"==")){
		lesseeBytes, _ := ctx.GetStub().GetState("lessee")
			            // 将获取到的 token 数据反序列化为 token 结构体
			            var lessee Person
			            json.Unmarshal(lesseeBytes, &lessee)
		TransferTo(ctx, lessee, float64(s.contractMessage.Compensation));
		s.Operation4(ctx);
		ChangeRule("rule17_1",s);
	}
}
}
func (s *complexRent)Rule17_2(ctx contractapi.TransactionContextInterface) {
	if OnlyState(s.contractState)&&!s.functionStatus["rule17_2"]{
	lesseeBytes, _ := ctx.GetStub().GetState("lessee")
		                    var lessee Person
		                    json.Unmarshal(lesseeBytes, &lessee)
	if(Logic(s.contractMessage.FaultyParty,lessee.Name,"==")){
		lessorBytes, _ := ctx.GetStub().GetState("lessor")
			            // 将获取到的 token 数据反序列化为 token 结构体
			            var lessor Person
			            json.Unmarshal(lessorBytes, &lessor)
		TransferTo(ctx, lessor, float64(s.contractMessage.Compensation));
		s.Operation4(ctx);
		ChangeRule("rule17_2",s);
	}
}
}

// 检查某个功能是否已经执行
func IsDone(ctx contractapi.TransactionContextInterface, functionName string, s *complexRent) bool {
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

func CompareStrings(str1, str2 string) bool {
    return str1 == str2
}

// changeRule 方法用于更新 functionStatus 和 functionFinishTime 的值
func ChangeRule(expressionName string,s *complexRent) {
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
	contract := new(complexRent)

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
