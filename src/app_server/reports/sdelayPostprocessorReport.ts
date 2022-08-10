import * as sdelayInterface from "../Interfaces/sdelayInterface";

// Import xml2js library
const xml2js = require("xml2js");
const parser = new xml2js.Parser(); // Initialize xml2js parser
/**
 * parser for parsing RMF monitor I CPU report XML data to JSON
 * @param {string} xml - Workload XML data from RMF Monitor I
 */
export default async function parseSDELAY(xml) {
    try {
        const result = await parser.parseStringPromise(xml);
        const finalJSON = {}; // Collection for storing JSON of Parsed XML
        const postprocessors = result.ddsml.postprocessor;
        for (const a in postprocessors) {
          // Loop through postprocessor sections
          let singleReport: Partial<sdelayInterface.Sdelay> = {};
          const segments = postprocessors[a].segment;
          
          for (const b in segments) {
            var segmentName = segments[b].name[0];
            const parts = segments[b].part;
            if (segmentName.trim() == "Serialization Delay Summary") {
              const summary: Partial<sdelayInterface.Summary> = {}
              
              for (const c in parts) {
                if(Object.keys(parts[c]).length > 1 ) { // The part has no childnodes
                    var partName;
                    try{
                        partName = parts[c]["name"][0].trim()
                    }catch(e){
                        partName = "Null"
                    }
                    switch (`${partName}`) {
                        case "System Locks":{
                            const { table } = parts[c];
                            const tableBody = table[0].row;
                            const slList  = [];
                            for (var tb in tableBody) {
                                const lock:  Partial<sdelayInterface.Locks> = {};
                
                                lock.type = tableBody[tb].col[0].trim();
                                lock.totalContentionTime = parseFloat(tableBody[tb].col[1].trim());
                                lock.avgContentionTime = parseFloat(tableBody[tb].col[2].trim());
                                lock.totalContentionCount = parseFloat(tableBody[tb].col[3].trim());
                                lock.contentionCountWithQlen = parseFloat(tableBody[tb].col[4].trim());
                                slList.push(lock);
                            
                            }
                            summary.locks = slList
                            break;
                        }
                        case "GRS Latch Set Creator":{
                            const { table } = parts[c];
                            const tableBody = table[0].row;
                            const lList  = [];
                            for (var tb in tableBody) {
                                const creator:  Partial<sdelayInterface.Creator> = {};
                
                                
                                creator.totalContentionTime = parseFloat(tableBody[tb].col[0].trim());
                                creator.avgContentionTime = parseFloat(tableBody[tb].col[1].trim());
                                creator.stdDevContentionTime = parseFloat(tableBody[tb].col[2].trim());
                                creator.totalContentionCount = parseFloat(tableBody[tb].col[3].trim());
                                lList.push(creator);
                            
                            }
                            summary.setCreator = lList
                            break;
                        }
                        case "GRS Enqueue":{
                            const { table } = parts[c];
                            const tableBody = table[0].row;
                            const eList  = [];
                            for (var tb in tableBody) {
                                const enq:  Partial<sdelayInterface.Enqueue> = {};
                
                                enq.scope = tableBody[tb].col[0].trim();
                                enq.totalContentionTime = parseFloat(tableBody[tb].col[1].trim());
                                enq.avgContentionTime = parseFloat(tableBody[tb].col[2].trim());
                                enq.stdDevContentionTime = parseFloat(tableBody[tb].col[3].trim());
                                enq.totalRequestCount = parseFloat(tableBody[tb].col[4].trim());
                                enq.totalContentionCount = parseFloat(tableBody[tb].col[5].trim());
                                
                                eList.push(enq);
                            
                            }
                            summary.enqueue = eList
                            break;
                        }

                    } 
                }
                
              }
              
              singleReport.summary = summary

            }if (segmentName.trim() == "Serialization Delay Details") {
                const details: Partial<sdelayInterface.Details> = {}
              
                for (const c in parts) {
                    if(Object.keys(parts[c]).length > 1 ) {
                        var partName;
                        try{
                            partName = parts[c]["name"][0].trim()
                        }catch(e){
                            partName = "Null"
                        }
                        switch (`${partName}`) {
                            case "CML and Local Lock Details":{
                                const { table } = parts[c];
                                const tableBody = table[0].row;
                                const cmlList  = [];
                                for (var tb in tableBody) {
                                    const lock:  Partial<sdelayInterface.Local> = {};
                                    const lockowner:  Partial<sdelayInterface.Contention> = {};
                                    const lockLocal:  Partial<sdelayInterface.Contention> = {};
                                    const lockRequestor:  Partial<sdelayInterface.Contention> = {};

                    
                                    lock.addressSpace = tableBody[tb].col[0].trim();
                                    lock.jobName = tableBody[tb].col[1].trim();
                                    lock.serviceClassName = tableBody[tb].col[2].trim();
                                    lock.serviceClassPeriod = tableBody[tb].col[3].trim();
                                    lockowner.totalContentionTime = parseFloat(tableBody[tb].col[4].trim());
                                    lockowner.avgContentionTime = parseFloat(tableBody[tb].col[5].trim());
                                    lockowner.totalContentionCount = parseFloat(tableBody[tb].col[6].trim());
                                    lockowner.contentionCountWithQlen = parseFloat(tableBody[tb].col[7].trim());
                                    lockLocal.totalContentionTime = parseFloat(tableBody[tb].col[8].trim());
                                    lockLocal.avgContentionTime = parseFloat(tableBody[tb].col[9].trim());
                                    lockLocal.totalContentionCount = parseFloat(tableBody[tb].col[10].trim());
                                    lockLocal.contentionCountWithQlen = parseFloat(tableBody[tb].col[11].trim());
                                    lockRequestor.totalContentionTime = parseFloat(tableBody[tb].col[12].trim());
                                    lockRequestor.avgContentionTime = parseFloat(tableBody[tb].col[13].trim());
                                    lockRequestor.totalContentionCount = parseFloat(tableBody[tb].col[14].trim());
                                    lockRequestor.contentionCountWithQlen = parseFloat(tableBody[tb].col[15].trim());
                                    lock.cmlLockOwner = lockowner
                                    lock.localLock = lockLocal
                                    lock.cmlLockRequestor = lockRequestor
                                    cmlList.push(lock);
                                
                                }
                                details.cmlAndLocalLock = cmlList
                                break;
                            }
                            case "GRS Latch Details":{
                                const { table } = parts[c];
                                const tableBody = table[0].row;
                                const grsList  = [];
                                for (var tb in tableBody) {
                                    const latch:  Partial<sdelayInterface.GRS> = {};
                                    const latchCreator:  Partial<sdelayInterface.grsContention> = {};
                                    const latchRequestor:  Partial<sdelayInterface.grsContention> = {};

                    
                                    latch.addressSpace = tableBody[tb].col[0].trim();
                                    latch.jobName = tableBody[tb].col[1].trim();
                                    latch.serviceClassName = tableBody[tb].col[2].trim();
                                    latch.serviceClassPeriod = tableBody[tb].col[3].trim();
                                    latchCreator.totalContentionTime = parseFloat(tableBody[tb].col[4].trim());
                                    latchCreator.avgContentionTime = parseFloat(tableBody[tb].col[5].trim());
                                    latchCreator.stdDevContentionTime = parseFloat(tableBody[tb].col[6].trim());
                                    latchCreator.totalContentionCount = parseFloat(tableBody[tb].col[7].trim());
                                    latchRequestor.totalContentionTime = parseFloat(tableBody[tb].col[8].trim());
                                    latchRequestor.avgContentionTime = parseFloat(tableBody[tb].col[9].trim());
                                    latchRequestor.stdDevContentionTime = parseFloat(tableBody[tb].col[10].trim());
                                    latchRequestor.totalContentionCount = parseFloat(tableBody[tb].col[11].trim());
                                    latch.latchSetCreator = latchCreator
                                    latch.latchRequestor = latchRequestor
                                    grsList.push(latch);
                                
                                }
                                details.grsLatch = grsList
                                break;
                            }
                            case "GRS Enqueue Details":{
                                const { table } = parts[c];
                                const tableBody = table[0].row;
                                const grseList  = [];
                                for (var tb in tableBody) {
                                    const grse:  Partial<sdelayInterface.GRSE> = {};
                                    const enqStep:  Partial<sdelayInterface.grseContention> = {};
                                    const enqsystem:  Partial<sdelayInterface.grseContention> = {};
                                    const enqsystems:  Partial<sdelayInterface.grseContention> = {};

                    
                                    grse.addressSpace = tableBody[tb].col[0].trim();
                                    grse.jobName = tableBody[tb].col[1].trim();
                                    grse.serviceClassName = tableBody[tb].col[2].trim();
                                    grse.serviceClassPeriod = tableBody[tb].col[3].trim();
                                    enqStep.totalContentionTime = parseFloat(tableBody[tb].col[4].trim());
                                    enqStep.avgContentionTime = parseFloat(tableBody[tb].col[5].trim());
                                    enqStep.stdDevContentionTime = parseFloat(tableBody[tb].col[6].trim());
                                    enqStep.requestCount = parseFloat(tableBody[tb].col[7].trim());
                                    enqStep.contentionCount = parseFloat(tableBody[tb].col[8].trim());
                                    enqsystem.totalContentionTime = parseFloat(tableBody[tb].col[9].trim());
                                    enqsystem.avgContentionTime = parseFloat(tableBody[tb].col[10].trim());
                                    enqsystem.stdDevContentionTime = parseFloat(tableBody[tb].col[11].trim());
                                    enqsystem.requestCount = parseFloat(tableBody[tb].col[12].trim());
                                    enqsystem.contentionCount = parseFloat(tableBody[tb].col[13].trim());
                                    enqsystems.totalContentionTime = parseFloat(tableBody[tb].col[14].trim());
                                    enqsystems.avgContentionTime = parseFloat(tableBody[tb].col[15].trim());
                                    enqsystems.stdDevContentionTime = parseFloat(tableBody[tb].col[16].trim());
                                    enqsystems.requestCount = parseFloat(tableBody[tb].col[17].trim());
                                    enqsystems.contentionCount = parseFloat(tableBody[tb].col[18].trim());
                                    
                                    grse.enqStep = enqStep
                                    grse.enqSystem = enqsystem
                                    grse.enqSystems = enqsystems
                                    grseList.push(grse);
                                
                                }
                                details.grsEnqueue = grseList
                                break;
                            }
        
                        }

                    }
                }
                singleReport.details = details
            }
          }
          finalJSON[a] = singleReport;
        }
        //console.log(finalJSON);
        return finalJSON;
    }catch(e){
        console.log(e);
        return e;
    }
}