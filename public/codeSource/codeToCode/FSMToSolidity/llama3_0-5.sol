pragma solidity ^0.8.0;

contract ContractFSM {
    enum State { draft, active, terminated, violated }
    State public currentState;

    address public partyA;
    address public partyB;
    string public partyAName;
    string public partyBName;
    bool public partyASigned;
    bool public partyBSigned;
    uint public executionDate;
    uint public effectiveDate;
    bool public isTerminated;
    uint public terminationDate;
    bool public insuranceStatus;
    bool public insuranceProofProvided;
    struct InsuranceLimits {
        uint singleIncident;
        uint annualAggregate;
        string rating;
    }
    InsuranceLimits public insuranceLimits;
    string public insuranceRating;
    uint public forecastedNeeds;
    string public supplySpecifications;
    uint public shelfLifePercentage;
    bool public auditAccess;
    uint public auditFrequency;
    uint public lastAuditDate;
    bool public auditNoticeProvided;
    string public auditDetails;
    bool public violationStatus;
    string public violationDetails;
    uint public violationDate;

    event SignAgreement(address party);
    event SupplyProducts(uint forecastedNeeds, string supplySpecifications);
    event EnsureShelfLife(uint shelfLifePercentage);
    event ApproveSpecificationDeviation(string deviationDetails);
    event MaintainInsurance(InsuranceLimits insuranceLimits);
    event ProvideInsuranceProof();
    event NotifyInsuranceChange(string changeDetails);
    event RequestAudit();
    event ConductAudit(string auditDetails);
    event TerminateContract();
    event BreachContract(string violationDetails);
    event StateTransition(State from, State to);

    constructor() {
        partyAName = "CUTANEA Life Sciences, Inc.";
        partyBName = "Ferrer Internacional, S.A.";
        partyASigned = false;
        partyBSigned = false;
        effectiveDate = 1521806400; // 2018-03-01
        isTerminated = false;
        insuranceStatus = true;
        insuranceProofProvided = false;
        insuranceRating = "A";
        forecastedNeeds = 0;
        supplySpecifications = "";
        shelfLifePercentage = 0;
        auditAccess = false;
        auditFrequency = 1;
        lastAuditDate = 0;
        auditNoticeProvided = false;
        violationStatus = false;
        currentState = State.draft;
    }

    function signAgreement() public {
        require(currentState == State.draft, "Invalid state transition.");
        require(msg.sender == partyA || msg.sender == partyB, "Unauthorized party.");
        if (msg.sender == partyA) {
            partyASigned = true;
        } else {
            partyBSigned = true;
        }
        if (partyASigned && partyBSigned) {
            executionDate = block.timestamp;
            lastAuditDate = effectiveDate;
        }
        currentState = State.active;
        emit SignAgreement(msg.sender);
        emit StateTransition(State.draft, State.active);
    }

    function supplyProducts(uint _forecastedNeeds, string memory _supplySpecifications) public {
        require(currentState == State.active, "Invalid state transition.");
        require(msg.sender == partyB, "Unauthorized party.");
        require(_forecastedNeeds != 0, "Forecasted needs cannot be zero.");
        forecastedNeeds = _forecastedNeeds;
        supplySpecifications = _supplySpecifications;
        emit SupplyProducts(_forecastedNeeds, _supplySpecifications);
    }

    function ensureShelfLife(uint _shelfLifePercentage) public {
        require(currentState == State.active, "Invalid state transition.");
        require(msg.sender == partyB, "Unauthorized party.");
        require(_shelfLifePercentage >= 80, "Shelf life percentage must be at least 80.");
        shelfLifePercentage = _shelfLifePercentage;
        emit EnsureShelfLife(_shelfLifePercentage);
    }

    function approveSpecificationDeviation(string memory _deviationDetails) public {
        require(currentState == State.active, "Invalid state transition.");
        require(msg.sender == partyA, "Unauthorized party.");
        require(bytes(_deviationDetails).length != 0, "Deviation details cannot be empty.");
        auditDetails = _deviationDetails;
        emit ApproveSpecificationDeviation(_deviationDetails);
    }

    function maintainInsurance(InsuranceLimits memory _insuranceLimits) public {
        require(currentState == State.active, "Invalid state transition.");
        require(msg.sender == partyA || msg.sender == partyB, "Unauthorized party.");
        require(_insuranceLimits.singleIncident >= 100000, "Single incident limit must be at least 100000.");
        require(_insuranceLimits.annualAggregate >= 1000000, "Annual aggregate limit must be at least 1000000.");
        require(keccak256(abi.encodePacked(_insuranceLimits.rating)) == keccak256(abi.encodePacked("A")), "Insurance rating must be A or better.");
        insuranceStatus = true;
        insuranceLimits = _insuranceLimits;
        emit MaintainInsurance(_insuranceLimits);
    }

    function provideInsuranceProof() public {
        require(currentState == State.active, "Invalid state transition.");
        require(msg.sender == partyA || msg.sender == partyB, "Unauthorized party.");
        require(insuranceStatus, "Insurance status must be true.");
        insuranceProofProvided = true;
        emit ProvideInsuranceProof();
    }

    function notifyInsuranceChange(string memory _changeDetails) public {
        require(currentState == State.active, "Invalid state transition.");
        require(msg.sender == partyA || msg.sender == partyB, "Unauthorized party.");
        require(insuranceStatus, "Insurance status must be true.");
        auditDetails = _changeDetails;
        emit NotifyInsuranceChange(_changeDetails);
    }

    function requestAudit() public {
        require(currentState == State.active, "Invalid state transition.");
        require(msg.sender == partyA, "Unauthorized party.");
        require(!auditNoticeProvided, "Audit notice already provided.");
        require(block.timestamp >= lastAuditDate + 365 days, "Audit notice can only be sent after 1 year.");
        lastAuditDate = block.timestamp;
        auditNoticeProvided = true;
        emit RequestAudit();
    }

    function conductAudit(string memory _auditDetails) public {
        require(currentState == State.active, "Invalid state transition.");
        require(msg.sender == partyA, "Unauthorized party.");
        require(auditNoticeProvided, "Audit notice must be provided.");
        auditAccess = true;
        auditDetails = _auditDetails;
        auditNoticeProvided = false;
        emit ConductAudit(_auditDetails);
    }

    function terminateContract() public {
        require(currentState == State.active, "Invalid state transition.");
        require(msg.sender == partyA || msg.sender == partyB, "Unauthorized party.");
        require(block.timestamp >= effectiveDate, "Contract can only be terminated after effective date.");
        require(!isTerminated, "Contract is already terminated.");
        isTerminated = true;
        terminationDate = block.timestamp;
        currentState = State.terminated;
        emit TerminateContract();
        emit StateTransition(State.active, State.terminated);
    }

    function breachContract(string memory _violationDetails) public {
        require(currentState == State.active, "Invalid state transition.");
        require(msg.sender == partyA || msg.sender == partyB, "Unauthorized party.");
        require(bytes(_violationDetails).length != 0, "Violation details cannot be empty.");
        violationStatus = true;
        violationDetails = _violationDetails;
        violationDate = block.timestamp;
        currentState = State.violated;
        emit BreachContract(_violationDetails);
        emit StateTransition(State.active, State.violated);
    }
}
