import * as wlmglInterface from "../Interfaces/wlmglInterface";

// Import xml2js library
const xml2js = require("xml2js");
const parser = new xml2js.Parser(); // Initialize xml2js parser
/**
 * parser for parsing RMF monitor I CPU report XML data to JSON
 * @param {string} xml - Workload XML data from RMF Monitor I
 */
export default async function parseWLMGL(xml) {
    try {
        const result = await parser.parseStringPromise(xml);
        const finalJSON = {}; // Collection for storing JSON of Parsed XML
        const postprocessors = result.ddsml.postprocessor;
        for (const a in postprocessors) {
          // Loop through postprocessor sections
          let singleReport: Partial<wlmglInterface.WLMGL> = {};
          let allSC = [];
          let allWorkload = [];
          const segments = postprocessors[a].segment;
          
          for (const b in segments) {
            var segmentName = segments[b].name[0];
            const parts = segments[b].part;
            if (segmentName.trim() == "Policy Activation") {
                let activation: Partial<wlmglInterface.Activation> = {}
              
              for (const c in parts) {
                if(Object.keys(parts[c]).length > 1 ) { // The part has no childnodes
                    //var partName = parts[c]["name"][0].trim()
                    switch (`${c}`) {
                        case "0":{
                            const varlist = parts[c]["var-list"];
                
                            for (var vr in varlist[0]["var"]) {
                                switch (`${varlist[0]["var"][vr].name[0].trim()}`) {
                                    case "Date": {
                                        activation.date = varlist[0]["var"][vr].value[0].trim();
                                        break;
                                    }
                                    case "Time": {
                                        activation.time = varlist[0]["var"][vr].value[0].trim();
                                        break;
                                    }
                                } 
                            }
                            break;
                        }

                    } 
                }
                
              }
              singleReport.policyActivation = activation
            }else if((segmentName.trim()).includes("Service Class")){
                /* let sc: Partial<wlmglInterface.SC> = {}
                let msg: Partial<wlmglInterface.Message> = {}
              
              for (const c in parts) {
                if(Object.keys(parts[c]).length > 1 ) { // The part has no childnodes
                    //var partName = parts[c]["name"][0].trim()
                    switch (`${c}`) {
                        case "0":{
                            const varlist = parts[c]["var-list"];
                
                            for (var vr in varlist[0]["var"]) {
                                switch (`${varlist[0]["var"][vr].name[0].trim()}`) {
                                    case "Policy": {
                                        sc.policy = varlist[0]["var"][vr].value[0].trim();
                                        break;
                                    }
                                    case "Workload": {
                                        sc.workload = varlist[0]["var"][vr].value[0].trim();
                                        break;
                                    }
                                    case "Service Class": {
                                        sc.serviceClass = varlist[0]["var"][vr].value[0].trim();
                                        break;
                                    }
                                    case "Description": {
                                        sc.description = varlist[0]["var"][vr].value[0].trim();
                                        break;
                                    }
                                    case "Resource Group": {
                                        sc.resourceGroup = varlist[0]["var"][vr].value[0].trim();
                                        break;
                                    }
                                    case "Critical": {
                                        sc.critical = varlist[0]["var"][vr].value[0].trim();
                                        break;
                                    }
                                    case "Honor Priority": {
                                        sc.honorPriority = varlist[0]["var"][vr].value[0].trim();
                                        break;
                                    }
                                } 
                            }
                            break;
                        }

                    } 
                }
                
              }
              try{
                const msgSeg = segments[b].message
                //console.log(msgSeg)
                msg.description = msgSeg[0]["description"][0].trim()
                msg.severity = msgSeg[0]["severity"][0].trim()
                sc.message = msg
              }catch(e){

              } */
                let sclass: Partial<wlmglInterface.SClass> = {}
                let sc: Partial<wlmglInterface.SC> = {}
                let msg: Partial<wlmglInterface.Message> = {}
                let transactions: Partial<wlmglInterface.Transactions> = {}
                let transactionTime: Partial<wlmglInterface.tTime> = {}
                let tat: Partial<wlmglInterface.TAT> = {}
                let enclave: Partial<wlmglInterface.Enclaves> = {}
                let service: Partial<wlmglInterface.Service> = {}
                let st: Partial<wlmglInterface.sTime> = {}
                let at: Partial<wlmglInterface.aTime> = {}
                let promoted: Partial<wlmglInterface.Promoted> = {}
                let dasd: Partial<wlmglInterface.dasd> = {}
                let frame: Partial<wlmglInterface.Frames> = {}
                let rates: Partial<wlmglInterface.Rates> = {}
                let summary: Partial<wlmglInterface.Summary> = {}
              
              for (const c in parts) {
                if(Object.keys(parts[c]).length > 1 ) { // The part has no childnodes
                    //var partName = parts[c]["name"][0].trim()
                    var partName;
                    try{
                        partName = parts[c]["name"][0].trim()
                    }catch(e){
                        partName = c
                    }
                    
                    switch (`${partName}`) {
                        case "0":{
                            const varlist = parts[c]["var-list"];
                
                            for (var vr in varlist[0]["var"]) {
                                switch (`${varlist[0]["var"][vr].name[0].trim()}`) {
                                    case "Policy": {
                                        sc.policy = varlist[0]["var"][vr].value[0].trim();
                                        break;
                                    }
                                    case "Workload": {
                                        sc.workload = varlist[0]["var"][vr].value[0].trim();
                                        break;
                                    }
                                    case "Service Class": {
                                        sc.serviceClass = varlist[0]["var"][vr].value[0].trim();
                                        break;
                                    }
                                    case "Description": {
                                        sc.description = varlist[0]["var"][vr].value[0].trim();
                                        break;
                                    }
                                    case "Resource Group": {
                                        sc.resourceGroup = varlist[0]["var"][vr].value[0].trim();
                                        break;
                                    }
                                    case "Critical": {
                                        sc.critical = varlist[0]["var"][vr].value[0].trim();
                                        break;
                                    }
                                    case "Honor Priority": {
                                        sc.honorPriority = varlist[0]["var"][vr].value[0].trim();
                                        break;
                                    }
                                } 
                            }
                            sclass.serviceClass = sc
                            break;
                        }
                        case "Transactions":{
                            const varlist = parts[c]["var-list"];
                
                            for (var vr in varlist[0]["var"]) {
                                switch (`${varlist[0]["var"][vr].name[0].trim()}`) {
                                    case "Average": {
                                        transactions.average = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "MPL": {
                                        transactions.mpl = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "Ended": {
                                        transactions.ended = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "Ended/sec": {
                                        transactions.endedSec = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "# of Swaps": {
                                        transactions.swaps = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "Executed": {
                                        transactions.executed = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                } 
                            }
                            sclass.transactions = transactions
                            break;
                        }
                        case "Transaction Time (HHH.MM.SS.FFFFFF)":{
                            const varlist = parts[c]["var-list"];
                
                            for (var vr in varlist[0]["var"]) {
                                switch (`${varlist[0]["var"][vr].name[0].trim()}`) {
                                    case "Actual": {
                                        transactionTime.actual = varlist[0]["var"][vr].value[0].trim();
                                        break;
                                    }
                                    case "Execution": {
                                        transactionTime.executed = varlist[0]["var"][vr].value[0].trim();
                                        break;
                                    }
                                    case "Queued": {
                                        transactionTime.queued = varlist[0]["var"][vr].value[0].trim();
                                        break;
                                    }
                                    case "Resource/System Affinity": {
                                        transactionTime.resource = varlist[0]["var"][vr].value[0].trim();
                                        break;
                                    }
                                    case "Ineligible": {
                                        transactionTime.ineligible = varlist[0]["var"][vr].value[0].trim();
                                        break;
                                    }
                                    case "Conversion": {
                                        transactionTime.conversion = varlist[0]["var"][vr].value[0].trim();
                                        break;
                                    }
                                    case "Standard Deviation": {
                                        transactionTime.stDev = varlist[0]["var"][vr].value[0].trim();
                                        break;
                                    }
                                } 
                            }
                            sclass.transactionTime = transactionTime
                            break;
                        }
                        case "Transaction Application Time %":{
                            const { table } = parts[c];
                            const tableBody = table[0].row;
                            const atimeList  = [];
                            for (var tb in tableBody) {
                                const atime:  Partial<wlmglInterface.TAT> = {};
                                
                                atime.category = tableBody[tb].col[0].trim();
                                atime.cp = parseFloat(tableBody[tb].col[1].trim());
                                atime.ziipOrzaapOnCP = parseFloat(tableBody[tb].col[2].trim());
                                atime.ziipOrzaap = parseFloat(tableBody[tb].col[3].trim());
                                atimeList.push(atime);
                            
                            }
                            sclass.transactionApplicationTime = atimeList
                            break;
                        }
                        case "Enclaves":{
                            const varlist = parts[c]["var-list"];
                
                            for (var vr in varlist[0]["var"]) {
                                switch (`${varlist[0]["var"][vr].name[0].trim()}`) {
                                    case "Average Enclaves": {
                                        enclave.average = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "Remote Enclaves": {
                                        enclave.remote = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "Multi-System Enclaves": {
                                        enclave.multiSystems = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                } 
                            }
                            sclass.enclaves = enclave
                            break;
                        }
                        case "Service":{
                            const varlist = parts[c]["var-list"];
                
                            for (var vr in varlist[0]["var"]) {
                                switch (`${varlist[0]["var"][vr].name[0].trim()}`) {
                                    case "IOC": {
                                        service.ioc = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "CPU": {
                                        service.cpu = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "MSO": {
                                        service.mso = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "SRB": {
                                        service.srb = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "Total": {
                                        service.total = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "Per Second": {
                                        service.perSecond = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "Absorption Rate": {
                                        service.absorptionRate = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "Transaction Service Rate": {
                                        service.serviceRate = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }

                                } 
                            }
                            sclass.service = service
                            break;
                        }
                        case "Service Time":{
                            const varlist = parts[c]["var-list"];
                
                            for (var vr in varlist[0]["var"]) {
                                switch (`${varlist[0]["var"][vr].name[0].trim()}`) {
                                    case "CPU": {
                                        st.cpu = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "SRB": {
                                        st.srb = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "RCT": {
                                        st.rct = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "I/O Interrupt": {
                                        st.ioInterrupts = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "Hiperspace": {
                                        st.hyperSpace = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "zIIP": {
                                        st.ziip = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "zAAP": {
                                        st.zaap = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                } 
                            }
                            sclass.serviceTime = st
                            break;
                        }
                        case "Application Time %":{
                            const varlist = parts[c]["var-list"];
                
                            for (var vr in varlist[0]["var"]) {
                                switch (`${varlist[0]["var"][vr].name[0].trim()}`) {
                                    case "CP": {
                                        at.cp = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "zIIP on CP": {
                                        at.ziipOnCP = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "zIIP": {
                                        at.ziip = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "zAAP on CP": {
                                        at.zaapOnCP = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "zAAP": {
                                        at.zaap = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                } 
                            }
                            sclass.applicationTime = at
                            break;
                        }
                        case "Promoted Transactions":{
                            const varlist = parts[c]["var-list"];
                
                            for (var vr in varlist[0]["var"]) {
                                switch (`${varlist[0]["var"][vr].name[0].trim()}`) {
                                    case "Blocked": {
                                        promoted.blocked = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "Enqueue": {
                                        promoted.enqueue = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "CRM": {
                                        promoted.crm = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "Lock": {
                                        promoted.lock = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "SUP": {
                                        promoted.sup = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                } 
                            }
                            sclass.promotedTransaction = promoted
                            break;
                        }
                        case "DASD I/O":{
                            const varlist = parts[c]["var-list"];
                
                            for (var vr in varlist[0]["var"]) {
                                switch (`${varlist[0]["var"][vr].name[0].trim()}`) {
                                    case "SSCH/sec": {
                                        dasd.ssch = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "Response Time": {
                                        dasd.responseTime = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "Connect Time": {
                                        dasd.connectTime = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "Disconnect Time": {
                                        dasd.disconnectTime = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "Queue+Pending Time": {
                                        dasd.pendingTime = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "IOS Queue Time": {
                                        dasd.iosQueueTime = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                } 
                            }
                            sclass.dasdIO = dasd
                            break;
                        }
                        case "Storage Frames":{
                            const varlist = parts[c]["var-list"];
                
                            for (var vr in varlist[0]["var"]) {
                                switch (`${varlist[0]["var"][vr].name[0].trim()}`) {
                                    case "Average": {
                                        frame.average = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "Total": {
                                        frame.total = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "Shared": {
                                        frame.shared = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                } 
                            }
                            sclass.sharedFrames = frame
                            break;
                        }
                        case "Page-In Rates":{
                            const varlist = parts[c]["var-list"];
                
                            for (var vr in varlist[0]["var"]) {
                                switch (`${varlist[0]["var"][vr].name[0].trim()}`) {
                                    case "Single": {
                                        rates.single = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "Blocked": {
                                        rates.blocked = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "Shared": {
                                        rates.shared = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "Hiperspace": {
                                        rates.hyperSpace = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                } 
                            }
                            sclass.pageInRates = rates
                            break;
                        }
                        case "Goals/Actuals Summary":{
                            const { table } = parts[c];
                            const tableBody = table[0].row;
                            const summaryList  = [];
                            for (var tb in tableBody) {
                                const summ:  Partial<wlmglInterface.Summary> = {};
                                
                                summ.period = parseFloat(tableBody[tb].col[0].trim());
                                summ.importance = parseFloat(tableBody[tb].col[1].trim());
                                summ.performanceIndex = parseFloat(tableBody[tb].col[2].trim());
                                summ.numberOfTransactions = parseFloat(tableBody[tb].col[3].trim());
                                summ.percentageOfTransactions = parseFloat(tableBody[tb].col[4].trim());
                                summ.responseTimeGoal = parseFloat(tableBody[tb].col[5].trim());
                                summ.responseTimeActual = parseFloat(tableBody[tb].col[6].trim());
                                summ.responseTimeTotal = parseFloat(tableBody[tb].col[7].trim());
                                summ.executionVelocityGoal = parseFloat(tableBody[tb].col[8].trim());
                                summ.executionVelocityActual = parseFloat(tableBody[tb].col[9].trim());
                                summ.totalUsing = parseFloat(tableBody[tb].col[10].trim());
                                summ.executionDelay = parseFloat(tableBody[tb].col[11].trim());
                                summaryList.push(summ);
                            
                            }
                            sclass.goalSummary = summaryList
                            break;
                        }
                    } 
                }
              }
              allSC.push(sclass)
            }else if((segmentName.trim()).includes("Workload")){
                let workload: Partial<wlmglInterface.Workload> = {}
                let noName: Partial<wlmglInterface.NoName> = {}
                let transactions: Partial<wlmglInterface.Transactions> = {}
                let transactionTime: Partial<wlmglInterface.tTime> = {}
                let tat: Partial<wlmglInterface.TAT> = {}
                let enclave: Partial<wlmglInterface.Enclaves> = {}
                let service: Partial<wlmglInterface.Service> = {}
                let st: Partial<wlmglInterface.sTime> = {}
                let at: Partial<wlmglInterface.aTime> = {}
                let promoted: Partial<wlmglInterface.Promoted> = {}
                let dasd: Partial<wlmglInterface.dasd> = {}
                let frame: Partial<wlmglInterface.Frames> = {}
                let rates: Partial<wlmglInterface.Rates> = {}
                let summary: Partial<wlmglInterface.Summary> = {}
              
              for (const c in parts) {
                if(Object.keys(parts[c]).length > 1 ) { // The part has no childnodes
                    //var partName = parts[c]["name"][0].trim()
                    var partName;
                    try{
                        partName = parts[c]["name"][0].trim()
                    }catch(e){
                        partName = c
                    }
                    
                    switch (`${partName}`) {
                        case "0":{
                            const varlist = parts[c]["var-list"];
                
                            for (var vr in varlist[0]["var"]) {
                                switch (`${varlist[0]["var"][vr].name[0].trim()}`) {
                                    case "Policy": {
                                        noName.policy = varlist[0]["var"][vr].value[0].trim();
                                        break;
                                    }
                                    case "Workload": {
                                        noName.workload = varlist[0]["var"][vr].value[0].trim();
                                        break;
                                    }
                                    case "Description": {
                                        noName.description = varlist[0]["var"][vr].value[0].trim();
                                        break;
                                    }
                                } 
                            }
                            workload.details = noName
                            break;
                        }
                        case "Transactions":{
                            const varlist = parts[c]["var-list"];
                
                            for (var vr in varlist[0]["var"]) {
                                switch (`${varlist[0]["var"][vr].name[0].trim()}`) {
                                    case "Average": {
                                        transactions.average = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "MPL": {
                                        transactions.mpl = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "Ended": {
                                        transactions.ended = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "Ended/sec": {
                                        transactions.endedSec = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "# of Swaps": {
                                        transactions.swaps = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "Executed": {
                                        transactions.executed = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                } 
                            }
                            workload.transactions = transactions
                            break;
                        }
                        case "Transaction Time (HHH.MM.SS.FFFFFF)":{
                            const varlist = parts[c]["var-list"];
                
                            for (var vr in varlist[0]["var"]) {
                                switch (`${varlist[0]["var"][vr].name[0].trim()}`) {
                                    case "Actual": {
                                        transactionTime.actual = varlist[0]["var"][vr].value[0].trim();
                                        break;
                                    }
                                    case "Execution": {
                                        transactionTime.executed = varlist[0]["var"][vr].value[0].trim();
                                        break;
                                    }
                                    case "Queued": {
                                        transactionTime.queued = varlist[0]["var"][vr].value[0].trim();
                                        break;
                                    }
                                    case "Resource/System Affinity": {
                                        transactionTime.resource = varlist[0]["var"][vr].value[0].trim();
                                        break;
                                    }
                                    case "Ineligible": {
                                        transactionTime.ineligible = varlist[0]["var"][vr].value[0].trim();
                                        break;
                                    }
                                    case "Conversion": {
                                        transactionTime.conversion = varlist[0]["var"][vr].value[0].trim();
                                        break;
                                    }
                                    case "Standard Deviation": {
                                        transactionTime.stDev = varlist[0]["var"][vr].value[0].trim();
                                        break;
                                    }
                                } 
                            }
                            workload.transactionTime = transactionTime
                            break;
                        }
                        case "Transaction Application Time %":{
                            const { table } = parts[c];
                            const tableBody = table[0].row;
                            const atimeList  = [];
                            for (var tb in tableBody) {
                                const atime:  Partial<wlmglInterface.TAT> = {};
                                
                                atime.category = tableBody[tb].col[0].trim();
                                atime.cp = parseFloat(tableBody[tb].col[1].trim());
                                atime.ziipOrzaapOnCP = parseFloat(tableBody[tb].col[2].trim());
                                atime.ziipOrzaap = parseFloat(tableBody[tb].col[3].trim());
                                atimeList.push(atime);
                            
                            }
                            workload.transactionApplicationTime = atimeList
                            break;
                        }
                        case "Enclaves":{
                            const varlist = parts[c]["var-list"];
                
                            for (var vr in varlist[0]["var"]) {
                                switch (`${varlist[0]["var"][vr].name[0].trim()}`) {
                                    case "Average Enclaves": {
                                        enclave.average = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "Remote Enclaves": {
                                        enclave.remote = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "Multi-System Enclaves": {
                                        enclave.multiSystems = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                } 
                            }
                            workload.enclaves = enclave
                            break;
                        }
                        case "Service":{
                            const varlist = parts[c]["var-list"];
                
                            for (var vr in varlist[0]["var"]) {
                                switch (`${varlist[0]["var"][vr].name[0].trim()}`) {
                                    case "IOC": {
                                        service.ioc = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "CPU": {
                                        service.cpu = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "MSO": {
                                        service.mso = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "SRB": {
                                        service.srb = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "Total": {
                                        service.total = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "Per Second": {
                                        service.perSecond = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "Absorption Rate": {
                                        service.absorptionRate = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "Transaction Service Rate": {
                                        service.serviceRate = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }

                                } 
                            }
                            workload.service = service
                            break;
                        }
                        case "Service Time":{
                            const varlist = parts[c]["var-list"];
                
                            for (var vr in varlist[0]["var"]) {
                                switch (`${varlist[0]["var"][vr].name[0].trim()}`) {
                                    case "CPU": {
                                        st.cpu = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "SRB": {
                                        st.srb = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "RCT": {
                                        st.rct = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "I/O Interrupt": {
                                        st.ioInterrupts = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "Hiperspace": {
                                        st.hyperSpace = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "zIIP": {
                                        st.ziip = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "zAAP": {
                                        st.zaap = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                } 
                            }
                            workload.serviceTime = st
                            break;
                        }
                        case "Application Time %":{
                            const varlist = parts[c]["var-list"];
                
                            for (var vr in varlist[0]["var"]) {
                                switch (`${varlist[0]["var"][vr].name[0].trim()}`) {
                                    case "CP": {
                                        at.cp = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "zIIP on CP": {
                                        at.ziipOnCP = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "zIIP": {
                                        at.ziip = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "zAAP on CP": {
                                        at.zaapOnCP = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "zAAP": {
                                        at.zaap = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                } 
                            }
                            workload.applicationTime = at
                            break;
                        }
                        case "Promoted Transactions":{
                            const varlist = parts[c]["var-list"];
                
                            for (var vr in varlist[0]["var"]) {
                                switch (`${varlist[0]["var"][vr].name[0].trim()}`) {
                                    case "Blocked": {
                                        promoted.blocked = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "Enqueue": {
                                        promoted.enqueue = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "CRM": {
                                        promoted.crm = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "Lock": {
                                        promoted.lock = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "SUP": {
                                        promoted.sup = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                } 
                            }
                            workload.promotedTransaction = promoted
                            break;
                        }
                        case "DASD I/O":{
                            const varlist = parts[c]["var-list"];
                
                            for (var vr in varlist[0]["var"]) {
                                switch (`${varlist[0]["var"][vr].name[0].trim()}`) {
                                    case "SSCH/sec": {
                                        dasd.ssch = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "Response Time": {
                                        dasd.responseTime = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "Connect Time": {
                                        dasd.connectTime = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "Disconnect Time": {
                                        dasd.disconnectTime = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "Queue+Pending Time": {
                                        dasd.pendingTime = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "IOS Queue Time": {
                                        dasd.iosQueueTime = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                } 
                            }
                            workload.dasdIO = dasd
                            break;
                        }
                        case "Storage Frames":{
                            const varlist = parts[c]["var-list"];
                
                            for (var vr in varlist[0]["var"]) {
                                switch (`${varlist[0]["var"][vr].name[0].trim()}`) {
                                    case "Average": {
                                        frame.average = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "Total": {
                                        frame.total = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "Shared": {
                                        frame.shared = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                } 
                            }
                            workload.sharedFrames = frame
                            break;
                        }
                        case "Page-In Rates":{
                            const varlist = parts[c]["var-list"];
                
                            for (var vr in varlist[0]["var"]) {
                                switch (`${varlist[0]["var"][vr].name[0].trim()}`) {
                                    case "Single": {
                                        rates.single = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "Blocked": {
                                        rates.blocked = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "Shared": {
                                        rates.shared = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "Hiperspace": {
                                        rates.hyperSpace = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                } 
                            }
                            workload.pageInRates = rates
                            break;
                        }
                        case "Goals/Actuals Summary":{
                            const { table } = parts[c];
                            const tableBody = table[0].row;
                            const summaryList  = [];
                            for (var tb in tableBody) {
                                const summ:  Partial<wlmglInterface.Summary> = {};
                                
                                summ.period = parseFloat(tableBody[tb].col[0].trim());
                                summ.importance = parseFloat(tableBody[tb].col[1].trim());
                                summ.performanceIndex = parseFloat(tableBody[tb].col[2].trim());
                                summ.numberOfTransactions = parseFloat(tableBody[tb].col[3].trim());
                                summ.percentageOfTransactions = parseFloat(tableBody[tb].col[4].trim());
                                summ.responseTimeGoal = parseFloat(tableBody[tb].col[5].trim());
                                summ.responseTimeActual = parseFloat(tableBody[tb].col[6].trim());
                                summ.responseTimeTotal = parseFloat(tableBody[tb].col[7].trim());
                                summ.executionVelocityGoal = parseFloat(tableBody[tb].col[8].trim());
                                summ.executionVelocityActual = parseFloat(tableBody[tb].col[9].trim());
                                summ.totalUsing = parseFloat(tableBody[tb].col[10].trim());
                                summ.executionDelay = parseFloat(tableBody[tb].col[11].trim());
                                summaryList.push(summ);
                            
                            }
                            workload.goalSummary = summaryList
                            break;
                        }
                    } 
                }
              }
              allWorkload.push(workload)

            }else if(segmentName.trim() == "Service Policy Section"){
                let policy : Partial<wlmglInterface.Policy> = {}
                let definition: Partial<wlmglInterface.Definition> = {}
                let coefficients: Partial<wlmglInterface.Coefficients> = {}
                let system: Partial<wlmglInterface.Systems> = {}
                let factors: Partial<wlmglInterface.Factors> = {}
              
              for (const c in parts) {
                if(Object.keys(parts[c]).length > 1 ) { // The part has no childnodes
                    //var partName = parts[c]["name"][0].trim()
                    var partName;
                    try{
                        partName = parts[c]["name"][0].trim()
                    }catch(e){
                        partName = c
                    }
                    switch (`${partName}`) {
                        case "Service Definition":{
                            const varlist = parts[c]["var-list"];
                
                            for (var vr in varlist[0]["var"]) {
                                switch (`${varlist[0]["var"][vr].name[0].trim()}`) {
                                    case "Name": {
                                        definition.name = varlist[0]["var"][vr].value[0].trim();
                                        break;
                                    }
                                    case "Description": {
                                        definition.description = varlist[0]["var"][vr].value[0].trim();
                                        break;
                                    }
                                    case "Install Date": {
                                        definition.installDate = varlist[0]["var"][vr].value[0].trim();
                                        break;
                                    }
                                    case "Install Time": {
                                        definition.installTime = varlist[0]["var"][vr].value[0].trim();
                                        break;
                                    }
                                    case "Installed By": {
                                        definition.installedBy = varlist[0]["var"][vr].value[0].trim();
                                        break;
                                    }
                                    case "Policy": {
                                        definition.policy = varlist[0]["var"][vr].value[0].trim();
                                        break;
                                    }
                                    case "Policy Description": {
                                        definition.policyDescription = varlist[0]["var"][vr].value[0].trim();
                                        break;
                                    }
                                    case "Discretionary Goal Management": {
                                        definition.goalManagement = varlist[0]["var"][vr].value[0].trim();
                                        break;
                                    }
                                    case "Dynamic Alias Management": {
                                        definition.aliasManagement = varlist[0]["var"][vr].value[0].trim();
                                        break;
                                    }
                                    case "I/O Priority Management": {
                                        definition.priorityManagement = varlist[0]["var"][vr].value[0].trim();
                                        break;
                                    }
                                } 
                            }
                            policy.serviceDefinition = definition
                            break;
                        }
                        case "Service Definition Coefficients":{
                            const varlist = parts[c]["var-list"];
                
                            for (var vr in varlist[0]["var"]) {
                                switch (`${varlist[0]["var"][vr].name[0].trim()}`) {
                                    case "IOC": {
                                        coefficients.ioc = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "CPU": {
                                        coefficients.cpu = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "SRB": {
                                        coefficients.srb = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "MSO": {
                                        coefficients.mso = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }

                                } 
                            }
                            policy.serviceDefinitionCoefficients = coefficients
                            break;
                        }
                        case "Normalization Factors":{
                            const varlist = parts[c]["var-list"];
                
                            for (var vr in varlist[0]["var"]) {
                                switch (`${varlist[0]["var"][vr].name[0].trim()}`) {
                                    case "zAAP Normalization Factor": {
                                        factors.zaap = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "zIIP Normalization Factor": {
                                        factors.ziip = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }

                                } 
                            }
                            policy.normalizationFactors = factors
                            break;
                        }
                        case "Systems":{
                            const { table } = parts[c];
                            const tableBody = table[0].row;
                            const sysList  = [];
                            for (var tb in tableBody) {
                                const sys:  Partial<wlmglInterface.Systems> = {};
                                
                                sys.systemID = tableBody[tb].col[0].trim();
                                sys.member = parseFloat(tableBody[tb].col[1].trim());
                                sys.su = parseFloat(tableBody[tb].col[2].trim());
                                sys.capacity = parseFloat(tableBody[tb].col[3].trim());
                                sys.time = tableBody[tb].col[4].trim();
                                sys.interval =tableBody[tb].col[5].trim();
                                sys.boost = tableBody[tb].col[6].trim();
                                sysList.push(sys);
                            
                            }
                            policy.systems = sysList
                            break;
                        }

                    } 
                }
                
              }
              singleReport.servicePolicy = policy

            }
          }
          singleReport.serviceClass = allSC
          singleReport.workload = allWorkload
          finalJSON[a] = singleReport;
        }
        //console.log(finalJSON);
        return finalJSON;
    }catch(e){
        console.log(e);
        return e;
    }
}