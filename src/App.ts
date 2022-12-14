import * as express from 'express';
const tls = require('tls');
import parseCPU from './app_server/reports/cpuPostprocessorReport';
let bodyparser = require("body-parser")
import RMFPPgetRequest from './app_server/Controller/rmfpp'
let Zconfig = require("./Config/Zconfig")
let baseurl = Zconfig.dds['RPRT'].ddsbaseurl;
let baseport = Zconfig.dds['RPRT'].ddsbaseport;
let rmfppfilename = Zconfig.dds['RPRT'].rmfppfilename;
let rmfiiifilename = Zconfig.dds['RPRT'].rmf3filename;
let urlResource = Zconfig.dds['RPRT'].mvsResource;
var minutesInterval = Zconfig.dds['RPRT'].ppminutesInterval;
var ddshttp = Zconfig.dds['RPRT'].ddshhttptype;
let ddsauth = Zconfig.dds['RPRT'].ddsauth;
let ddsid = Zconfig.dds['RPRT'].ddsuser;
let ddspass = Zconfig.dds['RPRT'].ddspwd;
import * as fs from 'fs';
import axios from 'axios';
import parseCF from './app_server/reports/cfPostprocessorReport';
import parseCHAN from './app_server/reports/chanPostprocessorReport';
import parseCRYPTO from './app_server/reports/cryptoPostprocessorReport';
import parseEADM from './app_server/reports/eadmPostprocessorReport';
import parseCACHE from './app_server/reports/cachePostprocessorReport';
import parseDEVICE from './app_server/reports/devicePostprocessorReport';
import parseHFS from './app_server/reports/hfsPostprocessorReport';
import parseIOQ from './app_server/reports/ioqPostprocessorReport';
import parseOMVS from './app_server/reports/omvsPostprocessorReport';
import parsePAGING from './app_server/reports/pagingPostprocessorReport';
import parseVSTOR from './app_server/reports/vstorPostprocessorReport';
import parseSDELAY from './app_server/reports/sdelayPostprocessorReport';
import parsePAGESP from './app_server/reports/pagespPostprocessorReport';
import parseXCF from './app_server/reports/xcfPostprocessorReport';
import parseWLMGL from './app_server/reports/wlmglPostrocessorReport';
import RMFIIIgetRequest from './app_server/Controller/rmfiii';
import parseCPC from './app_server/reports/rmfIII/cpcMonitorIIIReport';
import parseRMFIII from './app_server/reports/rmfIII/monitorIIIReport';
import parseRMFI from './app_server/reports/monitorIParser';
tls.DEFAULT_MIN_VERSION = "TLSv1.1";
declare var process : {
  env: {
    NODE_TLS_REJECT_UNAUTHORIZED: number;
  }
}
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

class App {
  public express

  constructor () {
    this.express = express()
    //express.use(bodyparser.urlencoded({extended:true}))
    this.mountRoutes()
  }

