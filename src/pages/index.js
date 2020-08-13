/** @jsx jsx */
import React from 'react'
import Entry from '../components/entry'
import Link from '../components/Link'
import {graphql} from "gatsby";
import { jsx, Styled } from "theme-ui"

export const query = graphql`
    query IndexQuery {
        allCurve {
            nodes {
                aliases
                name
                parent {
                    parent {
                        parent {
                            ... on File {
                                relativeDirectory
                            }
                        }
                    }
                }
            }
        }
    }
`

export default ({data, location}) => {
  let names = [];
  data.allCurve.nodes.forEach((curve) => {
    let aliases = [curve.parent.parent.parent.relativeDirectory + "/" + curve.name];
    if (curve.aliases) {
      curve.aliases.forEach((alias) => {aliases.push(alias)});
    }
    let present = false;
    aliases.forEach((alias) => {
      if (present || names.includes(alias)) {
        present = true;
      }
    });
    if (!present) {
      names.push(aliases[0]);
    }
  });
  let allCurves = data.allCurve.nodes.length;
  let uniqueCurves = names.length;
  return (
    <Entry data={data} location={location} title={"Home"}>
      <Styled.p>
        This page contains a list of standardised elliptic curves, collected from many standards by the team
        at <Link to="https://crocs.fi.muni.cz/">Centre for Research on Cryptography and Security</Link>. For our
        other ECC related projects see:
      </Styled.p>
      <ul>
        <li><Link to="https://github.com/crocs-muni/ECTester">ECTester</Link>: A tool for testing black-box ECC
          implementations
        </li>
        <li><Link to="https://github.com/J08nY/pyecsca">pyecsca</Link>: A Python Elliptic Curve Side-Channel Analysis
          toolkit, focusing on reverse-engineering ECC implementations
        </li>
        <li><Link to="https://github.com/J08nY/ecgen">ecgen</Link>: A tool for generating EC domain parameters</li>
      </ul>
      <Styled.p>
        The curve listing includes its parameters, computed characteristics such as number of points or j-invariant as
        well as SAGE code which can be used to instantiate the curve and a JSON export of all of the curve data.
        New curves are currently being added, the database is definitely not complete.
      </Styled.p>
      <Styled.p>
        The presence of a certain curve in this database does not mean that the curve is secure, only that it is notable
        enough or that someone suggested its use in a publication or a standard. We made a best effort attempt to make sure all parameters presented here
        are correct, however mistakes could have happened on data import and thus double-checking
        with the source document is recommended. The database currently contains <b>{allCurves}</b> curves, out of which <b>{uniqueCurves}</b> are unique.
      </Styled.p>
      <Styled.h4>Authors</Styled.h4>
      <ul>
      	<li>Ján Jančár</li>
      	<li>Vladimír Sedláček</li>
      </ul>
      <Styled.p>
        Thanks to Jan Dušátko for providing some of the curve data.
      </Styled.p>
    </Entry>
  )
}