import React from 'react'
import Entry from '../../components/entry'
import { Styled } from "theme-ui"
import Link from "../../components/Link";

export default ({data, location}) => {

  return (
    <Entry data={data} location={location} title={"Brainpool"}>
      <Styled.h2>Brainpool</Styled.h2>

      <Styled.p>

      </Styled.p>
      <Styled.h4>References</Styled.h4>
      <ol>
        <li id="brainpool-std">Manfred Lochter: <Link to="http://www.ecc-brainpool.org/download/Domain-parameters.pdf">ECC Brainpool Standard Curves and Curve Generation v. 1.0</Link>, <Link to="https://web.archive.org/web/20170921224120/http://www.ecc-brainpool.org/download/Domain-parameters.pdf">[archive]</Link></li>
        <li id="rfc-5639">Manfred Lochter, Johannes Merkle: <Link to="https://tools.ietf.org/html/rfc5639">Elliptic Curve Cryptography (ECC) Brainpool Standard
          Curves and Curve Generation (RFC5639)</Link></li>
        <li id="bada55-brainpool">BADA55 Research Team: <Link to="https://bada55.cr.yp.to/brainpool.html">BADA55 Crypto - Brainpool curves</Link></li>
      </ol>

    </Entry>
  )
}