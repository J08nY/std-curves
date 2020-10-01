import React from 'react'
import Entry from '../../components/entry'
import Link from '../../components/Link'
import CodeBlock from '../../components/CodeBlock'
import { Styled } from "theme-ui";
import {BlockMath, InlineMath} from 'react-katex';

export default ({data, location}) => {
  let blsCode = `class BLS(object):
    @classmethod
    def generate_prime_order(cls, zbits):
        while True:
            z = randint(2^(zbits - 1), 2^zbits)
            pz = int(cls.p(z))
            if not is_prime(pz):
                continue
            rz = int(cls.r(z))
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


class BLS12(BLS):
    @staticmethod
    def p(z):
        return (z - 1)^2 * (z^4 - z^2 + 1)/3 + z
    @staticmethod
    def r(z):
        return z^4 - z^2 + 1
    @staticmethod
    def t(z):
        return z + 1


class BLS24(BLS):
    @staticmethod
    def p(z):
        return (z - 1)^2 * (z^8 - z^4 + 1)/3 + z
    @staticmethod
    def r(z):
        return z^8 - z^4 + 1
    @staticmethod
    def t(z):
        return z + 1`;
  return (
    <Entry data={data} location={location} title={"BLS"}>
      <Styled.h2>Barreto-Lynn-Scott curves</Styled.h2>
      <Styled.p>A class of pairing-friendly curves with embedding degree <InlineMath>{`k \\in \\{12, 24\\}`}</InlineMath>.</Styled.p>
      <Styled.h3>BLS12</Styled.h3>

      <Styled.p>
        Given an integer <InlineMath>{`z \\in \\mathbb{N}`}</InlineMath> the BLS curve with embedding degree <InlineMath>12</InlineMath> can 
        be constructed over a prime field <InlineMath>{`\\mathbb{F}_p`}</InlineMath> with the number of points <InlineMath>r</InlineMath> and 
        a trace of Frobenius <InlineMath>t</InlineMath>.
      </Styled.p>
      <BlockMath>
        {`\\begin{aligned}
          p(z) &= (z - 1)^2 (z^4 - z^2 + 1)/3 + z\\\\
          r(z) &= z^4 - z^2 + 1\\\\
          t(z) &= z + 1
          \\end{aligned}`}
      </BlockMath>
      <Styled.h3>BLS24</Styled.h3>
      <Styled.p>
        Given an integer <InlineMath>{`z \\in \\mathbb{N}`}</InlineMath> the BLS curve with embedding degree <InlineMath>24</InlineMath> can 
        be constructed over a prime field <InlineMath>{`\\mathbb{F}_p`}</InlineMath> with the number of points <InlineMath>r</InlineMath> and 
        a trace of Frobenius <InlineMath>t</InlineMath>.
      </Styled.p>
      <BlockMath>
        {`\\begin{aligned}
          p(z) &= (z - 1)^2 (z^8 - z^4 + 1)/3 + z\\\\
          r(z) &= z^8 - z^4 + 1\\\\
          t(z) &= z + 1
          \\end{aligned}`}
      </BlockMath>
      <Styled.p>
        The class of curves has the Short-Weierstrass form:
      </Styled.p>
        <BlockMath>
          y^2 \equiv x^3 + b
        </BlockMath>
      <Styled.p>
        where given <InlineMath>z</InlineMath> such that <InlineMath>p(z)</InlineMath> is prime, a curve with 
        a prime order subgroup of <InlineMath>r(z)</InlineMath> points can be found either via complex multiplication
        or by exhaustively trying small coefficients <InlineMath>b</InlineMath> until a curve is found.
      </Styled.p>
      <Styled.p>
        The following SageMath code generates BLS curves with embedding degree <InlineMath>12</InlineMath> and <InlineMath>24</InlineMath>.
      </Styled.p>
	    <CodeBlock code={blsCode} language="python"/>
	  
  	  <Styled.h4>References</Styled.h4>
	  <ul>
	  	<li>Paulo S. L. M. Barreto, Ben Lynn, Michael Scott: <Link to="https://eprint.iacr.org/2002/088.pdf">Constructing Elliptic Curves with Prescribed Embedding Degrees</Link></li>
	  	<li>Diego F. Aranha, Laura Fuentes-Castaneda, Edward Knapp, Alfred Menezes, Francisco Rodríguez-Henríquez: <Link to="https://eprint.iacr.org/2012/232.pdf">Implementing Pairings at the 192-bit Security Level</Link></li>
	  </ul>

    </Entry>
  )
}