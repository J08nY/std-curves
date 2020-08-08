import React from 'react'
import Entry from '../components/entry'
import Link from '../components/Link'

export default ({ data, location }) => {
  return (
    <Entry data={data} location={location} title={"Home"}>
      This page contains a list of standardised elliptic curves, collected from many standards by the team
      at <Link to="https://crocs.fi.muni.cz/">Centre for Research on Cryptography and Security</Link>. For our
      other ECC related projects see:
      <ul>
        <li><Link to="https://github.com/crocs-muni/ECTester">ECTester</Link>: A tool for testing black-box ECC implementations</li>
        <li><Link to="https://github.com/J08nY/pyecsca">pyecsca</Link>: A Python Elliptic Curve Side-Channel Analysis toolkit, focusing on reverse-engineering ECC implementations</li>
        <li><Link to="https://github.com/J08nY/ecgen">ecgen</Link>: A tool for generating EC domain parameters</li>
      </ul>
      The curve listing includes its parameters, computed characteristics such as number of points or j-invariant as well 
      as SAGE code which can be used to instantiate the curve and a JSON export of all of the curve data.
      New curves are currently being added, the database is definitely not complete.

      The presence of a certain curve in this database does not mean that the curve is secure, only that it is notable enough or that someone suggested
      its use in a publication or a standard. We made a best effort attempt to make sure all parameters presented here are correct, however mistakes
      could have happened on data import (the database now contains more than 180 curves) and thus double-checking with the source document is recommended.
      <br/>
      Thanks to Jan Dušátko for providing some of the curve data.
    </Entry>
  )
}