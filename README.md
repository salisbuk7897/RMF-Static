# RMF-Static  
 This is a repo containing static typescript RMF Monitor I and III parsers built for ZEBRA version 2 through the OMP Mentorship program 2022.
 
 # How to Run
   - npm install from the root folder
   - Create a folder named ```Config``` under src
   - add a ```Zconfig.json``` file to a Config
   - use ```npm run dev``` to run
   - go to ```http:localhost:3080``` to test
   
 # Zebra Configuration parameters for Zconfig.json file
 1. **dds** : This contains DDS information on multiple LPAR’s as a nested JSON. The nested JSON contains:
  *	***Key***:  
   The key will be the LPAR name and this key will be used as {lpar_name} in the new API structure.
  * ***Value***:  
        The value for each key (LPAR name) a JSON containing:
        
      * **ddshhttptype** : This is the hypertext transfer protocol type of the DDS. Its value is either http or https. E.g ***ddshttptype : http***  

      * **ddsbaseurl** : IP address or domain name of z/OS RMF DDS Server. E.g ***ddsurl : 127.0.0.1***

      * **ddsbaseport**:   port number used when accessing above DDS Server. The typical default DDS port number if 8803. E.g ***ddsport : 8888***

      * **ddsauth** : This config parameter determines the type of connection to DDS, either with authentication or without authentication. Its value is either true or false. If value is set to true, ZEBRA will require username and password with which to connect to DDS. E.g ***ddsauth : false***

      * **ddsuser** : This is the username with which ZEBRA will connect to DDS if value of ddsauth is set to true. E.g. ***ddsuser : userID***

      * **ddspwd** : This is thepassword with which ZEBRA will connect to DDS if value of ddsauth is set to true. E.g. ***ddspwd : Password***

      * **rmf3filename**:  filename/extension used when DDS RMF service sends RMF 3 data to its Web API. The default value is 'rmfm3.xml'. E.g ***rmf3filename : rmfm3.xml***

      * **rmfppfilename**: filename/extension used when DDS RMF service sends RMF I Post Processor data to its Web API. The default value is 'rmfpp.xml'. E.g ***rmfppfilename : rmfpp.xml***

      * **mvsResource**:   Parameter value for RMF DDS Monitor III resource identifier. E.g ***mvsResource : ,SYS,RESOURCE***  

# Sample JSON
```
{
    "dds" : {
        "RPRT": {
            "ddshhttptype":"http",
            "ddsbaseurl":"",
            "ddsbaseport":"8803",
            "ddsauth":"true",
            "ddsuser":"",
            "ddspwd":"",
            "rmf3filename":"rmfm3.xml",
            "rmfppfilename":"rmfpp.xml",
            "mvsResource":""
        }
    }
}
```

# URL Endpoints
  for Monitor III, use ```/monitor=RMF3&report={report_name}```. E.g ```/monitor=RMF3&report=CPC```. for Monitor one, Use ```report={report_name}``` to use the static parser for that report or use ```/monitor=RMF1&report={report_name}&date=20220809,20220809``` to use the generic parser. Please remeber to use a recent date
