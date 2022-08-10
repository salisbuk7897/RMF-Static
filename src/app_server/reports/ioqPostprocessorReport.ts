import * as ioqInterface from "../Interfaces/rprtIoqInterface";

// Import xml2js library
const xml2js = require("xml2js");
const parser = new xml2js.Parser(); // Initialize xml2js parser
/**
 * parser for parsing RMF monitor I CPU report XML data to JSON
 * @param {string} xml - Workload XML data from RMF Monitor I
 */
export default async function parseIOQ(xml) {
    try {
        const result = await parser.parseStringPromise(xml);
        const finalJSON = {}; // Collection for storing JSON of Parsed XML
        const postprocessors = result.ddsml.postprocessor;
        for (const a in postprocessors) {
          
          // Loop through postprocessor sections
          let singleReport: Partial<ioqInterface.IOQ> = {};//segment number (b) as key and detals as value
          const segments = postprocessors[a].segment;
          
          for (const b in segments) {
            var segmentName = segments[b].name[0];
            const parts = segments[b].part;
            if (segmentName.trim() == "System Information") {
              const info: Partial<ioqInterface.Info> = {};
              
              for (const c in parts) {
                const varlist = parts[c]["var-list"];
                
                for (var vr in varlist[0]["var"]) {
                  switch (`${varlist[0]["var"][vr].name[0].trim()}`) {
                    case "IODF Name Suffix": {
                        info.iodfSuffix = varlist[0]["var"][vr].value[0].trim();
                        break;
                    }
                    case "IODF Creation Date": {
                        info.iodfDate = varlist[0]["var"][vr].value[0].trim();
                        break;
                    }
                    case "IODF Creation Time": {
                        info.iodfTime = varlist[0]["var"][vr].value[0].trim();
                        break;
                    }
                    case "Configuration State": {
                      info.configurationState = varlist[0]["var"][vr].value[0].trim();
                      break;
                    }
                    case "Total Samples": {
                      info.totalSamples = parseFloat(varlist[0]["var"][vr].value[0].trim());
                      break;
                    }
                  } 
                }
              }
              singleReport.systemInfo = info

            }else if(segmentName.trim() == "I/O Processor (IOP) Data"){
              for(const c in parts){
                const { table } = parts[c];
                const tableBody = table[0].row; //undefined 
                const mappingCollection: Record<string, Partial<ioqInterface.Processors>> = {};
                
                for (var tb in tableBody) {
                  const initiative: Partial<ioqInterface.Initiative> = {}
                  const utilization: Partial<ioqInterface.Utilization> = {}
                  const request: Partial<ioqInterface.request> = {}
                  const retry: Partial<ioqInterface.retry> = {}
                  const processors: Partial<ioqInterface.Processors> = {}
                  initiative.iop = parseFloat(tableBody[tb].col[0].trim());
                  initiative.activityRate = parseFloat(tableBody[tb].col[1].trim());
                  initiative.qLngth = parseFloat(tableBody[tb].col[2].trim());
                  utilization.iopBusy = parseFloat(tableBody[tb].col[3].trim());
                  utilization.cmprBusy = parseFloat(tableBody[tb].col[4].trim())
                  utilization.scmBusy = parseFloat(tableBody[tb].col[5].trim());
                  utilization.startRate = parseFloat(tableBody[tb].col[6].trim());
                  utilization.interruptRate = parseFloat(tableBody[tb].col[7].trim());
                  request.all = parseFloat(tableBody[tb].col[8].trim());
                  request.cpBusy = parseFloat(tableBody[tb].col[9].trim());
                  request.dpBusy = parseFloat(tableBody[tb].col[10].trim());
                  request.cuBusy = parseFloat(tableBody[tb].col[11].trim());
                  request.dvBusy = parseFloat(tableBody[tb].col[12].trim());
                  retry.all = parseFloat(tableBody[tb].col[13].trim());
                  retry.cpBusy = parseFloat(tableBody[tb].col[14].trim());
                  retry.dpBusy = parseFloat(tableBody[tb].col[15].trim());
                  retry.cuBusy = parseFloat(tableBody[tb].col[16].trim());
                  retry.dvBusy = parseFloat(tableBody[tb].col[17].trim());
                  processors.initiative = initiative
                  processors.utilization = utilization
                  processors.requestRetried = request
                  processors.retries = retry
                  mappingCollection[tb] = processors;
                  //mappingLogicalActivity.set(`${tableBody[tb].col[1]}`, logicalActivity);
                  
                }
                singleReport.processors = mappingCollection
              }
            }else if(segmentName.trim() == "Logical Control Unit (LCU) Data"){
              for(const c in parts){
                const { table } = parts[c];
                const tableBody = table[0].row;
                const mappingCollection: Record<string, Partial<ioqInterface.LCU>> = {};
                
                for (var tb in tableBody) {
                  const lcu: Partial<ioqInterface.LCU> = {};
                  const mgt: Partial<ioqInterface.Management> = {};
                  const ctrl: Partial<ioqInterface.Control> = {};
                  ctrl.amg = tableBody[tb].col[0].trim();
                  ctrl.lcu = tableBody[tb].col[1].trim();
                  ctrl.firstCU = parseFloat(tableBody[tb].col[2].trim());
                  ctrl.secondCU = parseFloat(tableBody[tb].col[3].trim());
                  ctrl.thirdCU = parseFloat(tableBody[tb].col[4].trim());
                  ctrl.fourthCU = parseFloat(tableBody[tb].col[5].trim());
                  ctrl.dcmGroupMin = parseFloat(tableBody[tb].col[6].trim());
                  ctrl.dcmGroupMax = parseFloat(tableBody[tb].col[7].trim());
                  ctrl.dcmGroupDefined = parseFloat(tableBody[tb].col[8].trim());
                  mgt.chanPaths = parseFloat(tableBody[tb].col[9].trim());
                  mgt.chanAttribute= parseFloat(tableBody[tb].col[10].trim());
                  mgt.status = tableBody[tb].col[11].trim();
                  mgt.chpidTaken = parseFloat(tableBody[tb].col[12].trim());
                  mgt.dpBusy = parseFloat(tableBody[tb].col[13].trim());
                  mgt.cuBusy = parseFloat(tableBody[tb].col[14].trim());
                  mgt.cubDly = parseFloat(tableBody[tb].col[15].trim());
                  mgt.cmrDly = parseFloat(tableBody[tb].col[16].trim());
                  mgt.contentionRate = parseFloat(tableBody[tb].col[17].trim());
                  mgt.qLngth = parseFloat(tableBody[tb].col[18].trim());
                  mgt.cssDly = parseFloat(tableBody[tb].col[19].trim());
                  mgt.hpavWait = parseFloat(tableBody[tb].col[20].trim());
                  mgt.hpavMax = parseFloat(tableBody[tb].col[21].trim());
                  mgt.openExch = parseFloat(tableBody[tb].col[22].trim());
                  mgt.dataTransferConc = parseFloat(tableBody[tb].col[23].trim());
                  lcu.controlUnits = ctrl
                  lcu.managementGroup = mgt
                  mappingCollection[tb] = lcu;
                  //mappingLogicalActivity.set(`${tableBody[tb].col[1]}`, logicalActivity);
                  
                }
                singleReport.logicalControlUnits = mappingCollection
              }

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