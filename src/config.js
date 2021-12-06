import _ from 'lodash';

const env = (key, defaultVal) => {

  if( process.env[key] != null ){
    let val =  process.env[key];

    if( _.isInteger(defaultVal) ){
      val = parseInt(val);
    }
    else if( _.isBoolean(defaultVal) ){
      val = JSON.parse(val);
    }

    return val;
  } else {
    return defaultVal;
  }
};

export const NODE_ENV = env('NODE_ENV', undefined);

export const INPUT_DIR = env('INPUT_DIR', 'data/output');
export const OUTPUT_DIR = env('OUTPUT_DIR', 'data/output');

// Services
export const REACH_URL = env('REACH_URL', 'http://reach.baderlab.org/api/uploadFile');
export const NCBI_EUTILS_BASE_URL = env('NCBI_EUTILS_BASE_URL', 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/');
export const NCBI_EUTILS_API_KEY = env('NCBI_EUTILS_API_KEY', 'b99e10ebe0f90d815a7a99f18403aab08008');

// Email
export const EMAIL_ADDRESS_INFO = env('EMAIL_ADDRESS_INFO', 'info@biofactoid.org');

