import React from 'react'
import Entry from '../../components/entry'
import Equation from '../../components/Equation'
import Link from '../../components/Link'
import {BlockMath, InlineMath} from 'react-katex';
import {jsx, Styled} from "theme-ui";
import Highlight, { defaultProps } from "prism-react-renderer";
import dracula from 'prism-react-renderer/themes/dracula';

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
        return z + 1
 `;
  return (
    <Entry data={data} location={location} title={"BLS"}>
      <h2>Barreto-Lynn-Scott curves</h2>
      <p>A class of pairing-friendly curves with embedding degree <InlineMath>{`k \\in \\{12, 24\\}`}</InlineMath>.</p>
      <h3>BLS12</h3>
      <p>
        Given an integer <InlineMath>{`z \\in \\mathbb{N}`}</InlineMath> the BLS curve with embedding degree <InlineMath>12</InlineMath> can 
        be constructed over a prime field <InlineMath>{`\\mathbb{F}_p`}</InlineMath> with the number of points <InlineMath>r</InlineMath> and 
        a trace of Frobenius <InlineMath>t</InlineMath>.
        <BlockMath>
          {`\\begin{aligned}
          p(z) &= (z - 1)^2 (z^4 - z^2 + 1)/3 + z\\\\
          r(z) &= z^4 - z^2 + 1\\\\
          t(z) &= z + 1
          \\end{aligned}`}
        </BlockMath>
      </p>
      <h3>BLS24</h3>
      <p>
        Given an integer <InlineMath>{`z \\in \\mathbb{N}`}</InlineMath> the BLS curve with embedding degree <InlineMath>24</InlineMath> can 
        be constructed over a prime field <InlineMath>{`\\mathbb{F}_p`}</InlineMath> with the number of points <InlineMath>r</InlineMath> and 
        a trace of Frobenius <InlineMath>t</InlineMath>.
        <BlockMath>
          {`\\begin{aligned}
          p(z) &= (z - 1)^2 (z^8 - z^4 + 1)/3 + z\\\\
          r(z) &= z^8 - z^4 + 1\\\\
          t(z) &= z + 1
          \\end{aligned}`}
        </BlockMath>
      </p>
      <p>
        The class of curves has the Short-Weierstrass form:
        <Equation>
          y^2 \equiv x^3 + b
        </Equation>
        where given <InlineMath>z</InlineMath> such that <InlineMath>p(z)</InlineMath> is prime, a curve with 
        a prime order subgroup of <InlineMath>r(z)</InlineMath> points can be found either via complex multiplication
        or by exhaustively trying small coefficients <InlineMath>b</InlineMath> until a curve is found.
      </p>
      <p>
        The following SageMath code generates BLS curves with embedding degree <InlineMath>12</InlineMath> and <InlineMath>24</InlineMath>.
      </p>
	  <Highlight {...defaultProps} theme={dracula} code={blsCode} language="python">
	    {({ className, style, tokens, getLineProps, getTokenProps }) => (
	      <Styled.pre className={className} style={style}>
	        {tokens.map((line, i) => (
	          <div {...getLineProps({ line, key: i })}>
	            {line.map((token, key) => (
	              <span {...getTokenProps({ token, key })} />
	            ))}
	          </div>
	        ))}
	      </Styled.pre>
	    )}
	  </Highlight>
	  
  	  <h4>References</h4>
	  <ul>
	  	<li>Paulo S. L. M. Barreto, Ben Lynn, Michael Scott: <Link to="https://eprint.iacr.org/2002/088.pdf">Constructing Elliptic Curves with Prescribed Embedding Degrees</Link></li>
	  	<li>Diego F. Aranha, Laura Fuentes-Castaneda, Edward Knapp, Alfred Menezes, Francisco Rodríguez-Henríquez: <Link to="https://eprint.iacr.org/2012/232.pdf">Implementing Pairings at the 192-bit Security Level</Link></li>
	  </ul>

    </Entry>
  )
}