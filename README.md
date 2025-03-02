This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
This application is being built to personally learn TypeScript, Promise, NoSQL and other many technology, and streamline my Umamusume Pretty Derby life.

All digital assets and creation concerning Umamusume are reserved by Cygames and horses' owners.

__How to start__  
0: the authentication information to connect to the MongoDB was intentionally omitted from the github repository, then you have to deploy it in the right place.    
1: put secret/webRoot.tsx and write the following information into it:  
const _info = {  
    schem: "http",  
    pureDomain: "ec2-xx-xxx-xx-xx.ap-northeast-1.compute.amazonaws.com", 
    port: 8080  
}  
2: in the irid-umamusume directory, run a command like:  
npm run dev  
  
(Of course the web information is not a secret, but the secret folder contains all files which should not be controlled by git.)  
  
__Diagnostic__
0: confirm the machine and service actually started  
1: try to connect http:/{domain}/api/version  
    if it is not accessible, you might have to fix network settings, security group settings, or user who run the npm service.  
    be cautious about nornally non-root users cannot use 443 or 80 port.  
2: try to connect http:/{domain}/api/hofuma/all
    if it fails, you might have to fix authentication or privilege settings on MongoDB, or install mongosh into the machine
3: try to see http:/{domain}/hof/register  
    If it fails to show skills, Next might be failing to resolve the urls to the apis. Check the webinfo.ts  
    If it shows the skills but doesn't show pictures, you might have failed to deploy the images in the public path


__How to take backup of MongoDB tables from MacOS__  
0: install mongo db tool.  
It is a little tricky. You might have to run commands before installing the tools, and xcode-select install might be time-consuming.
  
    brew tap mongodb/brew  
    xcode-select --install  
    brew install mongodb-database-tools  
  
1: run mongodump like following: 

    mongodump --uri "mongodb+srv://USERNAME:PASSWORD@CLUSTERNAME/umamusume" -o ./mongo-backup  
it doesn't require writable role user.  
  
__About DB User__  
In production(?) environment, you MUST NOT deploy authentication information of a writable mongo user. Therefore some of the apis in public environment will use a read-only user and return a 500 error because of MongoServerError.