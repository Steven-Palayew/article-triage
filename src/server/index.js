import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import util from 'util';

import { DATA_DIR } from '../config';
import { searchPubmed } from './pubmed/searchPubmed';


const writeFile = util.promisify( fs.writeFile );


const search = ({ issn, volume, issue }) => {
  let baseTerm = `${issn}[IS] AND ${volume}[VI]`;
  let issueTerm = `${issue}[IP]`;
  let pubTypes = [
    '"Journal Article"[PT]'
  ].join(' AND ');
  let excludedPubTypes = [
    'Review[PT]',
    'Editorial[PT]',
    '"Published Erratum"[PT]',
    'Comment[PT]',
    '"Retracted Publication"[PT]',
    '"Retraction of Publication"[PT]'
  ].join(' OR ');

  if ( issue ){
    baseTerm += ` AND ${issueTerm}`;
  }

  const term = `${baseTerm} AND (${pubTypes}) NOT (${excludedPubTypes})`;
  const opts = {
    retmax: 10000
  };
  return searchPubmed( term, opts );
};

const getPmidsForJournal = async ({ issn, volumes, issues }) => {
  const ids = new Set();
  for ( const volume of volumes ){

    if( issues.length ){
      for ( const issue of issues ){
        let { searchHits } = await search( { issn, volume, issue } );
        searchHits.forEach( ids.add, ids );
      }

    } else {
      let { searchHits } = await search( { issn, volume } );
      searchHits.forEach( ids.add, ids );
    }
  }

  return ids;
};

const writeToFile = async ( fileName, data ) => {
  const filePath = path.join( DATA_DIR, fileName );
  try {
    await writeFile( filePath, data );
  } catch ( err ){
    console.error( err );
  }
};

//    with open('{issn}.txt'.format(issn=journal), 'a') as f:
//      for item in ids:
//        f.write('{item}\n'.format(item=item))

const main = async () => {
  const issn = '1476-5403';
  const data1 = {
    issn,
    volumes: [27],
    issues: _.range( 7, 13 )
  };
  const ids = await getPmidsForJournal( data1 );
  console.log( [...ids] );
  await writeToFile( `${issn}.txt`, JSON.stringify([...ids]) );
};

main();