import * as chanInterface from "../Interfaces/chanInterface";

// Import xml2js library
const xml2js = require("xml2js");
const parser = new xml2js.Parser(); // Initialize xml2js parser
/**
 * parser for parsing RMF monitor I CPU report XML data to JSON
 * @param {string} xml - Workload XML data from RMF Monitor I
 */
export default async function parseCHAN(xml) {
    try {
        const result = await parser.parseStringPromise(xml);
        const finalJSON = {}; // Collection for storing JSON of Parsed XML
        const postprocessors = result.ddsml.postprocessor;
        for (const a in postprocessors) {
          
          // Loop through postprocessor sections
          let singleReport: Partial<chanInterface.Chan> = {};//segment number (b) as key and detals as value
          const segments = postprocessors[a].segment;
          
          for (const b in segments) {
            var segmentName = segments[b].name[0];
            const parts = segments[b].part;
            if (segmentName == "System Information") {
              const info: Partial<chanInterface.Info> = {};
              
              for (const c in parts) {
                const varlist = parts[c]["var-list"];
                
                for (var vr in varlist[0]["var"]) {
                  switch (`${varlist[0]["var"][vr].name[0]}`) {
                    case "IODF Name Suffix": {
                        info.iodfSuffix = varlist[0]["var"][vr].value[0];
                        break;
                    }
                    case "IODF Creation Date": {
                        info.iodfDate = varlist[0]["var"][vr].value[0];
                        break;
                    }
                    case "IODF Creation Time": {
                        info.iodfTime = varlist[0]["var"][vr].value[0];
                        break;
                    }
                    case "Configuration State": {
                      info.configurationState = varlist[0]["var"][vr].value[0];
                      break;
                    }
                    case "CPC Mode": {
                        info.cpcModel = varlist[0]["var"][vr].value[0];
                        break;
                    }
                    case "CPMF Mode": {
                        info.cpmfMode = varlist[0]["var"][vr].value[0];
                        break;
                    }
                    case "CSSID": {
                      info.cssid = parseInt(varlist[0]["var"][vr].value[0]);
                      break;
                    }
                  } 
                }
              }
              singleReport.systemInfo = info

            }else if(segmentName == "Details for all Channels"){
              for(const c in parts){
                const { table } = parts[c];
                const tableBody = table[0].row; //undefined 
                const mappingCollection = [];
                
                for (var tb in tableBody) {
                  const allChannels: Partial<chanInterface.AllChannels> = {};
                  const channelPath: Partial<chanInterface.cPath> = {};
                  const util: Partial<chanInterface.Util> = {};
                  const read: Partial<chanInterface.Read> = {};
                  const write: Partial<chanInterface.Write> = {};
                  const ficon: Partial<chanInterface.Ficon> = {};
                  const zhpf: Partial<chanInterface.ZHPF> = {};
                  const ids: Partial<chanInterface.IDS> = {};
                  channelPath.id = tableBody[tb].col[0];
                  channelPath.type = tableBody[tb].col[1];
                  channelPath.G = parseInt(tableBody[tb].col[2]);
                  channelPath.speed = parseInt(tableBody[tb].col[3]);
                  channelPath.SHR = tableBody[tb].col[4];
                  channelPath.status = tableBody[tb].col[5];
                  util.lpar = parseInt(tableBody[tb].col[6]);
                  util.total = parseInt(tableBody[tb].col[7]);
                  util.bus = parseInt(tableBody[tb].col[8]);
                  read.lpar = parseInt(tableBody[tb].col[9]);
                  read.total= parseInt(tableBody[tb].col[10]);
                  write.lpar = parseInt(tableBody[tb].col[11]);
                  write.total = parseInt(tableBody[tb].col[12]);
                  ficon.rate = parseInt(tableBody[tb].col[13]);
                  ficon.active = parseInt(tableBody[tb].col[14]);
                  ficon.defer = parseInt(tableBody[tb].col[15]);
                  zhpf.rate = parseInt(tableBody[tb].col[16]);
                  zhpf.active = parseInt(tableBody[tb].col[17]);
                  zhpf.defer = parseInt(tableBody[tb].col[18]);
                  ids.port1 = tableBody[tb].col[19];
                  ids.port2= tableBody[tb].col[20];
                  allChannels.channelPath = channelPath
                  allChannels.utilization = util
                  allChannels.read = read
                  allChannels.write = write
                  allChannels.ficonOperations = ficon
                  allChannels.ZHPFOperations = zhpf
                  allChannels.physicalNetworkIDS = ids
                  mappingCollection[tb] = allChannels;
                  //mappingLogicalActivity.set(`${tableBody[tb].col[1]}`, logicalActivity);
                  
                }
                singleReport.allChannels = mappingCollection
              }
            }else if(segmentName == "Details for HiperSockets"){
              for(const c in parts){
                const { table } = parts[c];
                const tableBody = table[0].row;
                const mappingCollection = [];
                
                for (var tb in tableBody) {
                  const hiperSocket: Partial<chanInterface.HiperSocket> = {};
                  const channelPath: Partial<chanInterface.cPath> = {};
                  const rate: Partial<chanInterface.Rate> = {};
                  const size: Partial<chanInterface.Size> = {};
                  const sFail: Partial<chanInterface.sFail> = {};
                  const rFail: Partial<chanInterface.rFail> = {};
                  channelPath.id = tableBody[tb].col[0];
                  channelPath.type = tableBody[tb].col[1];
                  channelPath.G = parseInt(tableBody[tb].col[2]);
                  channelPath.speed = parseInt(tableBody[tb].col[3]);
                  channelPath.status = tableBody[tb].col[4];
                  //channelPath.status = tableBody[tb].col[5];
                  //util.lpar = parseInt(tableBody[tb].col[6]);
                  rate.lpar = parseInt(tableBody[tb].col[7]);
                  rate.total = parseInt(tableBody[tb].col[8]);
                  size.lpar = parseInt(tableBody[tb].col[9]);
                  size.total= parseInt(tableBody[tb].col[10]);
                  sFail.lpar = parseInt(tableBody[tb].col[11]);
                  rFail.lpar = parseInt(tableBody[tb].col[12]);
                  rFail.total = parseInt(tableBody[tb].col[13]);
                  hiperSocket.physical = tableBody[tb].col[14];
                  hiperSocket.channelPath = channelPath
                  hiperSocket.messageRate = rate
                  hiperSocket.messageSize = size
                  hiperSocket.sendFail = sFail
                  hiperSocket.receiveFail = rFail
                  mappingCollection[tb] = hiperSocket;
                  //mappingLogicalActivity.set(`${tableBody[tb].col[1]}`, logicalActivity);
                  
                }
                singleReport.hiperSocket = mappingCollection
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