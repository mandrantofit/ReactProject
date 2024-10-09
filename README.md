# ReactProject
run this command before on components ,
 components/adminComponents , and pages 

$> find . -type f -name "*.js" -exec sed -i 's/localhost/172.25.52.205/g' {} +
 
or Change de BaseUrl on frontend/src/config.js 
thanks
