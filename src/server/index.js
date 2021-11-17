import _ from 'lodash';

import { searchPubmed } from './pubmed/searchPubmed';

const search = ( issn, volume, issue ) => {
  let baseTerm = `${issn}[IS] AND ${volume}[VI]`;
  let issueTerm = `${issue}[IP]`;
  let pubTypes = `"Journal Article"[PT]`;
  let excludedPubTypes = `Review[PT] OR Editorial[PT] OR "Published Erratum"[PT] OR Comment[PT] OR "Retracted Publication"[PT] OR "Retraction of Publication"[PT]`;

  if ( issue ){
    baseTerm += ` AND ${issueTerm}`;
  }

  const term = `${baseTerm} AND ${pubTypes} NOT (${excludedPubTypes})`;
  console.log( term );

  const opts = {};
  const response = searchPubmed( db='pubmed', term=term, retmax=10000 )
  //  record = Entrez.read( handle )
  //  handle.close()
  // return record
};

const issn = '1476-5403';
const vols = _.range( 27, 29 );
const iss = _.range( 7, 11 );
search( '1476-5403', '27', '7');

//  def getPmidsForJournal():
//    ids = []
//    for volume in volumes:
//      for issue in issues:
//        record = esearch( journal, volume, issue )
//        ids += record['IdList']

//    with open('{issn}.txt'.format(issn=journal), 'a') as f:
//      for item in ids:
//        f.write('{item}\n'.format(item=item))