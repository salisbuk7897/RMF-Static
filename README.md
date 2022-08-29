# RMF-Static  
 This is a repo containing static typescript RMF Monitor I and III parsers built for ZEBRA version 2 through the OMP Mentorship program 2022.
 
 # How to Run
   - npm install from the root folder
   - Create a folder named ```Config``` under src
   - add a ```Zconfig.json``` file to a Config
   - use ```npm run dev``` to run
   - go to ```http:localhost:3080``` to test
   
# URL Endpoints
  for Monitor III, use ```/monitor=RMF3&report={report_name}```. E.g ```/monitor=RMF3&report=CPC```. for Monitor one, Use ```report={report_name}``` to use the static parser for that report or use ```/monitor=RMF1&report={report_name}&date=20220809,20220809``` to use the generic parser. Please remeber to use a recent date
