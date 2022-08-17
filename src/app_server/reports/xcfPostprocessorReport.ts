import * as xcfInterface from "../Interfaces/xcfInterface";

// Import xml2js library
const xml2js = require("xml2js");
const parser = new xml2js.Parser(); // Initialize xml2js parser
/**
 * parser for parsing RMF monitor I CPU report XML data to JSON
 * @param {string} xml - Workload XML data from RMF Monitor I
 */
export default async function parseXCF(xml) {
  try {
    const result = await parser.parseStringPromise(xml);
    const finalJSON = {}; // Collection for storing JSON of Parsed XML
    const postprocessors = result.ddsml.postprocessor;
    for (const a in postprocessors) {
      // Loop through postprocessor sections
      let singleReport: Partial<xcfInterface.xcf> = {};
      const segments = postprocessors[a].segment;

      for (const b in segments) {
        var segmentName = segments[b].name[0];
        const parts = segments[b].part;
        if (segmentName.trim() == "XCF Usage by System") {
          let bysystem: Partial<xcfInterface.bySystem> = {};

          let allSystem = [];

          for (const c in parts) {
            if (Object.keys(parts[c]).length > 1) {
              var partName;
              try {
                partName = parts[c]["name"][0].trim();
              } catch (e) {
                partName = c;
              }

              if (partName.includes("Local within System")) {
                const { table } = parts[c];
                const tableBody = table[0].row;
                const systemList = [];
                for (var tb in tableBody) {
                  let system: Partial<xcfInterface.System> = {};

                  system.transportClass = tableBody[tb].col[0].trim();
                  system.status = tableBody[tb].col[1].trim();
                  system.requestsRejected = parseFloat(
                    tableBody[tb].col[2].trim()
                  );
                  systemList.push(system);
                }
                allSystem.push(systemList);
              }
            }
          }
          bysystem.local = allSystem;
          singleReport.usageBySystem = bysystem
        } else if (segmentName.trim() == "XCF Usage by Member") {
            let bymember: Partial<xcfInterface.byMember> = {};

            let allMember = [];

            for (const c in parts) {
                if (Object.keys(parts[c]).length > 1) {
                var partName;
                try {
                    partName = parts[c]["name"][0].trim();
                } catch (e) {
                    partName = c;
                }

                if (partName.includes("Members on System")) {
                    const { table } = parts[c];
                    const tableBody = table[0].row;
                    const memberList = [];
                    for (var tb in tableBody) {
                    let member: Partial<xcfInterface.Member> = {};

                    member.group = tableBody[tb].col[0].trim();
                    member.member = tableBody[tb].col[1].trim();
                    member.status = tableBody[tb].col[2].trim();
                    member.requestOut = parseFloat(tableBody[tb].col[3].trim());
                    member.requestIn = parseFloat(tableBody[tb].col[4].trim());
                    
                    memberList.push(member);
                    }
                    allMember.push(memberList);
                }
                }
            }
            bymember.onSystem = allMember;
            singleReport.usageByMember = bymember

        }
      }
      finalJSON[a] = singleReport;
    }
    //console.log(finalJSON);
    return finalJSON;
  } catch (e) {
    console.log(e);
    return e;
  }
}
