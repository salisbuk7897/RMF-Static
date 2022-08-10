import * as cacheInterface from "../Interfaces/rprtCacheInterface";

// Import xml2js library
const xml2js = require("xml2js");
const parser = new xml2js.Parser(); // Initialize xml2js parser
/**
 * parser for parsing RMF monitor I CPU report XML data to JSON
 * @param {string} xml - Workload XML data from RMF Monitor I
 */
export default async function parseCACHE(xml) {
    try {
        const result = await parser.parseStringPromise(xml);
        const finalJSON = {}; // Collection for storing JSON of Parsed XML
        const postprocessors = result.ddsml.postprocessor;
        for (const a in postprocessors) {
          let number  = 0;
          // Loop through postprocessor sections
          let singleReport: Partial<cacheInterface.Cache> = {};//segment number (b) as key and detals as value
          const segments = postprocessors[a].segment;
          const csmappingCollection: Record<string, Partial<cacheInterface.CacheSub>> = {};
          for (const b in segments) {
            var segmentName = segments[b].name[0];
            //console.log(segmentName.trim())
            const parts = segments[b].part;
            if (segmentName.trim() == "Cache Interval") {
                console.log("hi");
                const cacheInt: Partial<cacheInterface.CacheInt> = {};
                for (const c in parts) {
                    const varlist = parts[c]["var-list"];
                    
                    for (var vr in varlist[0]["var"]) {
                        switch (`${(varlist[0]["var"][vr].name[0].trim()).trim()}`) {
                            case "Start": {
                                cacheInt.start = varlist[0]["var"][vr].value[0].trim();
                                break;
                            }
                            case "Interval (mm.ss)": {
                                cacheInt.interval = varlist[0]["var"][vr].value[0].trim();
                                break;
                            }
                        } 
                    }
                }
                singleReport.cacheInterval = cacheInt
            }else if ((segmentName.trim()).includes("Cache Subsystem Activity for SSID")) {
                const cacheSub: Partial<cacheInterface.CacheSub> = {};
                const descriptor: Partial<cacheInterface.Descriptor> = {};
                const storage: Partial<cacheInterface.storage> = {};
                const overview: Partial<cacheInterface.Overview> = {};
                const miscellaneous: Partial<cacheInterface.Miscellaneous> = {};
                const synchronous: Partial<cacheInterface.Synchronous> = {};
                const adapter: Partial<cacheInterface.Adapter> = {};
                const disk: Partial<cacheInterface.Disk> = {};
                const device: Partial<cacheInterface.Device> = {};
                for (const c in parts) {
                    if(Object.keys(parts[c]).length > 1 ) { // The part has no childnodes
                        var partName = parts[c]["name"][0].trim()
                        switch (`${partName}`) {
                            case "Storage Subsystem Descriptor" : {
                                const varlist = parts[c]["var-list"];
                                for (var vr in varlist[0]["var"]) {
                                    switch (`${varlist[0]["var"][vr].name[0].trim()}`) {
                                        case "Subsystem": {
                                            descriptor.subsystem = varlist[0]["var"][vr].value[0].trim();
                                            break;
                                        }
                                        case "Physical CU-ID": {
                                            descriptor.physical = varlist[0]["var"][vr].value[0].trim();
                                            break;
                                        }
                                        case "Subsystem ID": {
                                            descriptor.subsystemID = varlist[0]["var"][vr].value[0].trim();
                                            break;
                                        }
                                        case "Type-Model": {
                                            descriptor.typeModel = varlist[0]["var"][vr].value[0].trim();
                                            break;
                                        }
                                        case "Manufacturer": {
                                            descriptor.manufacturer = varlist[0]["var"][vr].value[0].trim();
                                            break;
                                        }
                                        case "Plant": {
                                            descriptor.plant = parseInt(varlist[0]["var"][vr].value[0].trim());
                                            break;
                                        }
                                        case "Serial number": {
                                            descriptor.serialNumber = varlist[0]["var"][vr].value[0].trim();
                                            break;
                                        }
                                    } 
                                }
                                cacheSub.storageDescriptor = descriptor
                                break;
                            } case "Subsystem Storage and Status" : {
                                const varlist = parts[c]["var-list"];
                                for (var vr in varlist[0]["var"]) {
                                    switch (`${varlist[0]["var"][vr].name[0].trim()}`) {
                                        case "Storage Configured": {
                                            storage.Configured = varlist[0]["var"][vr].value[0].trim();
                                            break;
                                        }
                                        case "Storage Available": {
                                            storage.available = varlist[0]["var"][vr].value[0].trim();
                                            break;
                                        }
                                        case "Storage Pinned": {
                                            storage.pinned = parseFloat(varlist[0]["var"][vr].value[0].trim());
                                            break;
                                        }
                                        case "Storage Offline": {
                                            storage.offline =  parseFloat(varlist[0]["var"][vr].value[0].trim());
                                            break;
                                        }
                                        case "NVS Configured": {
                                            storage.nvsConfigured = varlist[0]["var"][vr].value[0].trim();
                                            break;
                                        }
                                        case "NVS Pinned": {
                                            storage.nvsPinned =  parseFloat(varlist[0]["var"][vr].value[0].trim());
                                            break;
                                        }
                                        case "Non-Volatile Storage": {
                                            storage.nonVolatileStorage = varlist[0]["var"][vr].value[0].trim();
                                            break;
                                        }
                                        case "Cache Fast Write": {
                                            storage.cacheFastWrite = varlist[0]["var"][vr].value[0].trim();
                                            break;
                                        }
                                    } 
                                }
                                cacheSub.storageAndStatus = storage
                                break;
                            } case "Cache Subsystem Overview" : {
                                const varlist = parts[c]["var-list"];
                                for (var vr in varlist[0]["var"]) {
                                    switch (`${varlist[0]["var"][vr].name[0].trim()}`) {
                                        case "Total I/O Count": {
                                            overview.ioCountTotal = parseInt(varlist[0]["var"][vr].value[0].trim());
                                            break;
                                        }
                                        case "Total Hit Ratio": {
                                            overview.hitRatioTotal = parseFloat(varlist[0]["var"][vr].value[0].trim());
                                            break;
                                        }
                                        case "Cache I/O Count": {
                                            overview.ioCountCache = parseFloat(varlist[0]["var"][vr].value[0].trim());
                                            break;
                                        }
                                        case "Cache Hit Ratio": {
                                            overview.hitRatioCache =  parseFloat(varlist[0]["var"][vr].value[0].trim());
                                            break;
                                        }
                                        case "Total Cache Misses": {
                                            overview.cacheMiss = parseFloat(varlist[0]["var"][vr].value[0].trim());
                                            break;
                                        }
                                        case "Total Cache Miss Rate": {
                                            overview.cacheMissRate =  parseFloat(varlist[0]["var"][vr].value[0].trim());
                                            break;
                                        }
                                    } 
                                }
                                const { table } = parts[c];
                                const tableBody = table[0].row;
                                const mappingCollection: Record<string, Partial<cacheInterface.RC>> = {};
                                
                                for (var tb in tableBody) {
                                const rc: Partial<cacheInterface.RC> = {};
                                    rc.requestCategory = tableBody[tb].col[0].trim();
                                    rc.readCount = parseInt(tableBody[tb].col[1].trim());
                                    rc.readRate = parseFloat(tableBody[tb].col[2].trim());
                                    rc.readHits = parseInt(tableBody[tb].col[3]);
                                    rc.readHitsRate = parseFloat(tableBody[tb].col[4].trim());
                                    rc.writeCount = parseFloat(tableBody[tb].col[5].trim());
                                    rc.writeRate = parseFloat(tableBody[tb].col[6].trim());
                                    rc.fastWrite = parseFloat(tableBody[tb].col[7].trim());
                                    rc.fastWriteRate = parseFloat(tableBody[tb].col[8].trim());
                                    rc.writeHits = parseFloat(tableBody[tb].col[9].trim());
                                    rc.writeHitsRate = parseFloat(tableBody[tb].col[10].trim());
                                    rc.writeHitsRatio = parseFloat(tableBody[tb].col[11].trim());
                                    rc.readWrite = parseFloat(tableBody[tb].col[12].trim());
                                    rc.readMisses = parseFloat(tableBody[tb].col[13].trim());
                                    rc.readMissRate = parseFloat(tableBody[tb].col[14].trim());
                                    rc.writeMisses = parseFloat(tableBody[tb].col[15].trim());
                                    rc.writeMissRate = parseFloat(tableBody[tb].col[16].trim());
                                    rc.cacheMissesTracks = parseFloat(tableBody[tb].col[17].trim());
                                    rc.cacheMissesTrackRate = parseFloat(tableBody[tb].col[18].trim());
                                    mappingCollection[tb] = rc;
                                }
                                overview.ioRequestCategory = mappingCollection
                                cacheSub.cacheOverview = overview
                                break;
                            } case "Miscellaneous Cache Activities" : {
                                const varlist = parts[c]["var-list"];
                                for (var vr in varlist[0]["var"]) {
                                    switch (`${varlist[0]["var"][vr].name[0].trim()}`) {
                                        case "Delayed Operations NVS Count": {
                                            miscellaneous.delayedNVSCount = parseFloat(varlist[0]["var"][vr].value[0].trim());
                                            break;
                                        }
                                        case "Delayed Operations NVS Rate": {
                                            miscellaneous.delayedNVSRate = parseFloat(varlist[0]["var"][vr].value[0].trim());
                                            break;
                                        }
                                        case "Delayed Operations Cache Count": {
                                            miscellaneous.delayedCacheCount = parseFloat(varlist[0]["var"][vr].value[0].trim());
                                            break;
                                        }
                                        case "Delayed Operations Cache Rate": {
                                            miscellaneous.delayedCacheRate =  parseFloat(varlist[0]["var"][vr].value[0].trim());
                                            break;
                                        }
                                        case "DFW Inhibit Count": {
                                            miscellaneous.dfwInhibitCout = parseFloat(varlist[0]["var"][vr].value[0].trim());
                                            break;
                                        }
                                        case "DFW Inhibit Rate": {
                                            miscellaneous.dfwInhibitRate =  parseFloat(varlist[0]["var"][vr].value[0].trim());
                                            break;
                                        }
                                        case "Async I/O Count": {
                                            miscellaneous.ioCount = parseFloat(varlist[0]["var"][vr].value[0].trim());
                                            break;
                                        }
                                        case "Async I/O Rate": {
                                            miscellaneous.ioRate = parseFloat(varlist[0]["var"][vr].value[0].trim());
                                            break;
                                        }
                                        case "CKD Writes": {
                                            miscellaneous.ckdWrites =  parseFloat(varlist[0]["var"][vr].value[0].trim());
                                            break;
                                        }
                                        case "CKD Write Hits": {
                                            miscellaneous.ckdWriteHits = parseFloat(varlist[0]["var"][vr].value[0].trim());
                                            break;
                                        }
                                        case "Record Caching Read Misses": {
                                            miscellaneous.cachingReadMisses =  parseFloat(varlist[0]["var"][vr].value[0].trim());
                                            break;
                                        }
                                        case "Record Caching Write Promotes": {
                                            miscellaneous.cachingWritePromotes = parseFloat(varlist[0]["var"][vr].value[0].trim());
                                            break;
                                        }
                                    } 
                                }
                                cacheSub.miscellaneousCache = miscellaneous
                                break;
                            } case "Synchronous I/O Activity" : {
                                const varlist = parts[c]["var-list"];
                                for (var vr in varlist[0]["var"]) {
                                    switch (`${varlist[0]["var"][vr].name[0].trim()}`) {
                                        case "Read Requests/Sec": {
                                            synchronous.readRequests = parseFloat(varlist[0]["var"][vr].value[0].trim());
                                            break;
                                        }
                                        case "Read Hits/Request": {
                                            synchronous.readHits = parseFloat(varlist[0]["var"][vr].value[0].trim());
                                            break;
                                        }
                                        case "Write Requests/Sec": {
                                            synchronous.writeRequests = parseFloat(varlist[0]["var"][vr].value[0].trim());
                                            break;
                                        }
                                        case "Write Hits/Request": {
                                            synchronous.writeHits = parseFloat(varlist[0]["var"][vr].value[0].trim());
                                            break;
                                        }
                                    } 
                                }
                                cacheSub.synchronousIO = synchronous
                                break;
                            } case "Host Adapter Activity" : {
                                const varlist = parts[c]["var-list"];
                                for (var vr in varlist[0]["var"]) {
                                    switch (`${varlist[0]["var"][vr].name[0].trim()}`) {
                                        case "Bytes/Req Read": {
                                            adapter.bytesReqRead = varlist[0]["var"][vr].value[0].trim();
                                            break;
                                        }
                                        case "Bytes/Sec Read": {
                                            adapter.bytesSecRead = varlist[0]["var"][vr].value[0].trim();
                                            break;
                                        }
                                        case "Bytes/Req Write": {
                                            adapter.bytesReqWrite =varlist[0]["var"][vr].value[0].trim();
                                            break;
                                        }
                                        case "Bytes/Sec Write": {
                                            adapter.bytesSecWrite = varlist[0]["var"][vr].value[0].trim();
                                            break;
                                        }
                                    } 
                                }
                                cacheSub.hostAdapter = adapter
                                break;
                            } case "Disk Activity" : {
                                const varlist = parts[c]["var-list"];
                                for (var vr in varlist[0]["var"]) {
                                    switch (`${varlist[0]["var"][vr].name[0].trim()}`) {
                                        case "Read Response Time": {
                                            disk.readResponseTime = parseFloat(varlist[0]["var"][vr].value[0].trim());
                                            break;
                                        }
                                        case "Write Response Time": {
                                            disk.writeResponseTime = parseFloat(varlist[0]["var"][vr].value[0].trim());
                                            break;
                                        }
                                        case "Bytes/Req Read": {
                                            disk.bytesReqRead = parseFloat(varlist[0]["var"][vr].value[0].trim());
                                            break;
                                        }
                                        case "Bytes/Sec Read": {
                                            disk.bytesSecRead = parseFloat(varlist[0]["var"][vr].value[0].trim());
                                            break;
                                        }
                                        case "Bytes/Req Write": {
                                            disk.bytesReqWrite = parseFloat(varlist[0]["var"][vr].value[0].trim());
                                            break;
                                        }
                                        case "Bytes/Sec Write": {
                                            disk.bytesSecWrite = parseFloat(varlist[0]["var"][vr].value[0].trim());
                                            break;
                                        }
                                    } 
                                }
                                cacheSub.diskActivity = disk
                                break;
                            } case "Cache Subsystem Device Overview" : {
                                const { table } = parts[c];
                                const tableBody = table[0].row;
                                const mappingCollection: Record<string, Partial<cacheInterface.VS>> = {};
                                
                                for (var tb in tableBody) {
                                const vs: Partial<cacheInterface.VS> = {};
                                    vs.volumeSerial = tableBody[tb].col[0].trim();
                                    vs.deviceNumber = parseInt(tableBody[tb].col[1].trim());
                                    vs.extentPoolID = parseFloat(tableBody[tb].col[2].trim());
                                    vs.ioOfTotal = parseInt(tableBody[tb].col[3].trim());
                                    vs.ioRate = parseFloat(tableBody[tb].col[4].trim());
                                    vs.cacheHitReadRate = parseFloat(tableBody[tb].col[5].trim());
                                    vs.cacheHitDFWRate = parseFloat(tableBody[tb].col[6].trim());
                                    vs.cacheHitCFWRate = parseFloat(tableBody[tb].col[7].trim());
                                    vs.dasdStageRate = parseFloat(tableBody[tb].col[8].trim());
                                    vs.dasdOperationsDelaybyNVS = parseFloat(tableBody[tb].col[9].trim());
                                    vs.dasdOperationsDelaybyCache = parseFloat(tableBody[tb].col[10].trim());
                                    vs.asyncRate = parseFloat(tableBody[tb].col[11].trim());
                                    vs.totlHitRatio = parseFloat(tableBody[tb].col[12].trim());
                                    vs.readHitRatio = parseFloat(tableBody[tb].col[13].trim());
                                    vs.writeHitRatio = parseFloat(tableBody[tb].col[14].trim());
                                    vs.readWrite = parseFloat(tableBody[tb].col[15].trim());
                                    
                                    mappingCollection[tb] = vs;
                                }
                                device.volumeSerial = mappingCollection
                                cacheSub.cacheDevice = device
                                break;
                            } 
                        }
                    }
                }
                
                csmappingCollection[number] = cacheSub
                
                number += 1;
            }
            singleReport.cacheSubsystem = csmappingCollection
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