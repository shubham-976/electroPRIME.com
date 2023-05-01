
**electroPRIME (an exclusive online store for 'ELECTRONICS')**  
=> electroPRIME is basically an online store where you can find all electronic items you want to buy. Its a store with vast varieties/categories of products and thats too at the best prices.  

**ABOUT the project :**  
=> Its a full stack project just developed for the learning purpose, using :  
 * mongoDB (Atlas i.e mongoDB cloud database)
 * Express (for backend)
 * React (for frontend)
 * NodeJS (for backend)
 * REST APIs    
=> Also, some other important Libraries/Tools/APIs used are:
 * Cloudinary (for image storage at cloud)
 * STRIPE (for managing payment/transactions)
 * MUI - MaterialUI (for various frontend components)

**Installing the required Dependencies :**  
For backend : npm install  
For frontend : cd frontend  , npm install  
(package.json and package-lock.json of root folder belongs to backend usually , and these corresponding files for frontend are in frontend folder)

**To run on Local Machine :**  
* install dependencies as mentioned above , then
* cd frontend, npm run build
* in root folder : npm run dev (i.e. node backend/server.js)
* now in browser go for : localhost:4000 , and done, site is live on local machine


**Environment Variables (IMPORTANT) :**  
Please make sure to make a config.env file in backend/config folder (its for local machine becoz for server there is seperate section where we can provide all our env variables instead of uploading config.env directly there), which will contain the values of various environment varaibles, which are very important for this project to work and also obviously these values will vary for individuals according to their preferences/accountDetails :

PORT =  
DB_URI = (if running on local machine, can put local database URL or for production purpose, obviously to put cloud database URL)  
JWT_SECRET =  
JWT_EXPIRE =  
COOKIE_EXPIRE =  
SMTP_SERVICE =  
SMTP_MAIL =  
SMTP_PASSWORD =  
SMTP_HOST =  
SMTP_PORT =  
CLOUDINARY_NAME =  
CLOUDINARY_API_KEY =  
CLOUDINARY_API_SECRET =  
STRIPE_API_KEY =  
STRIPE_SECRET_KEY = 

**About me :**   
Shubham
CSE'2024
NIT KKR
