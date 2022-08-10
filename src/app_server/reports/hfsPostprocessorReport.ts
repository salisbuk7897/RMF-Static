import * as hfsInterface from "../Interfaces/rprtHFSInterface";

// Import xml2js library
const xml2js = require("xml2js");
const parser = new xml2js.Parser(); // Initialize xml2js parser
/**
 * parser for parsing RMF monitor I CPU report XML data to JSON
 * @param {string} xml - Workload XML data from RMF Monitor I
 */
export default async function parseHFS(xml) {
    try {
        const result = await parser.parseStringPromise(xml);
        const finalJSON = {}; // Collection for storing JSON of Parsed XML
        const postprocessors = result.ddsml.postprocessor;
        for (const a in postprocessors) {
          // Loop through postprocessor sections
          let singleReport: Partial<hfsInterface.HFS> = {};
          const segments = postprocessors[a].segment;
          
          for (const b in segments) {
            var segmentName = segments[b].name[0];
            const parts = segments[b].part;
            if (segmentName.trim() == "HFS Global Statistics") {
                console.log("hi")
                let global: Partial<hfsInterface.global> = {}
                let virtual: Partial<hfsInterface.virtual> = {}
                let storage: Partial<hfsInterface.storage> = {}
                let fixed: Partial<hfsInterface.fixed> = {}
              
              for (const c in parts) {
                if(Object.keys(parts[c]).length > 1 ) { // The part has no childnodes
                    var partName = parts[c]["name"][0].trim()
                    switch (`${partName}`) {
                        case "Storage Limits (MB)":{
                            const varlist = parts[c]["var-list"];
                
                            for (var vr in varlist[0]["var"]) {
                                switch (`${varlist[0]["var"][vr].name[0].trim()}`) {
                                    case "Virtual Max": {
                                        virtual.max = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "Virtual Use": {
                                        virtual.use = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "Fixed Min": {
                                        fixed.min = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "Fixed Use": {
                                        fixed.use = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                } 
                            }
                            break;
                        }

                    }
                }
                
              }
              storage.virtual = virtual
              storage.fixed = fixed
              global.storage = storage
              singleReport.global = global

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