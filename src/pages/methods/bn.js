import React from 'react'
import Entry from '../../components/entry'
import Equation from '../../components/Equation'
import Link from '../../components/Link'
import { BlockMath, InlineMath } from 'react-katex'
import CodeBlock from "../../components/CodeBlock"
import { Styled } from "theme-ui"

export default ({data, location}) => {
  let bnCode = `class BN(object):
    @staticmethod
    def generate_prime_order(zbits):
        while True:
            z = randint(2^(zbits - 1), 2^zbits)
            pz = int(BN.p(z))
            if not is_prime(pz):
                continue
            rz = int(BN.r(z))
            if not is_prime(rz):
                continue
            break
        K = GF(pz)
        b = 1
        while True:
            curve = EllipticCurve(K, [0, b])
            card = curve.cardinality()
            if card % rz == 0:
                break
            b += 1
        return curve

    @staticmethod
    def p(z):
        return 36 * z^4 + 36 * z^3 + 24 * z^2 + 6 * z + 1
    @staticmethod
    def r(z):
        return 36 * z^4 + 36 * z^3 + 18 * z^2 + 6 * z + 1
    @staticmethod
    def t(z):
        return 6 * z^2 + 1`;
  return (
    <Entry data={data} location={location} title={"BN"}>
      <Styled.h2>Barreto-Naehrig curves</Styled.h2>
      <Styled.p>
        A class of pairing-friendly curves with embedding degree <InlineMath>k = 12</InlineMath>.
        Given an integer <InlineMath>{`z \\in \\mathbb{N}`}</InlineMath> the BN curve with embedding degree <InlineMath>12</InlineMath> can 
        be constructed over a prime field <InlineMath>{`\\mathbb{F}_p`}</InlineMath> with the number of points <InlineMath>r</InlineMath>
        and a trace of Frobenius <InlineMath>t</InlineMath>.
        <BlockMath>
          {`\\begin{aligned}
          p(z) &= 36 z^4 + 36 z^3 + 24 z^2 + 6 z + 1\\\\
          r(z) &= 36 z^4 + 36 z^3 + 18 z^2 + 6 z + 1\\\\
          t(z) &= 6 z^2 + 1
          \\end{aligned}`}
        </BlockMath>
      </Styled.p>
      <Styled.p>
        The class of curves has the Short-Weierstrass form:
        <Equation>
          y^2 \equiv x^3 + b
        </Equation>
        where given <InlineMath>z</InlineMath> such that <InlineMath>p(z)</InlineMath> is prime, a curve with 
        a prime order subgroup of <InlineMath>r(z)</InlineMath> points can be found either via complex multiplication
        or by exhaustively trying small coefficients <InlineMath>b</InlineMath> until a curve is found.
      </Styled.p>
      <Styled.p>
        The following SageMath code generates BN curves with embedding degree <InlineMath>12</InlineMath>.
      </Styled.p>
      <CodeBlock code={bnCode} language="python"/>
	  <Styled.h4>References</Styled.h4>
	  <ul>
	  	<li>Paulo S. L. M. Barreto, Michael Naehrig: <Link to="https://www.cryptojedi.org/papers/pfcpo.pdf">Pairing-Friendly Elliptic Curves of Prime Order</Link></li>
	  	<li>Geovandro C. C. F. Pereira, Marcos A. Simplício Jr., Michael Naehrig, Paulo S. L. M. Barreto: <Link to="https://eprint.iacr.org/2010/429.pdf">A Family of Implementation-Friendly BN Elliptic Curves</Link></li>
	  	<li>Diego F. Aranha, Laura Fuentes-Castaneda, Edward Knapp, Alfred Menezes, Francisco Rodríguez-Henríquez: <Link to="https://eprint.iacr.org/2012/232.pdf">Implementing Pairings at the 192-bit Security Level</Link></li>
	  </ul>
    </Entry>
  )
}