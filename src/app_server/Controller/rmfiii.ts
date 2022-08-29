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

export default async function RMFIIIgetRequest(ddshttp, baseurl, baseport, rmf3filename, params, ddsid, ddspass, ddsauth) {
    try {
        var urlParams = "?";
        for (const param in params) {
            if (!params[param]) {
            continue;
            }
            urlParams = urlParams.concat(`${param}=${params[param]}&`);
        }
      var RMFIIIURL =  `${ddshttp}://${baseurl}:${baseport}/gpm/${rmf3filename}${urlParams}`; //Dynamically create URL;
      // 👇️ const data: GetUsersResponse
      if(ddsauth === 'true'){
        const { data } = await axios.get(
            RMFIIIURL,
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
            RMFIIIURL,
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
  