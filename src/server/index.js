import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import util from 'util';

import { INPUT_DIR, OUTPUT_DIR } from '../config';
import { searchPubmed } from './pubmed/searchPubmed';
import journal_data from '../../data/input/journal_data.json';

const appendFile = util.promisify( fs.appendFile );

const search = ({ issn, volume, issue, dates }) => {
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

  if ( dates ) {
    _.assign( opts, {
      mindate: dates[0],
      maxdate: dates[1],
      datetype: 'pdat'
    });
  }
  return searchPubmed( term, opts );
};

const normalizeIssues = issues => {
  let result = issues;
  const isInteger = q => Number.isInteger( q );

  const hasIssues = !_.isNil( issues ) && !_.isEmpty( issues );
  const isRange = hasIssues && issues.length === 2 && isInteger( issues[0] ) && isInteger( issues[1] );

  if( isRange ){
    result = _.range( issues[0], issues[1] + 1 );
  }

  return result;
};

const getPmidsForJournal = async ({ issn, volumes, issues, dates }) => {
  const ids = new Set();

  const normalIssues = normalizeIssues( issues );

  for ( const volume of volumes ){

    if( normalIssues && normalIssues.length ){
      for ( const issue of normalIssues ){
        let { searchHits } = await search( { issn, volume, issue, dates } );
        searchHits.forEach( ids.add, ids );
      }

    } else {
      let { searchHits } = await search( { issn, volume, dates } );
      searchHits.forEach( ids.add, ids );
    }
  }

  return ids;
};

const appendToFile = async ( fileName, data ) => {
  const filePath = path.join( OUTPUT_DIR, fileName );
  try {
    await appendFile( filePath, data );
  } catch ( err ){
    console.error( err );
  }
};

const main = async () => {

  for ( const datum of journal_data ) {
    const ids = await getPmidsForJournal( datum );
    await appendToFile( `all_ids.txt`, [...ids].map(JSON.stringify).join('\n').concat("\n") );
  }

};

main();