import * as cryptoInterface from "../Interfaces/rprtCryptoInterface";

// Import xml2js library
const xml2js = require("xml2js");
const parser = new xml2js.Parser(); // Initialize xml2js parser
/**
 * parser for parsing RMF monitor I CPU report XML data to JSON
 * @param {string} xml - Workload XML data from RMF Monitor I
 */
export default async function parseCRYPTO(xml) {
    try {
        const result = await parser.parseStringPromise(xml);
        const finalJSON = {}; // Collection for storing JSON of Parsed XML
        const postprocessors = result.ddsml.postprocessor;
        for (const a in postprocessors) {
          
          // Loop through postprocessor sections
          let singleReport: Partial<cryptoInterface.crypto> = {};//segment number (b) as key and detals as value
          const segments = postprocessors[a].segment;
          
          for (const b in segments) {
            var segmentName = segments[b].name[0];
            const parts = segments[b].part;
            if (segmentName == "Cryptographic CCA Coprocessor") {
                for(const c in parts){
                    const { table } = parts[c];
                    const tableBody = table[0].row;
                    const mappingCollection = [];
                    
                    for (var tb in tableBody) {
                      const type: Partial<cryptoInterface.type> = {};
                      const lpar: Partial<cryptoInterface.cclparcpc> = {};
                      const cpc: Partial<cryptoInterface.cclparcpc> = {};
                      type.type = tableBody[tb].col[0];
                      lpar.rate = parseInt(tableBody[tb].col[2]);
                      lpar.exxecTime = parseInt(tableBody[tb].col[3]);
                      lpar.util = parseInt(tableBody[tb].col[4]);
                      cpc.rate = parseInt(tableBody[tb].col[5]);
                      cpc.exxecTime = parseInt(tableBody[tb].col[6]);
                      cpc.util = parseInt(tableBody[tb].col[7]);
                      lpar.keyGenRate = parseInt(tableBody[tb].col[8]);
                      cpc.keyGenRate = parseInt(tableBody[tb].col[9]);
                      type.lpar = lpar
                      type.cpc = cpc
                      mappingCollection[tb] = type;
                      //mappingLogicalActivity.set(`${tableBody[tb].col[1]}`, logicalActivity);
                      
                    }
                    singleReport.ccaCoProcessor = mappingCollection
                }

            }else if(segmentName == "ICSF Services"){
                for(const c in parts){
                    const { table } = parts[c];
                    const tableBody = table[0].row;
                    const mappingCollection = [];
                    
                    for (var tb in tableBody) {
                      const icsf: Partial<cryptoInterface.icsf> = {};
                      icsf.type = tableBody[tb].col[0]
                      icsf.rate = parseFloat(tableBody[tb].col[1]);
                      icsf.size = parseFloat(tableBody[tb].col[2]);
                      
                      mappingCollection[tb] = icsf;
                      //mappingLogicalActivity.set(`${tableBody[tb].col[1]}`, logicalActivity);
                      
                    }
                    singleReport.icsfServices = mappingCollection
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