import React from 'react'
import Entry from '../../components/entry'
import Link from '../../components/Link'
import { Styled } from "theme-ui"

export default ({data, location}) => {

  return (
    <Entry data={data} location={location} title={"Methods"}>
      <Styled.p>
        The standard curves present in this database were mostly generated using several
        publicly known algorithms or were selected in an unspecified way. The generation
        algorithms used can be roughly categorized as:
      </Styled.p>
      <ul>
        <li>Verifiably random algorithms</li>
        <ul>
          <li><Link to={"/methods/x962"}>ANSI X9.62</Link></li>
          <li><Link to={"/methods/secg"}>SECG</Link></li>
          <li><Link to={"/methods/nist"}>NIST</Link></li>
          <li><Link to={"/methods/brainpool"}>Brainpool</Link></li>
        </ul>
        <li>Pairing-friendly curves</li>
        <ul>
          <li><Link to={"/methods/bn"}>BN</Link></li>
          <li><Link to={"/methods/bls"}>BLS</Link></li>
          <li><Link to={"/methods/mnt"}>MNT</Link></li>
          <li><Link to={"/methods/kss"}>KSS</Link></li>
        </ul>
        <li>Complex multiplication</li>
      </ul>
    </Entry>
  )
}