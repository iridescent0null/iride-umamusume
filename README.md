This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
This application is being built to personally learn TypeScript, Promise, NoSQL and other many technology, and streamline my Umamusume Pretty Derby life.

All digital assets and creation concerning Umamusume are reserved by Cygames and horses' owners.


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
In production(?) environment, you MUST NOT deploy authentication information of a writable mongo user. Therefore the apis in public environment will use a read-only user and return a 500 error because of MongoServerError.