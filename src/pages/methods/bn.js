import React from 'react'
import Entry from '../../components/entry'
import Link from '../../components/Link'
import { BlockMath, InlineMath } from 'react-katex';

export default ({data, location}) => {

  return (
    <Entry data={data} location={location} title={"BN"}>
      <h2>Barreto-Naehrig curves</h2>
      <p>
        A class of pairing-friendly curves with embedding degree <InlineMath>k = 12</InlineMath>.
        <BlockMath>
          {`\\begin{aligned}
          p(z) &= 36 z^4 + 36 z^3 + 24 z^2 + 6 z + 1\\\\
          r(z) &= 36 z^4 + 36 z^3 + 18 z^2 + 6 z + 1\\\\
          t(z) &= 6 z^2 + 1
          \\end{aligned}`}
        </BlockMath>
      </p>
    </Entry>
  )
}