  private mountRoutes (): void {
    const router = express.Router()
    router.get('/', async (req, res) => {
      let jsonData
      if(req.query.monitor == "RMF3"){
        let data = await RMFIIIgetRequest(ddshttp, baseurl, baseport, rmfiiifilename, {report: req.query.report, resource: urlResource}, ddsid, ddspass, ddsauth);
        jsonData = await parseRMFIII(data, req.query.report)
      }else if(req.query.monitor == "RMF1"){
        let data = await RMFPPgetRequest(ddshttp, baseurl, baseport, rmfppfilename, req.query.report, req.query.date, ddsid, ddspass, ddsauth);//fs.readFileSync('C:\\Users\\Administrator\\Desktop\\NEW_ZEBRA\\zebra\\src\\app_server\\xml\\wlmgl.xml','utf8'); 
        jsonData = await parseRMFI(data)
      }else if(req.query.report == "EADM"){ 
        let xml = fs.readFileSync('C:\\Users\\Administrator\\Desktop\\NEW_ZEBRA\\zebra\\src\\app_server\\xml\\eadm.xml','utf8');
        jsonData = await parseEADM(xml)//await parseCPU(data)
      }else if(req.query.report == "CRYPTO"){
        let xml = fs.readFileSync('C:\\Users\\Administrator\\Desktop\\NEW_ZEBRA\\zebra\\src\\app_server\\xml\\crypto.xml','utf8');
        jsonData = await parseCRYPTO(xml)
      }else if(req.query.report == "CHAN"){
        let xml = fs.readFileSync('C:\\Users\\Administrator\\Desktop\\NEW_ZEBRA\\zebra\\src\\app_server\\xml\\chan.xml','utf8');
        jsonData = await parseCHAN(xml)
      }else if(req.query.report == "CF"){
        let xml = fs.readFileSync('C:\\Users\\Administrator\\Desktop\\NEW_ZEBRA\\zebra\\src\\app_server\\xml\\cf.xml','utf8');
        jsonData = await parseCF(xml)
      }else if(req.query.report == "CPU"){
        let xml = fs.readFileSync('C:\\Users\\Administrator\\Desktop\\NEW_ZEBRA\\zebra\\src\\app_server\\xml\\cpu.xml','utf8');
        jsonData = await parseCPU(xml)
      }else if(req.query.report == "CACHE"){
        let xml = fs.readFileSync('C:\\Users\\Administrator\\Desktop\\NEW_ZEBRA\\zebra\\src\\app_server\\xml\\cache.xml','utf8');
        jsonData = await parseCACHE(xml)
      }else if(req.query.report == "DEVICE"){
        let xml = fs.readFileSync('C:\\Users\\Administrator\\Desktop\\NEW_ZEBRA\\zebra\\src\\app_server\\xml\\device.xml','utf8');
        jsonData = await parseDEVICE(xml)
      }else if(req.query.report == "HFS"){
        let xml = fs.readFileSync('C:\\Users\\Administrator\\Desktop\\NEW_ZEBRA\\zebra\\src\\app_server\\xml\\hfs.xml','utf8');
        jsonData = await parseHFS(xml)
      }else if(req.query.report == "IOQ"){
        let xml = fs.readFileSync('C:\\Users\\Administrator\\Desktop\\NEW_ZEBRA\\zebra\\src\\app_server\\xml\\ioq.xml','utf8');
        jsonData = await parseIOQ(xml)
      }else if(req.query.report == "OMVS"){
        let xml = fs.readFileSync('C:\\Users\\Administrator\\Desktop\\NEW_ZEBRA\\zebra\\src\\app_server\\xml\\omvs.xml','utf8');
        jsonData = await parseOMVS(xml)
      }else if(req.query.report == "PAGING"){
        let xml = fs.readFileSync('C:\\Users\\Administrator\\Desktop\\NEW_ZEBRA\\zebra\\src\\app_server\\xml\\paging.xml','utf8');
        jsonData = await parsePAGING(xml)
      }else if(req.query.report == "VSTOR"){
        let xml = fs.readFileSync('C:\\Users\\Administrator\\Desktop\\NEW_ZEBRA\\zebra\\src\\app_server\\xml\\vstor.xml','utf8');
        jsonData = await parseVSTOR(xml)
      }else if(req.query.report == "SDELAY"){
        let xml = fs.readFileSync('C:\\Users\\Administrator\\Desktop\\NEW_ZEBRA\\zebra\\src\\app_server\\xml\\sdelay.xml','utf8');
        jsonData = await parseSDELAY(xml)
      }else if(req.query.report == "PAGESP"){
        let xml = fs.readFileSync('C:\\Users\\Administrator\\Desktop\\NEW_ZEBRA\\zebra\\src\\app_server\\xml\\pagesp.xml','utf8');
        jsonData = await parsePAGESP(xml)
      }else if(req.query.report == "WLMGL"){
        let xml = fs.readFileSync('C:\\Users\\Administrator\\Desktop\\NEW_ZEBRA\\zebra\\src\\app_server\\xml\\wlmgl.xml','utf8');
        jsonData = await parseWLMGL(xml)
      }else if(req.query.report == "XCF"){
        let xml = fs.readFileSync('C:\\Users\\Administrator\\Desktop\\NEW_ZEBRA\\zebra\\src\\app_server\\xml\\xcf.xml','utf8');
        jsonData = await parseXCF(xml)
      }else if(req.query.report == "CPC"){
        let xml = fs.readFileSync('C:\\Users\\Administrator\\Desktop\\NEW_ZEBRA\\zebra\\src\\app_server\\xml\\cpc.xml','utf8');
        jsonData = await parseCPC(xml)
      }else{
        /* let data = await RMFPPgetRequest(ddshttp, baseurl, baseport, rmfppfilename, 'WLMGL', '20220829,20220829', ddsid, ddspass, ddsauth);
        fs.writeFile( "wlmgl.xml", data, (err) => {
          if (err)
            console.log(err);
          else {
            console.log("File written successfully\n");
            jsonData = "Success";
          }
        });   */
        /* let data = await RMFIIIgetRequest(ddshttp, baseurl, baseport, rmfiiifilename, {report: "HSM", resource: urlResource}, ddsid, ddspass, ddsauth);
        fs.writeFile( "hsm.xml", data, (err) => {
          if (err)
            console.log(err);
          else {
            console.log("File written successfully\n");
            jsonData = "Success";
          }
        });  */

      }
      //let data = await RMFPPgetRequest(ddshttp, baseurl, baseport, rmfppfilename, 'CPU', '20220727,20220727', ddsid, ddspass, ddsauth);
      res.json(jsonData);
      
      
    })
    this.express.use('/', router)
  } 
}

export default new App().express