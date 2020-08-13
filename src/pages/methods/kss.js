import React from 'react'
import Entry from '../../components/entry'
import Equation from '../../components/Equation'
import Link from '../../components/Link'
import { BlockMath, InlineMath } from 'react-katex'
import CodeBlock from "../../components/CodeBlock"
import { Styled } from "theme-ui"

export default ({data, location}) => {
  let kssCode = `class KSS(object):
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

class KSS16(KSS):
    @staticmethod
    def p(z):
        return (z^10 + 2 * z^9 + 5 * z^8 + 48 * z^6 + 152 * z^5 + 240 * z^4 + 625 * z^2 + 2398 * z + 3125)/9801
    @staticmethod
    def r(z):
        return z^8 + 48 * z^4 + 625
    @staticmethod
    def t(z):
        return (2 * z^5 + 41 * z + 35)/35

class KSS18(KSS):
    @staticmethod
    def p(z):
        return (z^8 + 5 * z^7 + 7 * z^6 + 37 * z^5 + 188 * z^4 + 259 * z^3 + 343 * z^2 + 1763 * z + 2401)/21
    @staticmethod
    def r(z):
        return z^6 + 37 * z^3 + 343
    @staticmethod
    def t(z):
        return (z^4 + 16 * z + 7)/7

class KSS36(KSS):
    @staticmethod
    def p(z):
        return (z^14 - 4 * z^13 + 7 * z^12 + 683 * z^8 - 2510 * z^7 + 4781 * z^6 + 117649 * z^2 - 386569 * z + 823543)/28749
    @staticmethod
    def r(z):
        return z^12 + 683 * z^6 + 117649
    @staticmethod
    def t(z):
        return (2 * z^7 + 757 * z + 259)/259

class KSS40(KSS):
    @staticmethod
    def p(z):
        return (z^22 - 2 * z^21 + 5 * z^20 + 6232 * z^12 - 10568 * z^11 + 31160 * z^10 + 9765625 * z^2 - 13398638 * z + 48828125)/1123380
    @staticmethod
    def r(z):
        return z^16 + 8 * z^14 + 39 * z^12 + 112 * z^10 - 79 * z^8 + 2800 * z^6 + 24375 * z^4 + 125000 * z^2 + 390625
    @staticmethod
    def t(z):
        return (2 * z^11 + 6469 * z + 1185)/1185`;
  return (
    <Entry data={data} location={location} title={"KSS"}>
      <Styled.h2>Kachisa-Schaefer-Scott curves</Styled.h2>
      <Styled.p>
        A class of pairing-friendly curves with embedding degree <InlineMath>{`k \\in \\{16,18,36,40\\}`}</InlineMath>.
        Given an integer <InlineMath>{`z \\in \\mathbb{N}`}</InlineMath> a KSS curve can 
        be constructed over a prime field <InlineMath>{`\\mathbb{F}_p`}</InlineMath> with the number of points <InlineMath>r</InlineMath> and 
        a trace of Frobenius <InlineMath>t</InlineMath> as follows:
      </Styled.p>
      <Styled.h3><InlineMath>k = 16</InlineMath></Styled.h3>
      <Styled.p>
        <BlockMath>
          {`\\begin{aligned}
          p(z) &= (z^{10} + 2 z^9 + 5 z^8 + 48 z^6 + 152 z^5 + 240 z^4 + 625 z^2 + 2398 z + 3125)/9801\\\\
          r(z) &= z^8 + 48 z^4 + 625\\\\
          t(z) &= (2 z^5 + 41 z + 35)/35
          \\end{aligned}`}
        </BlockMath>
      </Styled.p>
      <Styled.h3><InlineMath>k = 18</InlineMath></Styled.h3>
      <Styled.p>
        <BlockMath>
          {`\\begin{aligned}
          p(z) &= (z^8 + 5 z^7 + 7 z^6 + 37 z^5 + 188 z^4 + 259 z^3 + 343 z^2 + 1763 z + 2401)/21\\\\
          r(z) &= z^6 + 37 z^3 + 343\\\\
          t(z) &= (z^4 + 16 z + 7)/7
          \\end{aligned}`}
        </BlockMath>
      </Styled.p>
      <Styled.h3><InlineMath>k = 36</InlineMath></Styled.h3>
      <Styled.p>
        <BlockMath>
          {`\\begin{aligned}
          p(z) &= (z^{14} - 4 z^{13} + 7 z^{12} + 683 z^8 - 2510 z^7 + 4781 z^6 + 117649 z^2 - 386569 z + 823543)/28749\\\\
          r(z) &= z^{12} + 683 z^6 + 117649\\\\
          t(z) &= (2 z^7 + 757 z + 259)/259
          \\end{aligned}`}
        </BlockMath>
      </Styled.p>
      <Styled.h3><InlineMath>k = 40</InlineMath></Styled.h3>
      <Styled.p>
        <BlockMath>
          {`\\begin{aligned}
          p(z) &= (z^{22} - 2 z^{21} + 5 z^{20} + 6232 z^{12} - 10568 z^{11} + 31160 z^{10} + 9765625 z^2 - 13398638 z + 48828125)/1123380\\\\
          r(z) &= z^{16} + 8 z^{14} + 39 z^{12} + 112 z^{10} - 79 z^8 + 2800 z^6 + 24375 z^4 + 125000 z^2 + 390625\\\\
          t(z) &= (2 z^{11} + 6469 z + 1185)/1185
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
        The following SageMath code generates KSS curves.
      </Styled.p>
      <CodeBlock code={kssCode} language="python"/>
	  <Styled.h4>References</Styled.h4>
	  <ul>
	  	<li>Ezekiel J. Kachisa, Edward F. Schaefer, Michael Scott: <Link to="https://link.springer.com/chapter/10.1007/978-3-540-85538-5_9">Constructing Brezing-Weng Pairing-Friendly Elliptic Curves Using Elements in the Cyclotomic Field</Link></li>
	  	<li>Diego F. Aranha, Laura Fuentes-Castaneda, Edward Knapp, Alfred Menezes, Francisco Rodríguez-Henríquez: <Link to="https://eprint.iacr.org/2012/232.pdf">Implementing Pairings at the 192-bit Security Level</Link></li>
	 </ul>
    </Entry>
  )
}