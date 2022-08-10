import axios from 'axios';
let ddsconfig;
try{
  ddsconfig = require("../../config/Zconfig.json");
}catch(e){
  ddsconfig = {}
}
/* let apiml_http_type = ddsconfig.apiml_http_type;
let apiml_IP = ddsconfig.apiml_IP;
let apiml_port = ddsconfig.apiml_port;
let username = ddsconfig.apiml_username;
let password = ddsconfig.apiml_password;
let apiml_auth = ddsconfig.apiml_auth_type; */

export default async function RMFPPgetRequest(ddshttp, baseurl, baseport, rmfppfilename, urlReport, urlDate, ddsid, ddspass, ddsauth) {
    try {
      var RMFPPURL = `${ddshttp}://${baseurl}:${baseport}/gpm/${rmfppfilename}?reports=${urlReport}&date=${urlDate}`;
      // 👇️ const data: GetUsersResponse
      if(ddsauth === 'true'){
        const { data } = await axios.get(
            RMFPPURL,
            {
                auth: {
                  username: ddsid,
                  password: ddspass
                },
                headers: {
                    Accept: 'application/json',
                }
              },
          );
      
          return data;
      }else{
        const { data } = await axios.get(
            RMFPPURL,
            {
              headers: {
                Accept: 'application/json',
              },
            },
          );
      
          return data;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        //console.log('error message: ', error.message);
        return error.message;
      } else {
        //console.log('unexpected error: ', error);
        return 'An unexpected error occurred';
      }
    }
  }
  