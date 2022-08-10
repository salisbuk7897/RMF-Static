import * as cpuInterface from "../Interfaces/cpuInterface";

const xml2js = require("xml2js");
// Import xml2js library
const parser = new xml2js.Parser(); // Initialize xml2js parser

function intFourSegment(string) {
  var parts = string.split(".");

  let part1= parseInt(parts[0], 10);
  let part2= parseInt(parts[1], 10);
  let part3= parseInt(parts[2], 10);
  let part4= parseInt(parts[3], 10);

return part1 + "." + part2 + "." + part3 + "." + part4;
}

/**
 * parser for parsing RMF monitor I CPU report XML data to JSON
 * @param {string} xml - Workload XML data from RMF Monitor I
 */
export default async function parseCPU(xml) {
  try {
    const result = await parser.parseStringPromise(xml);
    const finalJSON = {}; // Collection for storing JSON of Parsed XML
    const postprocessors = result.ddsml.postprocessor;
    for (const a in postprocessors) {
      
      // Loop through postprocessor sections
      let singleReport: Partial<cpuInterface.cpuReport> = {};
      const segments = postprocessors[a].segment;
      //const resourceName = postprocessors[a].resource[0].resname[0];
      //const reportId = postprocessors[a].metric[0].$.id;
      //const allSegmentCollection = {};
      const cpuActivity: Partial<cpuInterface.CPUActivity> = {}; // initialze the cpuActivity collection as defined in the interface
      const partitionData: Partial<cpuInterface.PartitionDataReport> = {};
      for (const b in segments) {
        // Loop through segment sections
        const parts = segments[b].part;
        const segmentName = segments[b].name[0];
        //const { message } = segments[b]; // represent segment message value in the XML
        if (segmentName == "CPU Activity") {
          // check for cpu activity segment of the report
          const hardware: Partial<cpuInterface.CPUHardware> = {}; // the harware details collection as defined in the interface
          const systemAddressQueue: Partial<cpuInterface.SystemAddressQueue> = {};
          const systemAddress: Partial<cpuInterface.SystemAddress> = {};
          const systemAddressSpace: Partial<cpuInterface.SystemAddressSpace> = {};
          const workUnit: Partial<cpuInterface.WorkUnit> = {};
          const blockWorkload: Partial<cpuInterface.BlockWorkload> = {};
          // let logicalActivity: LogicalActivity = {} // the logical activity collection as specified in the interface
          for (const c in parts) {
            // Loop through part sections
            //const partName = parts[c].name;
            const varlist = parts[c]["var-list"];
            const { table } = parts[c];
            switch (c.toString()) {
              case "0": {
                // firts part of the CPU segment
                for (var vr in varlist[0]["var"]) {
                  switch (`${varlist[0]["var"][vr].name[0]}`) {
                    case "CPU": {
                      hardware.cpu = varlist[0]["var"][vr].value[0];
                      break;
                    }
                    case "Model": {
                      hardware.model = varlist[0]["var"][vr].value[0];
                      break;
                    }
                    case "H/W Model": {
                      hardware.hwModel = varlist[0]["var"][vr].value[0];
                      break;
                    }
                    case "Sequence Code": {
                      hardware.sequence = varlist[0]["var"][vr].value[0];
                      break;
                    }
                    case "CPC Capacity": {
                      cpuActivity.cpcCapacity = parseInt(varlist[0]["var"][vr].value[0]);
                      break;
                    }
                    case "Change Reason": {
                      cpuActivity.changeReason = varlist[0]["var"][vr].value[0];
                      break;
                    }
                    case "HiperDispatch": {
                      cpuActivity.hiperdispatch = varlist[0]["var"][vr].value[0];
                      break;
                    }
                    case "Boost Type": {
                      cpuActivity.boostType = varlist[0]["var"][vr].value[0];
                      break;
                    }
                    case "Boost Class": {
                      cpuActivity.boostClass = varlist[0]["var"][vr].value[0];
                      break;
                    }
                  } 
                }
                cpuActivity.hardware = hardware;
                const tableBody = table[0].row;
                const mappingCollection: Record<string, Partial<cpuInterface.LogicalActivity>> = {};
                for (var tb in tableBody) {
                  // loop through tablebody to fill logicalactivity collection
                  const logicalActivity: Partial<cpuInterface.LogicalActivity> = {}; // the logical activity collection as specified in the interface
                  logicalActivity.cpuNumber = tableBody[tb].col[0];
                  logicalActivity.online = parseInt(tableBody[tb].col[2]);
                  logicalActivity.lparBusy = parseInt(tableBody[tb].col[3]);
                  logicalActivity.mvsBusy = parseInt(tableBody[tb].col[4]);
                  logicalActivity.parked = parseInt(tableBody[tb].col[5]);
                  logicalActivity.procShare = parseInt(tableBody[tb].col[6]);
                  logicalActivity.hiperdispatchPriority = tableBody[tb].col[7];
                  logicalActivity.ioInterrupts = parseInt(tableBody[tb].col[8]);
                  logicalActivity.tpiInterrupts = parseInt(tableBody[tb].col[9]);
                  mappingCollection[tableBody[tb].col[1]] = logicalActivity;
                  //mappingLogicalActivity.set(`${tableBody[tb].col[1]}`, logicalActivity);
                  
                }
                cpuActivity.logical = mappingCollection // add logical activity collection to cpuActivity using cpu type as key
                break;
              }case "1": {
                // system address space part
                const tableBody = table[0].row;
                for (tb in tableBody) {
                  // loop through tablebody to fill logicalactivity collection
                  const statSummary: Partial<cpuInterface.StatSummary> = {};
                  switch (`${tableBody[tb].col[0]}`) {
                    case "IN Queue": {
                      statSummary.min = parseInt(tableBody[tb].col[1]);
                      statSummary.max = parseInt(tableBody[tb].col[2]);
                      statSummary.avg = parseInt(tableBody[tb].col[3]);
                      systemAddressQueue.in = statSummary;
                      break;
                    }
                    case "IN READY Queue": {
                      statSummary.min = parseInt(tableBody[tb].col[1]);
                      statSummary.max = parseInt(tableBody[tb].col[2]);
                      statSummary.avg = parseInt(tableBody[tb].col[3]);
                      systemAddressQueue.inReady = statSummary;
                      break;
                    }
                    case "OUT READY Queue": {
                      statSummary.min = parseInt(tableBody[tb].col[1]);
                      statSummary.max = parseInt(tableBody[tb].col[2]);
                      statSummary.avg = parseInt(tableBody[tb].col[3]);
                      systemAddressQueue.outReady = statSummary;
                      break;
                    }
                    case "OUT WAIT Queue": {
                      statSummary.min = parseInt(tableBody[tb].col[1]);
                      statSummary.max = parseInt(tableBody[tb].col[2]);
                      statSummary.avg = parseInt(tableBody[tb].col[3]);
                      systemAddressQueue.outWait = statSummary;
                      break;
                    }
                    case "LOGICAL OUT READY Queue": {
                      statSummary.min = parseInt(tableBody[tb].col[1]);
                      statSummary.max = parseInt(tableBody[tb].col[2]);
                      statSummary.avg = parseInt(tableBody[tb].col[3]);
                      systemAddressQueue.logicalOutReady = statSummary;
                      break;
                    }
                    case "LOGICAL OUT WAIT Queue": {
                      statSummary.min = parseInt(tableBody[tb].col[1]);
                      statSummary.max = parseInt(tableBody[tb].col[2]);
                      statSummary.avg = parseInt(tableBody[tb].col[3]);
                      systemAddressQueue.logicalOutWait = statSummary;
                      break;
                    }
                    case "BATCH Address Spaces": {
                      statSummary.min = parseInt(tableBody[tb].col[1]);
                      statSummary.max = parseInt(tableBody[tb].col[2]);
                      statSummary.avg = parseInt(tableBody[tb].col[3]);
                      systemAddressSpace.batch = statSummary;
                      break;
                    }
                    case "STC Address Spaces": {
                      statSummary.min = parseInt(tableBody[tb].col[1]);
                      statSummary.max = parseInt(tableBody[tb].col[2]);
                      statSummary.avg = parseInt(tableBody[tb].col[3]);
                      systemAddressSpace.stc = statSummary;
                      break;
                    }
                    case "TSO Address Spaces": {
                      statSummary.min = parseInt(tableBody[tb].col[1]);
                      statSummary.max = parseInt(tableBody[tb].col[2]);
                      statSummary.avg = parseInt(tableBody[tb].col[3]);
                      systemAddressSpace.tso = statSummary;
                      break;
                    }
                    case "ASCH Address Spaces": {
                      statSummary.min = parseInt(tableBody[tb].col[1]);
                      statSummary.max = parseInt(tableBody[tb].col[2]);
                      statSummary.avg = parseInt(tableBody[tb].col[3]);
                      systemAddressSpace.asch = statSummary;
                      break;
                    }
                    case "OMVS Address Spaces": {
                      statSummary.min = parseInt(tableBody[tb].col[1]);
                      statSummary.max = parseInt(tableBody[tb].col[2]);
                      statSummary.avg = parseInt(tableBody[tb].col[3]);
                      systemAddressSpace.omvs = statSummary;
                      break;
                    }
                  }
                }
                systemAddress.queue = systemAddressQueue; // push systemAddressQueue collection to systemAddress collection
                systemAddress.space = systemAddressSpace; // push systemAddressSpace collection to systemAddress collection
                cpuActivity.addressSpace = systemAddress; // add logical systemAddress collection to cpuActivity
                break;
              }case "2": { //Distribution of In-ready Work Unit Queue
                const workUnitdistribution : Partial<cpuInterface.WorkUnitDistribution> = {};
                const tableBody = table[0].row;
                for (tb in tableBody) {
                  switch (`${tableBody[tb].col[0]}`) {
                    case "<=N" : {
                      workUnitdistribution["<=N"] = parseInt(tableBody[tb].col[1]);
                      break;
                    }case "=N+1" : {
                      workUnitdistribution["=N+1"] = parseInt(tableBody[tb].col[1]);
                      break;
                    }case "=N+2" : {
                      workUnitdistribution["=N+2"] = parseInt(tableBody[tb].col[1]);
                      break;
                    }case "=N+3" : {
                      workUnitdistribution["=N+3"] = parseInt(tableBody[tb].col[1]);
                      break;
                    }case "<=N+5" : {
                      workUnitdistribution["<=N+5"] = parseInt(tableBody[tb].col[1]);
                      break;
                    }case "<=N+10" : {
                      workUnitdistribution["<=N+10"] = parseInt(tableBody[tb].col[1]);
                      break;
                    }case "<=N+15" : {
                      workUnitdistribution["<=N+15"] = parseInt(tableBody[tb].col[1]);
                      break;
                    }case "<=N+20" : {
                      workUnitdistribution["<=N+20"] = parseInt(tableBody[tb].col[1]);
                      break;
                    }case "<=N+30" : {
                      workUnitdistribution["<=N+30"] = parseInt(tableBody[tb].col[1]);
                      break;
                    }case "<=N+40" : {
                      workUnitdistribution["<=N+40"] = parseInt(tableBody[tb].col[1]);
                      break;
                    }case "<=N+60" : {
                      workUnitdistribution["<=N+60"] = parseInt(tableBody[tb].col[1]);
                      break;
                    }case "<=N+80" : {
                      workUnitdistribution["<=N+80"] = parseInt(tableBody[tb].col[1]);
                      break;
                    }case "<=N+80" : {
                      workUnitdistribution["<=N+80"] = parseInt(tableBody[tb].col[1]);
                      break;
                    }case "<=N+100" : {
                      workUnitdistribution["<=N+100"] = parseInt(tableBody[tb].col[1]);
                      break;
                    }case "<=N+120" : {
                      workUnitdistribution["<=N+120"] = parseInt(tableBody[tb].col[1]);
                      break;
                    }case "<=N+150" : {
                      workUnitdistribution["<=N+150"] = parseInt(tableBody[tb].col[1]);
                      break;
                    }case ">N+150" : {
                      workUnitdistribution[">N+150"] = parseInt(tableBody[tb].col[1]);
                      break;
                    }
                  }
                }
                workUnit.distribution = workUnitdistribution;
                break;
              }case "3": {//Work Unit Analysis
                const tableBody = table[0].row;
                const mappingCollection: Record<string, Partial<cpuInterface.StatSummary>> = {};
                for (tb in tableBody) {
                  // loop through tablebody to fill logicalactivity collection
                  const statSummary: Partial<cpuInterface.StatSummary> = {};
                  
                  statSummary.min = parseInt(tableBody[tb].col[1]);
                  statSummary.max = parseInt(tableBody[tb].col[2]);
                  statSummary.avg = parseInt(tableBody[tb].col[3]);
                  mappingCollection[tableBody[tb].col[0]] = statSummary;
                }
                console.log(mappingCollection);
                workUnit.analysis = mappingCollection;
                cpuActivity.workUnit = workUnit;
                break;
              } case "4": {//Blocked Workload Analysis
                const blockedWorkloadOpt: Partial<cpuInterface.BlockedWorkloadOpt> = {};
                const blockedWorkloadPromoteRate: Partial<cpuInterface.BlockedWorkloadPromoteRate> = {};
                const blockedWorkloadWaiters: Partial<cpuInterface.BlockedWorkloadWaiters> = {};
                for (const vr in varlist[0]["var"]) {
                  switch (`${varlist[0]["var"][vr].name[0]}`) {
                    case "OPT Parameter: BLWLTRPCT (%)": {
                      blockedWorkloadOpt.percent = parseInt(varlist[0]["var"][vr].value[0]);
                      break;
                    }case "OPT Parameter: BLWLINTHD": {
                      blockedWorkloadOpt.threshold = parseInt(varlist[0]["var"][vr].value[0]);
                      break;
                    }case "Promote Rate Defined": {
                      blockedWorkloadPromoteRate.defined = parseInt(varlist[0]["var"][vr].value[0]);
                      break;
                    }case "Promote Rate Used(%)": {
                      blockedWorkloadPromoteRate.used = parseInt(varlist[0]["var"][vr].value[0]);
                      break;
                    }case "Avg Waiters for Promote": {
                      blockedWorkloadWaiters.avg = parseInt(varlist[0]["var"][vr].value[0]);
                      break;
                    }case "Peak Waiters for Promote": {
                      blockedWorkloadWaiters.peak = parseInt(varlist[0]["var"][vr].value[0]);
                      break;
                    }
                  }
                }
                blockWorkload.optParams = blockedWorkloadOpt;
                blockWorkload.promoteRate = blockedWorkloadPromoteRate;
                blockWorkload.waiters = blockedWorkloadWaiters;
                cpuActivity.blockedWorkload = blockWorkload;
                break;
              }
            }
          }
        } else if (segmentName == "Partition Data Report") {
          // check for partition data report section
          const capacityGroup: Partial<cpuInterface.CapacityGroup> = {}
          const cappingInfo: Partial<cpuInterface.CappingInfo> = {}
          const partition: Partial<cpuInterface.Partition> = {}
          for (const c in parts) {
            // Loop through part sections
            //const partName = parts[c].name;
            const varlist = parts[c]["var-list"];
            const { table } = parts[c];
            switch (c.toString()) {
              case "0": {
                for (var vr in varlist[0]["var"]) {
                  switch (`${varlist[0]["var"][vr].name[0]}`) {
                    case "MVS Partition Name": {
                      partitionData.mvsPartition = varlist[0]["var"][vr].value[0];
                      break;
                    }
                    case "Image Capacity": {
                      partitionData.imageCapacity = parseInt(varlist[0]["var"][vr].value[0]);
                      break;
                    }
                    case "Number of Configured Partitions": {
                      partitionData.configuredPartitions = parseInt(varlist[0]["var"][vr].value[0]);
                      break;
                    }
                    case "Wait Completion": {
                      partitionData.waitCompletion = varlist[0]["var"][vr].value[0];
                      break;
                    }
                    case "Dispatch Interval": {
                      partitionData.dispatchInterval = varlist[0]["var"][vr].value[0];
                      break;
                    }
                    case "Group Name": {
                      capacityGroup.name = varlist[0]["var"][vr].value[0];
                      break;
                    }
                    case "Group Limit": {
                      capacityGroup.limit = varlist[0]["var"][vr].value[0] == "N/A" ? "N/A" : parseInt(varlist[0]["var"][vr].value[0]);
                      break;
                    }
                    case "Group Capacity Available": {
                      capacityGroup.available = varlist[0]["var"][vr].value[0] == "N/A" ? "N/A" : parseInt(varlist[0]["var"][vr].value[0]);
                      break;
                    }
                    case "Initial Capping": {
                      cappingInfo.initial = varlist[0]["var"][vr].value[0]; 
                      break;
                    }
                    case "LPAR Hardware Capping": {
                      cappingInfo.lparHardware = varlist[0]["var"][vr].value[0];
                      break;
                    }
                    case "Hardware Group Capping": {
                      cappingInfo.lparHardware = varlist[0]["var"][vr].value[0];
                      break;
                    }
                    case "Absolute MSU Capping": {
                      cappingInfo.msu = varlist[0]["var"][vr].value[0];
                      break;
                    }
                  } 
                }
                partitionData.group = capacityGroup;
                partitionData.capping = cappingInfo;
              } case "1": {
                // not covered in interface
                break;
              } case "2": {
                const pList: Partial<cpuInterface.Partition>[] = [];
                const mappingCollection: Record<string, Partial<cpuInterface.Partition>> = {};
                const tableBody = table[0].row;
                for (tb in tableBody) {
                  const partition: Partial<cpuInterface.Partition> = {};
                  const partitionWeight: Partial<cpuInterface.PartitionWeight> = {};
                  const partitionMSU: Partial<cpuInterface.PartitionMSU> = {};
                  const partitionCapping: Partial<cpuInterface.PartitionCapping> = {};
                  const partitionProcessor: Partial<cpuInterface.PartitionProcessor> = {};
                  const partitionDispatch: Partial<cpuInterface.PartitionDispatch> = {};
                  const partitionUtil: Partial<cpuInterface.PartitionUtil> = {};
                  const partitionUtilLogical: Partial<cpuInterface.PartitionUtilLogical> = {};
                  const partitionUtilPhysical: Partial<cpuInterface.PartitionUtilPhysical> = {};
                  
                  //partition.name = tableBody[tb].col[0];
                  partition.active = tableBody[tb].col[1] == "Active" ? true : false;
                  partition.boost = tableBody[tb].col[2];
                  partitionWeight.weight = parseInt(tableBody[tb].col[3]);
                  partition.weight = partitionWeight;
                  partitionMSU.defined = parseInt(tableBody[tb].col[4]);
                  partitionMSU.actual = parseInt(tableBody[tb].col[5]);
                  partition.msu = partitionMSU;
                  partitionCapping.defined = tableBody[tb].col[6]//parseInt(tableBody[tb].col[6]) == null ? tableBody[tb].col[6] : parseInt(tableBody[tb].col[6]);
                  partitionCapping.wlm = parseInt(tableBody[tb].col[7]);
                  partition.capping = partitionCapping;
                  partitionProcessor.logicalProcs = parseInt(tableBody[tb].col[8]);
                  partitionProcessor.type = tableBody[tb].col[9];
                  partition.processor = partitionProcessor;
                  partitionDispatch.effective = tableBody[tb].col[10]//intFourSegment(tableBody[tb].col[10])//parseFloat(tableBody[tb].col[10]);
                  partitionDispatch.total = tableBody[tb].col[11]//parseFloat(tableBody[tb].col[11]);
                  partition.dispatch = partitionDispatch;
                  partitionUtilLogical.effective = parseFloat(tableBody[tb].col[12]);
                  partitionUtilLogical.effective = parseFloat(tableBody[tb].col[13]);
                  partitionUtilPhysical.lparMgmt = parseFloat(tableBody[tb].col[14]);
                  partitionUtilPhysical.effective = parseFloat(tableBody[tb].col[15]);
                  partitionUtilPhysical.total = parseFloat(tableBody[tb].col[16]);
                  partitionUtil.logical = partitionUtilLogical;
                  partitionUtil.physical = partitionUtilPhysical;
                  partition.util = partitionUtil;
                  //pList.push(partition);
                  mappingCollection[tableBody[tb].col[0]] = partition;
                }
                partitionData.partitions = mappingCollection; //pList;
              }
            }
          }
        }
      }
      singleReport.activity = cpuActivity;
      singleReport.partitionData = partitionData;
      finalJSON[a] = singleReport;
      break;
    }
    return finalJSON;
  } catch (e) {}
}
