import * as omvsInterface from "../Interfaces/rprtOmvsInterface";

// Import xml2js library
const xml2js = require("xml2js");
const parser = new xml2js.Parser(); // Initialize xml2js parser
/**
 * parser for parsing RMF monitor I CPU report XML data to JSON
 * @param {string} xml - Workload XML data from RMF Monitor I
 */
export default async function parseOMVS(xml) {
    try {
        const result = await parser.parseStringPromise(xml);
        const finalJSON = {}; // Collection for storing JSON of Parsed XML
        const postprocessors = result.ddsml.postprocessor;
        for (const a in postprocessors) {
          
          // Loop through postprocessor sections
          let singleReport: Partial<omvsInterface.OMVS> = {};//segment number (b) as key and detals as value
          const segments = postprocessors[a].segment;
          
          for (const b in segments) {
            var segmentName = segments[b].name[0];
            const parts = segments[b].part;
            if (segmentName.trim() == "General Information") {
              const info: Partial<omvsInterface.Info> = {};
              
              for (const c in parts) {
                const varlist = parts[c]["var-list"];
                
                for (var vr in varlist[0]["var"]) {
                  switch (`${varlist[0]["var"][vr].name[0].trim()}`) {
                    case "Total Samples": {
                      info.totalSamples = parseFloat(varlist[0]["var"][vr].value[0].trim());
                      break;
                    }
                  } 
                }
              }
              singleReport.generalInfo = info

            }else if(segmentName.trim() == "OMVS System Call Activity"){
              for(const c in parts){
                const { table } = parts[c];
                const tableBody = table[0].row; //undefined 
                const mappingCollection: Record<string, Partial<omvsInterface.cActivity>> = {};
                
                for (var tb in tableBody) {
                  const cActivity: Partial<omvsInterface.cActivity> = {}
                  cActivity.activity = tableBody[tb].col[0].trim();
                  cActivity.min = parseFloat(tableBody[tb].col[1].trim());
                  cActivity.avg = parseFloat(tableBody[tb].col[2].trim());
                  cActivity.max = parseFloat(tableBody[tb].col[3].trim());
                  mappingCollection[tb] = cActivity;
                  //mappingLogicalActivity.set(`${tableBody[tb].col[1]}`, logicalActivity);
                  
                }
                singleReport.callActivity = mappingCollection
              }
            }else if(segmentName.trim() == "OMVS Process Activity"){
              for(const c in parts){
                const { table } = parts[c];
                const tableBody = table[0].row;
                const mappingCollection: Record<string, Partial<omvsInterface.pActivity>> = {};
                
                for (var tb in tableBody) {
                  const pActivity: Partial<omvsInterface.pActivity> = {};
                  const current: Partial<omvsInterface.Current> = {};
                  const overruns: Partial<omvsInterface.Overruns> = {};
                  pActivity.process = tableBody[tb].col[0].trim();
                  pActivity.maxTotal = parseFloat(tableBody[tb].col[1].trim());
                  current.min = parseFloat(tableBody[tb].col[2].trim());
                  current.avg = parseFloat(tableBody[tb].col[3].trim());
                  current.max = parseFloat(tableBody[tb].col[4].trim());
                  overruns.min = parseFloat(tableBody[tb].col[5].trim());
                  overruns.avg = parseFloat(tableBody[tb].col[6].trim());
                  overruns.max = parseFloat(tableBody[tb].col[7].trim());
                  pActivity.current = current
                  pActivity.overruns = overruns
                  mappingCollection[tb] = pActivity;
                  //mappingLogicalActivity.set(`${tableBody[tb].col[1]}`, logicalActivity);
                  
                }
                singleReport.processActivity = mappingCollection
              }

            }else if(segmentName.trim() == "OMVS Inter-Process Communication"){
                for(const c in parts){
                  const { table } = parts[c];
                  const tableBody = table[0].row;
                  const mappingCollection: Record<string, Partial<omvsInterface.pActivity>> = {};
                  
                  for (var tb in tableBody) {
                    const pActivity: Partial<omvsInterface.pActivity> = {};
                    const current: Partial<omvsInterface.Current> = {};
                    const overruns: Partial<omvsInterface.Overruns> = {};
                    pActivity.process = tableBody[tb].col[0].trim();
                    pActivity.maxTotal = parseFloat(tableBody[tb].col[1].trim());
                    current.min = parseFloat(tableBody[tb].col[2].trim());
                    current.avg = parseFloat(tableBody[tb].col[3].trim());
                    current.max = parseFloat(tableBody[tb].col[4].trim());
                    overruns.min = parseFloat(tableBody[tb].col[5].trim());
                    overruns.avg = parseFloat(tableBody[tb].col[6].trim());
                    overruns.max = parseFloat(tableBody[tb].col[7].trim());
                    pActivity.current = current
                    pActivity.overruns = overruns
                    mappingCollection[tb] = pActivity;
                    //mappingLogicalActivity.set(`${tableBody[tb].col[1]}`, logicalActivity);
                    
                  }
                  singleReport.interProcess = mappingCollection
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