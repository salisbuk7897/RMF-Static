import * as vstorInterface from "../Interfaces/vstorInterface";

// Import xml2js library
const xml2js = require("xml2js");
const parser = new xml2js.Parser(); // Initialize xml2js parser
/**
 * parser for parsing RMF monitor I CPU report XML data to JSON
 * @param {string} xml - Workload XML data from RMF Monitor I
 */
export default async function parseVSTOR(xml) {
    try {
        const result = await parser.parseStringPromise(xml);
        const finalJSON = {}; // Collection for storing JSON of Parsed XML
        const postprocessors = result.ddsml.postprocessor;
        for (const a in postprocessors) {
          // Loop through postprocessor sections
          let singleReport: Partial<vstorInterface.Vstor> = {};
          const segments = postprocessors[a].segment;
          
          for (const b in segments) {
            var segmentName = segments[b].name[0];
            const parts = segments[b].part;
            if (segmentName.trim() == "Common Storage Summary") {
                const cs: Partial<vstorInterface.CS> = {}
              
              for (const c in parts) {
                if(Object.keys(parts[c]).length > 1 ) { // The part has no childnodes
                    var partName;
                    try{
                        partName = parts[c]["name"][0].trim()
                    }catch(e){
                        partName = "Null"
                    }
                    switch (`${partName}`) {
                        case "Static Storage Map":{
                            const { table } = parts[c];
                            const tableBody = table[0].row;
                            const mapList  = [];
                            for (var tb in tableBody) {
                                const mapp:  Partial<vstorInterface.Map> = {};
                
                                mapp.area = tableBody[tb].col[0].trim();
                                mapp.address = tableBody[tb].col[1].trim();
                                mapp.size = tableBody[tb].col[2].trim();
                                mapList.push(mapp);
                            
                            }
                            cs.staticStorageMap = mapList
                            break;
                        } case "Allocated CSA by Key": {
                            const { table } = parts[c];
                            const tableBody = table[0].row;
                            const abkList  = [];
                            for (var tb in tableBody) {
                                const csa:  Partial<vstorInterface.CSABK> = {};
                                const timeBelow:  Partial<vstorInterface.Time> = {};
                                const timeAbove:  Partial<vstorInterface.Time> = {};
                
                                csa.key = tableBody[tb].col[0].trim();
                                timeBelow.min = tableBody[tb].col[1].trim();
                                timeBelow.minTime = tableBody[tb].col[2].trim();
                                timeBelow.max = tableBody[tb].col[3].trim();
                                timeBelow.maxTime = tableBody[tb].col[4].trim();
                                timeBelow.avg = tableBody[tb].col[5].trim();
                                timeAbove.min = tableBody[tb].col[6].trim();
                                timeAbove.minTime = tableBody[tb].col[7].trim();
                                timeAbove.max = tableBody[tb].col[8].trim();
                                timeAbove.maxTime = tableBody[tb].col[9].trim();
                                timeAbove.avg = tableBody[tb].col[10].trim();
                                csa.below16M = timeBelow
                                csa.above16M = timeAbove
                                abkList.push(csa);
                            
                            }
                            cs.allocatedCSAbyKey = abkList
                            break;
                        } case "Allocated SQA" : {
                            const { table } = parts[c];
                            const tableBody = table[0].row;
                            const sqaList  = [];
                            for (var tb in tableBody) {
                                const csa:  Partial<vstorInterface.SQA> = {};
                                const timeBelow:  Partial<vstorInterface.Time> = {};
                                const timeAbove:  Partial<vstorInterface.Time> = {};
                
                                csa.area = tableBody[tb].col[0].trim();
                                timeBelow.min = tableBody[tb].col[1].trim();
                                timeBelow.minTime = tableBody[tb].col[2].trim();
                                timeBelow.max = tableBody[tb].col[3].trim();
                                timeBelow.maxTime = tableBody[tb].col[4].trim();
                                timeBelow.avg = tableBody[tb].col[5].trim();
                                timeAbove.min = tableBody[tb].col[6].trim();
                                timeAbove.minTime = tableBody[tb].col[7].trim();
                                timeAbove.max = tableBody[tb].col[8].trim();
                                timeAbove.maxTime = tableBody[tb].col[9].trim();
                                timeAbove.avg = tableBody[tb].col[10].trim();
                                csa.below16M = timeBelow
                                csa.above16M = timeAbove
                                sqaList.push(csa);
                            
                            }
                            cs.allocatedSQA = sqaList
                            break;
                        } case "CSA/SQA Free Space": {
                            const fs: Partial<vstorInterface.FreeSpace> = {}
                                
                            const varlist = parts[c]["var-list"];
                
                            for (var vr in varlist[0]["var"]) {
                                switch (`${varlist[0]["var"][vr].name[0].trim()}`) {
                                    case "Maximum possible user region below 16M": {
                                        fs.userRegionBelow16m = `${varlist[0]["var"][vr].value[0].trim()}`;
                                        break;
                                    }
                                    case "Maximum possible user region above 16M": {
                                        fs.userRegionAbove16m = `${varlist[0]["var"][vr].value[0].trim()}`;
                                        break;
                                    }
                                } 
                            }
                            cs.freeSpace = fs;
                            break;
                        } case "PLPA" : {
                            const plpa: Partial<vstorInterface.PLPA> = {}
                                
                            const varlist = parts[c]["var-list"];
                
                            for (var vr in varlist[0]["var"]) {
                                switch (`${varlist[0]["var"][vr].name[0].trim()}`) {
                                    case "PLPA intermodule space in PLPA": {
                                        plpa.plpaSpace = `${varlist[0]["var"][vr].value[0].trim()}`;
                                        break;
                                    }
                                    case "PLPA intermodule space in EPLPA": {
                                        plpa.eplpaSpace = `${varlist[0]["var"][vr].value[0].trim()}`;
                                        break;
                                    }
                                    case "PLPA space redundant with MLPA/FLPA in PLPA": {
                                        plpa.plpaRedundantSpace = `${varlist[0]["var"][vr].value[0].trim()}`;
                                        break;
                                    }
                                    case "PLPA space redundant with MLPA/FLPA in EPLPA": {
                                        plpa.eplpaRedundantSpace = `${varlist[0]["var"][vr].value[0].trim()}`;
                                        break;
                                    }
                                } 
                            }
                            cs.plpa = plpa;
                            break;
                        }

                    } 
                }
                
              }
              
              singleReport.commonStorage = cs

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