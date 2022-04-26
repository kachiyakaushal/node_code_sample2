require('dotenv').config(); //instatiate environment variables
var fs = require('fs');

CONFIG = {} //Make this global to use all over the application

CONFIG.app          = process.env.APP   || 'dev';
CONFIG.port         = process.env.PORT  || '3000';
CONFIG.timezone     = process.env.TIMEZONE  || '+05:30';

CONFIG.db_dialect   = process.env.DB_DIALECT    || 'mysql';
CONFIG.db_host      = process.env.DB_HOST       || 'localhost';
CONFIG.db_port      = process.env.DB_PORT       || '3306';
CONFIG.db_name      = process.env.DB_NAME       || 'name';
CONFIG.db_user      = process.env.DB_USER       || 'root';
CONFIG.db_password  = process.env.DB_PASSWORD   || '';

CONFIG.jwt_encryption_admin  = process.env.JWT_ENCRYPTION_ADMIN || 'jwt_please_change';
CONFIG.jwt_expiration  = process.env.JWT_EXPIRATION || '2592000';

CONFIG.filePath  = `${process.env.FILEPATH}/` || '' ;
CONFIG.eventImagePath  = `${process.env.EVENT_IMAGE_PATH}/` || '' ;
CONFIG.storePath  = process.env.UPLOAD_IMAGE_PATH || '';
CONFIG.host = process.env.Host;
CONFIG.redisPort  = process.env.redisPort || 6379 ;
CONFIG.redisUrl = process.env.redisUrl || 'localhost' ;
CONFIG.redisCacheTime = process.env.redisCacheTime || 30 ;

CONFIG.API_VERSION  = process.env.API_VERSION || '0';

CONFIG.welcomeemail = process.env.welcomeemail || "";
CONFIG.contactemail = process.env.contactemail || "";
CONFIG.localtimezone = process.env.localtimezone || "Asia/Kolkata";

CONFIG.SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || "";
 CONFIG.APP_PASSWORD = process.env.APP_PASSWORD


CONFIG.NOTIFICATION_SETTINGS = {
   gcm: {
       id: process.env.Gcm_key || ""
   },
   apn: {
       token: {
          key: fs.readFileSync('./config/certs/test.p8'),
          keyId: process.env.KEYID,
          teamId: process.env.TEAMID,
       },
       production: process.env.APP == "prod" ? true : false, // true for APN production environment, false for APN sandbox environment,
    },
   isAlwaysUseFCM: false
};

CONFIG.DEFAULT_IMAGE_PATH = process.env.DEFAULT_IMAGE_PATH;