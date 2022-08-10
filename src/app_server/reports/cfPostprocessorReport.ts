import * as cfInterface from "../Interfaces/rprtCfInterface";

// Import xml2js library
const xml2js = require("xml2js");
const parser = new xml2js.Parser(); // Initialize xml2js parser
/**
 * parser for parsing RMF monitor I CPU report XML data to JSON
 * @param {string} xml - Workload XML data from RMF Monitor I
 */
export default async function parseCF(xml) {
    try {
        const result = await parser.parseStringPromise(xml);
        const finalJSON = {}; // Collection for storing JSON of Parsed XML
        const postprocessors = result.ddsml.postprocessor;
        for (const a in postprocessors) {
          
          // Loop through postprocessor sections
          let singleReport: Partial<cfInterface.RPRTCF> = {};//segment number (b) as key and detals as value
          const segments = postprocessors[a].segment;
          
          for (const b in segments) {
            const rprtCF: Partial<cfInterface.RPRTCF> = {}; 
            const usage: Partial<cfInterface.Usage> = {};
            const samples: Partial<cfInterface.Samples> = {}; 
            const facility: Partial<cfInterface.Facility> = {}; 
            const processor: Partial<cfInterface.Processors> = {};
            var segmentName = segments[b].name[0];
            const parts = segments[b].part;
            rprtCF.name = segmentName;
            
            for (const c in parts) {
                //console.log();
                if(Object.keys(parts[c]).length > 1 ) { // The part has no childnodes
                    var partName = parts[c]["name"][0]
                    const varlist = parts[c]["var-list"];
                    //console.log(partName)
                    switch (`${partName}`) {
                        case "Total Samples" : {
                            for (var vr in varlist[0]["var"]) {
                                switch (`${varlist[0]["var"][vr].name[0]}`) {
                                case "Average": {
                                    samples.average = parseInt(varlist[0]["var"][vr].value[0]);
                                    break;
                                }
                                case "Maximum": {
                                    samples.maximum = parseInt(varlist[0]["var"][vr].value[0]);
                                    break;
                                }
                                case "Minimum": {
                                    samples.minimum = parseInt(varlist[0]["var"][vr].value[0]);
                                    break;
                                }
                                } 
                            }
                            
                            break;
                        }
                        case "Coupling Facility" : {
                            for (var vr in varlist[0]["var"]) {
                                switch (`${varlist[0]["var"][vr].name[0]}`) {
                                case "Type": {
                                    facility.type = varlist[0]["var"][vr].value[0];
                                    break;
                                }
                                case "Model": {
                                    facility.model = varlist[0]["var"][vr].value[0];
                                    break;
                                }
                                case "Level": {
                                    facility.level = parseInt(varlist[0]["var"][vr].value[0]);
                                    break;
                                }
                                case "Dynamic Dispatch Status": {
                                    facility.dynamicDispatch = varlist[0]["var"][vr].value[0];
                                    break;
                                }
                                case "Avg CF Utilization %Busy": {
                                    facility.cfUtilization = parseFloat(varlist[0]["var"][vr].value[0]);
                                    break;
                                }
                                
                                } 
                            }
                            
                            break;
                        }
                        case "Logical Processors" : {
                            for (var vr in varlist[0]["var"]) {
                                switch (`${varlist[0]["var"][vr].name[0]}`) {
                                case "Defined": {
                                    processor.defined = parseInt(varlist[0]["var"][vr].value[0]);
                                    break;
                                }
                                case "Effective": {
                                    processor.effective = parseFloat(varlist[0]["var"][vr].value[0]);
                                    break;
                                }
                                } 
                            }
                            break;
                        }
                    }
                }
            }
            usage.totalSamples = samples;
            usage.couplingFacility = facility;
            usage.logicalProcessors = processor;
            rprtCF.usageSummary = usage;
            singleReport[b] = rprtCF;

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