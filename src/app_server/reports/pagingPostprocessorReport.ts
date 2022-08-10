import * as pagingInterface from "../Interfaces/pagingInterface";

// Import xml2js library
const xml2js = require("xml2js");
const parser = new xml2js.Parser(); // Initialize xml2js parser
/**
 * parser for parsing RMF monitor I CPU report XML data to JSON
 * @param {string} xml - Workload XML data from RMF Monitor I
 */
export default async function parsePAGING(xml) {
    try {
        const result = await parser.parseStringPromise(xml);
        const finalJSON = {}; // Collection for storing JSON of Parsed XML
        const postprocessors = result.ddsml.postprocessor;
        for (const a in postprocessors) {
          // Loop through postprocessor sections
          let singleReport: Partial<pagingInterface.Paging> = {};
          const segments = postprocessors[a].segment;
          
          for (const b in segments) {
            var segmentName = segments[b].name[0];
            const parts = segments[b].part;
            if (segmentName.trim() == "Central Storage Paging Rates - in Pages Per Second") {
                const pagingRate: Partial<pagingInterface.PagingRate> = {}
              
              for (const c in parts) {
                if(Object.keys(parts[c]).length > 1 ) { // The part has no childnodes
                    var partName;
                    try{
                        partName = parts[c]["name"][0].trim()
                    }catch(e){
                        partName = "Null"
                    }
                    switch (`${partName}`) {
                        case "Pageable System Areas (non-VIO)":{
                            const { table } = parts[c];
                            const tableBody = table[0].row;
                            const pages  = [];
                            
                            
                            for (var tb in tableBody) {
                                const page:  Partial<pagingInterface.Pages> = {};
                                const pageIn:  Partial<pagingInterface.PageIn> = {};
                                const pageOut:  Partial<pagingInterface.PageOut> = {};
                                const nonSwap:  Partial<pagingInterface.NonSwap> = {};
                                const pitotal:  Partial<pagingInterface.Total> = {};
                                const pototal:  Partial<pagingInterface.Total> = {};
                                page.category = tableBody[tb].col[0].trim();
                                nonSwap.block = parseFloat(tableBody[tb].col[1].trim());
                                nonSwap.nonBlock =  parseFloat(tableBody[tb].col[2].trim());
                                pitotal.rate =  parseFloat(tableBody[tb].col[3].trim());
                                pitotal.percent =  parseFloat(tableBody[tb].col[4].trim());
                                pageOut.nonSwap = parseFloat(tableBody[tb].col[5].trim());
                                pototal.rate =   parseFloat(tableBody[tb].col[6].trim());
                                pototal.percent =  parseFloat(tableBody[tb].col[7].trim());
                                pageIn.swap = null
                                pageOut.swap = null
                                pageOut.total = pototal; 
                                pageIn.nonSwap = nonSwap;
                                pageIn.total = pitotal;
                                page.pageIn = pageIn;
                                page.pageOut = pageOut;
                                pages.push(page);
                            }
                            pagingRate.pageableSystemAddress = pages
                            break;
                        }case "Address Spaces" : {
                            const { table } = parts[c];
                            const tableBody = table[0].row;
                            const pages  = [];
                            
                            
                            for (var tb in tableBody) {
                                const page:  Partial<pagingInterface.Pages> = {};
                                const pageIn:  Partial<pagingInterface.PageIn> = {};
                                const pageOut:  Partial<pagingInterface.PageOut> = {};
                                const nonSwap:  Partial<pagingInterface.NonSwap> = {};
                                const pitotal:  Partial<pagingInterface.Total> = {};
                                const pototal:  Partial<pagingInterface.Total> = {};
                                page.category = tableBody[tb].col[0].trim();
                                pageIn.swap = parseFloat(tableBody[tb].col[1].trim());
                                nonSwap.block = parseFloat(tableBody[tb].col[2].trim());
                                nonSwap.nonBlock =  parseFloat(tableBody[tb].col[3].trim());
                                pitotal.rate =  parseFloat(tableBody[tb].col[4].trim());
                                pitotal.percent =  parseFloat(tableBody[tb].col[5].trim());
                                pageOut.swap = parseFloat(tableBody[tb].col[6].trim());
                                pageOut.nonSwap = parseFloat(tableBody[tb].col[7].trim());
                                pototal.rate =   parseFloat(tableBody[tb].col[8].trim());
                                pototal.percent =  parseFloat(tableBody[tb].col[9].trim());
                                pageOut.total = pototal; 
                                pageIn.nonSwap = nonSwap;
                                pageIn.total = pitotal;
                                page.pageIn = pageIn;
                                page.pageOut = pageOut;
                                pages.push(page);
                            
                            }
                            pagingRate.addressSpaces = pages
                            break;
                        }case "Total System" : {
                            const { table } = parts[c];
                            const tableBody = table[0].row;
                            const pages  = [];
                            
                            
                            for (var tb in tableBody) {
                                const page:  Partial<pagingInterface.Pages> = {};
                                const pageIn:  Partial<pagingInterface.PageIn> = {};
                                const pageOut:  Partial<pagingInterface.PageOut> = {};
                                const nonSwap:  Partial<pagingInterface.NonSwap> = {};
                                const pitotal:  Partial<pagingInterface.Total> = {};
                                const pototal:  Partial<pagingInterface.Total> = {};
                                page.category = tableBody[tb].col[0].trim();
                                pageIn.swap = parseFloat(tableBody[tb].col[1].trim());
                                nonSwap.block = parseFloat(tableBody[tb].col[2].trim());
                                nonSwap.nonBlock =  parseFloat(tableBody[tb].col[3].trim());
                                pitotal.rate =  parseFloat(tableBody[tb].col[4].trim());
                                pitotal.percent =  parseFloat(tableBody[tb].col[5].trim());
                                pageOut.swap = parseFloat(tableBody[tb].col[6].trim());
                                pageOut.nonSwap = parseFloat(tableBody[tb].col[7].trim());
                                pototal.rate =   parseFloat(tableBody[tb].col[8].trim());
                                pototal.percent =  parseFloat(tableBody[tb].col[9].trim());
                                pageOut.total = pototal; 
                                pageIn.nonSwap = nonSwap;
                                pageIn.total = pitotal;
                                page.pageIn = pageIn;
                                page.pageOut = pageOut;
                                pages.push(page);
                            
                            }
                            pagingRate.totalSystem = pages
                            break;
                        }case "Page Movement" : {
                            const pmovement: Partial<pagingInterface.PMovement> = {}
                            const varlist = parts[c]["var-list"];
                
                            for (var vr in varlist[0]["var"]) {
                                switch (`${varlist[0]["var"][vr].name[0].trim()}`) {
                                    case "Page Movement Within Central Storage": {
                                        pmovement.pageMovementCStorage = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "Page Movement Time %": {
                                        pmovement.pageMovementTime = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "Average Number of Pages Per Block": {
                                        pmovement.pagesPerBlock = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "Blocks Per Second": {
                                        pmovement.blockPerSecond = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                    case "Page-In Events (Page Fault Rate)": {
                                        pmovement.paginEvents = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                        break;
                                    }
                                } 
                            }
                            pagingRate.pageMovement = pmovement;
                            break;
                        }

                    } 
                }
                
              }
              
              singleReport.pagingRate = pagingRate;

            }else if(segmentName.trim() == "Central Storage Movement and Request Rates - in Pages Per Second"){
                const mrrate: Partial<pagingInterface.mrRate> = {}
              
                for (const c in parts) {
                    if(Object.keys(parts[c]).length > 1 ) { // The part has no childnodes
                        var partName;
                        try{
                            partName = parts[c]["name"][0].trim()
                        }catch(e){
                            partName = "Null"
                        }
                        switch (`${partName}`) {
                            case "System UIC":{
                                const uic: Partial<pagingInterface.UIC> = {}
                                const varlist = parts[c]["var-list"];
                    
                                for (var vr in varlist[0]["var"]) {
                                    switch (`${varlist[0]["var"][vr].name[0].trim()}`) {
                                        case "Min": {
                                            uic.min = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                            break;
                                        }
                                        case "Max": {
                                            uic.max = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                            break;
                                        }
                                        case "Avg": {
                                            uic.avg = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                            break;
                                        }
                                    } 
                                }
                                mrrate.systemUIC = uic;
                                break;
                            }case "Central Storage": {
                                const { table } = parts[c];
                                const tableBody = table[0].row;
                                const csList  = [];
                                for (var tb in tableBody) {
                                    const cs:  Partial<pagingInterface.CS> = {};
                                    const fc:  Partial<pagingInterface.FrameCounts> = {};
                    
                                    cs.category = tableBody[tb].col[0].trim();
                                    cs.pageWrite = parseFloat(tableBody[tb].col[1].trim());
                                    cs.pageRead = parseFloat(tableBody[tb].col[2].trim());
                                    fc.min =  parseFloat(tableBody[tb].col[3].trim());
                                    fc.max =  parseFloat(tableBody[tb].col[4].trim());
                                    fc.avg =  parseFloat(tableBody[tb].col[5].trim()); 
                                    cs.frameCounts = fc;
                                    csList.push(cs);
                                
                                }
                                mrrate.centralStorage = csList
                                break;
                            }case "Storage Request Rates": {
                                const getmain: Partial<pagingInterface.Getmain> = {}
                                const fixed: Partial<pagingInterface.Fixed> = {}
                                const ref: Partial<pagingInterface.Ref> = {}
                                const rate: Partial<pagingInterface.Rate> = {}
                                const varlist = parts[c]["var-list"];
                    
                                for (var vr in varlist[0]["var"]) {
                                    switch (`${varlist[0]["var"][vr].name[0].trim()}`) {
                                        case "Getmain Request Rate": {
                                            getmain.requests = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                            break;
                                        }
                                        case "Getmain Frames Backed Rate": {
                                            getmain.framesBacked = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                            break;
                                        }
                                        case "Fixed Request Below 2 GB Rate": {
                                            fixed.req2gb = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                            break;
                                        }
                                        case "Fixed Frames Below 2 GB Rate": {
                                            fixed.frames2gb = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                            break;
                                        }
                                        case "Reference Faults (1st) Rate": {
                                            ref.first = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                            break;
                                        }
                                        case "Reference Faults (non-1st) Rate": {
                                            ref.nonFirst = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                            break;
                                        }
                                    } 
                                }
                                rate.fixed = fixed;
                                rate.getmain = getmain;
                                rate.refFaults = ref;
                                mrrate.storageRequests = rate;
                                break;
                            }
                        }
                    }
                }
                singleReport.movementAndRequestRate = mrrate;

            }else if(segmentName.trim() == "Frame and Slot Counts"){
                const fscount: Partial<pagingInterface.fsCount> = {}
              
                for (const c in parts) {
                    if(Object.keys(parts[c]).length > 1 ) { // The part has no childnodes
                        var partName;
                        try{
                            partName = parts[c]["name"][0].trim()
                        }catch(e){
                            partName = "Null"
                        }
                        switch (`${partName}`) {
                            case "Central Storage Frames":{
                                const { table } = parts[c];
                                const tableBody = table[0].row;
                                const csFrameList  = [];
                                for (var tb in tableBody) {
                                    const csFrame:  Partial<pagingInterface.csFrames> = {};
                    
                                    csFrame.category = tableBody[tb].col[0].trim();
                                    csFrame.total = parseFloat(tableBody[tb].col[1].trim());
                                    csFrame.available = parseFloat(tableBody[tb].col[2].trim());
                                    csFrame.sqa =  parseFloat(tableBody[tb].col[3].trim());
                                    csFrame.lpa =  parseFloat(tableBody[tb].col[4].trim());
                                    csFrame.csa=  parseFloat(tableBody[tb].col[5].trim());
                                    csFrame.lsqa = parseFloat(tableBody[tb].col[6].trim());
                                    csFrame.regionsSWA =  parseFloat(tableBody[tb].col[7].trim());
                                    csFrame.highShared =  parseFloat(tableBody[tb].col[8].trim());
                                    csFrame.highCommon=  parseFloat(tableBody[tb].col[9].trim()); 
                                    
                                    csFrameList.push(csFrame);
                                
                                }
                                fscount.centralStorageFrames = csFrameList
                                break;
                            }case "Fixed Frames": {
                                const { table } = parts[c];
                                const tableBody = table[0].row;
                                const fxFrameList  = [];
                                for (var tb in tableBody) {
                                    const fxFrame:  Partial<pagingInterface.fxFrames> = {};
                    
                                    fxFrame.category = tableBody[tb].col[0].trim();
                                    fxFrame.total = parseFloat(tableBody[tb].col[1].trim());
                                    fxFrame.nucleus = parseFloat(tableBody[tb].col[2].trim());
                                    fxFrame.sqa =  parseFloat(tableBody[tb].col[3].trim());
                                    fxFrame.lpa =  parseFloat(tableBody[tb].col[4].trim());
                                    fxFrame.csa=  parseFloat(tableBody[tb].col[5].trim());
                                    fxFrame.lsqa = parseFloat(tableBody[tb].col[6].trim());
                                    fxFrame.regionsSWA =  parseFloat(tableBody[tb].col[7].trim());
                                    fxFrame.below16mb =  parseFloat(tableBody[tb].col[8].trim());
                                    fxFrame.between16mband2gb=  parseFloat(tableBody[tb].col[9].trim()); 
                                    
                                    fxFrameList.push(fxFrame);
                                
                                }
                                fscount.fixedFrames = fxFrameList
                                break;
                            }case "Shared Frames / Slots": {
                                const { table } = parts[c];
                                const tableBody = table[0].row;
                                const shFrameList  = [];
                                for (var tb in tableBody) {
                                    const shFrame:  Partial<pagingInterface.shFrames> = {};
                    
                                    shFrame.category = tableBody[tb].col[0].trim();
                                    shFrame.total = parseFloat(tableBody[tb].col[1].trim());
                                    shFrame.centralStorage = parseFloat(tableBody[tb].col[2].trim());
                                    shFrame.fixedTotal =  parseFloat(tableBody[tb].col[3].trim());
                                    shFrame.fixedBelow16MB =  parseFloat(tableBody[tb].col[4].trim());
                                    shFrame.high1m =  parseFloat(tableBody[tb].col[5].trim());
                                    shFrame.high4k = parseFloat(tableBody[tb].col[6].trim());
                                    shFrame.auxillaryDASD =  parseFloat(tableBody[tb].col[7].trim());
                                    
                                    shFrameList.push(shFrame);
                                
                                }
                                fscount.sharedFrames = shFrameList
                                break;
                            }case "Local Page Data Set Slots": {
                                const { table } = parts[c];
                                const tableBody = table[0].row;
                                const localList  = [];
                                for (var tb in tableBody) {
                                    const local:  Partial<pagingInterface.Local> = {};
                    
                                    local.category = tableBody[tb].col[0].trim();
                                    local.total = parseFloat(tableBody[tb].col[1].trim());
                                    local.available = parseFloat(tableBody[tb].col[2].trim());
                                    local.bad =  parseFloat(tableBody[tb].col[3].trim());
                                    local.nonVIO =  parseFloat(tableBody[tb].col[4].trim());
                                    local.VIO =  parseFloat(tableBody[tb].col[5].trim());
                                    
                                    localList.push(local);
                                
                                }
                                fscount.localPageDataSet = localList
                                break;
                            }
                        }
                    }
                }
                singleReport.frameAndSlotCount = fscount;
            }else if(segmentName.trim() == "Memory Objects and High Virtual Storage Frames"){
                const frames: Partial<pagingInterface.Frames> = {}
              
                for (const c in parts) {
                    if(Object.keys(parts[c]).length > 1 ) { // The part has no childnodes
                        var partName;
                        try{
                            partName = parts[c]["name"][0].trim()
                        }catch(e){
                            partName = "Null"
                        }
                        switch (`${partName}`) {
                            case "LFAREA Maximum":{
                                const area: Partial<pagingInterface.Area> = {}
                                
                                const varlist = parts[c]["var-list"];
                    
                                for (var vr in varlist[0]["var"]) {
                                    switch (`${varlist[0]["var"][vr].name[0].trim()}`) {
                                        case "1 MB Frames": {
                                            area.oneMBFrames = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                            break;
                                        }
                                        case "2 GB Frames": {
                                            area.twoGBFrames = `${varlist[0]["var"][vr].value[0].trim()}` == "N/A" ? varlist[0]["var"][vr].value[0].trim() : parseFloat(varlist[0]["var"][vr].value[0].trim());
                                            break;
                                        }
                                    } 
                                }
                                frames.lfAreaMaximum = area;
                                break;
                            }case "Memory Objects": {
                                const { table } = parts[c];
                                const tableBody = table[0].row;
                                const memList  = [];
                                for (var tb in tableBody) {
                                    const mem:  Partial<pagingInterface.Mem> = {};
                                    
                                    mem.category = tableBody[tb].col[0].trim();
                                    mem.fixedOneM = parseFloat(tableBody[tb].col[1].trim());
                                    mem.fixedTwoG = parseFloat(tableBody[tb].col[2].trim());
                                    mem.common =  parseFloat(tableBody[tb].col[3].trim());
                                    mem.shared = parseFloat(tableBody[tb].col[4].trim());
                                    mem.sharedOneM = parseFloat(tableBody[tb].col[5].trim());
                                    
                                    memList.push(mem);
                                
                                }
                                frames.memoryObjects = memList
                                break;
                            }case "1 MB Frames": {
                                const { table } = parts[c];
                                const tableBody = table[0].row;
                                const MBList  = [];
                                for (var tb in tableBody) {
                                    const mb:  Partial<pagingInterface.OneMB> = {};
                                    const fixed: Partial<pagingInterface.fixed> = {}
                    
                                    mb.category = tableBody[tb].col[0].trim();
                                    fixed.maximum = parseFloat(tableBody[tb].col[1].trim());
                                    fixed.available = parseFloat(tableBody[tb].col[2].trim());
                                    fixed.inUse =  parseFloat(tableBody[tb].col[3].trim());
                                    mb.pageable = parseFloat(tableBody[tb].col[4].trim());
                                    mb.available = parseFloat(tableBody[tb].col[5].trim());
                                    mb.total =  parseFloat(tableBody[tb].col[6].trim());
                                    
                                    mb.fixed = fixed
                                    MBList.push(mb);
                                
                                }
                                frames.oneMBFrames = MBList
                                break;
                            }
                            case "2 GB Frames":{
                                const { table } = parts[c];
                                const tableBody = table[0].row;
                                const GBList  = [];
                                for (var tb in tableBody) {
                                    const gb:  Partial<pagingInterface.TwoGB> = {};
                                    const fixed: Partial<pagingInterface.fixed> = {}
                    
                                    gb.category = tableBody[tb].col[0].trim();
                                    fixed.maximum = parseFloat(tableBody[tb].col[1].trim());
                                    fixed.available = parseFloat(tableBody[tb].col[2].trim());
                                    fixed.inUse =  parseFloat(tableBody[tb].col[3].trim());
                                    gb.fixed = fixed
                                    GBList.push(gb);
                                
                                }
                                frames.twoGBFrames = GBList
                                break;
                            }case "High Shared Frames": {
                                const { table } = parts[c];
                                const tableBody = table[0].row;
                                const sharedList  = [];
                                for (var tb in tableBody) {
                                    const shared:  Partial<pagingInterface.Shared> = {};
                    
                                    shared.category = tableBody[tb].col[0].trim();
                                    shared.total = parseFloat(tableBody[tb].col[1].trim());
                                    shared.centralStorage = parseFloat(tableBody[tb].col[2].trim());
                                    shared.backedOneM =  parseFloat(tableBody[tb].col[3].trim());
                                    shared.auxillaryDASD =  parseFloat(tableBody[tb].col[4].trim());
                                    
                                    sharedList.push(shared);
                                
                                }
                                frames.highSharedFrames = sharedList
                                break;
                            }case "High Common Frames": {
                                const { table } = parts[c];
                                const tableBody = table[0].row;
                                const commonList  = [];
                                for (var tb in tableBody) {
                                    const common:  Partial<pagingInterface.Common> = {};
                    
                                    common.category = tableBody[tb].col[0].trim();
                                    common.total = parseFloat(tableBody[tb].col[1].trim());
                                    common.centralStorage = parseFloat(tableBody[tb].col[2].trim());
                                    common.backedOneM =  parseFloat(tableBody[tb].col[3].trim());
                                    common.fixed =  parseFloat(tableBody[tb].col[4].trim());
                                    common.fixedOneM =  parseFloat(tableBody[tb].col[5].trim());
                                    common.auxDasd =  parseFloat(tableBody[tb].col[6].trim());
                                    
                                    commonList.push(common);
                                
                                }
                                frames.highCommonFrames = commonList
                                break;
                            }
                        }
                    }
                }
                singleReport.objectAndHVSFrames = frames;
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