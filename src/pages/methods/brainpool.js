import React from 'react'
import Entry from '../../components/entry'
import { Styled } from "theme-ui"
import Link from "../../components/Link";
import Pseudocode from "../../components/Pseudocode";
import { InlineMath } from "react-katex";

export default ({data, location}) => {
  let rfcCodeCommon = `
  \\begin{algorithm}
  \\caption{RFC5639 UpdateSeed}
  \\begin{algorithmic}
  \\PROCEDURE{UpdateSeed}{$s$}
  \\STATE Convert $s$ to an integer $z$
  \\STATE Convert $(z+1) \\mod 2^{160}$ to a bit string $t$
  \\RETURN $t$
  \\ENDPROCEDURE
  \\end{algorithmic}
  \\end{algorithm}
  `;
  let rfcCodePrimes = `
  \\begin{algorithm}
  \\caption{RFC5639 Verifiably Random Primes}
  \\begin{algorithmic}
  \\INPUT bit size $L$ of the required prime
  \\INPUT 160 bit-string seed $s$
  \\PROCEDURE{GeneratePrime}{$s$}
  \\STATE Let $c = $ \\CALL{FindInteger}{$s$}
  \\STATE Let $p$ be the smallest prime $p \\ge c$ with $p \\equiv 3 \\mod 4$
  \\IF{$2^{L-1} \\le p \\le 2^L - 1$}
    \\RETURN $p$
  \\ENDIF
  \\STATE Let $s = $ \\CALL{UpdateSeed}{$s$) and \\textbf{goto} $2$
  \\ENDPROCEDURE
  \\PROCEDURE{FindInteger}{$s$}
  \\STATE Let $v = \\lfloor (L-1) / 160 \\rfloor$ and $w = L - 160v$
  \\STATE Compute $h = \\text{SHA-1}(s)$
  \\STATE Let $h_0$ be the bit string obtained by taking the $w$ rightmost bits of $h$
  \\STATE Convert $s$ to an integer $z$
  \\FOR{$i = 1$ \\textbf{to} $v$}
    \\STATE Let $z_i = (z + i) \\mod 2^{160}$
    \\STATE Convert $z_i$ to bit-string $s_i$
    \\STATE Let $h_i = \\text{SHA-1}(s_i)$
  \\ENDFOR
  \\STATE Let $h$ be the string obtained by the concatenation of $h_0 , \\ldots , h_v$ from left to right
  \\STATE Convert $h$ to an integer $x$
  \\RETURN $x$
  \\ENDPROCEDURE
  \\end{algorithmic}
  \\end{algorithm}
  `;
  let rfcCodeCurves = `
  \\begin{algorithm}
  \\caption{RFC5639 Verifiably Random Curves $\\mathbb{F}_p$}
  \\begin{algorithmic}
  \\INPUT prime field size $p$ of bit-length $L$
  \\INPUT 160 bit-string seed $s$
  \\OUTPUT field elements $A, B \\in \\mathbb{F}_p$ which define an elliptic curve $\\mathcal{E}$
  \\OUTPUT generator $G$ of the elliptic curve $\\mathcal{E}$
  \\PROCEDURE{GenerateCurve}{$p, s$}
  \\STATE Let $h = $ \\CALL{FindInteger2}{$s$}
  \\STATE Convert $h$ to an integer $A$
  \\IF{$-3 \\equiv A*Z^4 \\mod p$ is not solvable}
    \\STATE Let $s = $ \\CALL{UpdateSeed}{$s$} and \\textbf{goto} $2$
  \\ENDIF
  \\STATE Compute one solution $Z$ of $-3 \\equiv A*Z^4 \\mod p$
  \\STATE Let $s = $ \\CALL{UpdateSeed}{$s$}
  \\STATE Let $B = $ \\CALL{FindInteger2}{$s$}
  \\IF{$B$ is a square $\\mod p$}
    \\STATE Let $s = $ \\CALL{UpdateSeed}{$s$} and \\textbf{goto} $8$
  \\ENDIF
  \\IF{$4*A^3 + 27*B^2 \\equiv 0 \\mod p$}
    \\STATE Let $s = $ \\CALL{UpdateSeed}{s} and \\textbf{goto} $2$
  \\ENDIF
  \\STATE Check that the elliptic curve $\\mathcal{E}$ over $\\mathbb{F}_p$ given by $y^2 = x^3 + A x + B$ fulfills all security and functional requirements
  \\STATE Let $s = $ \\CALL{UpdateSeed}{$s$}
  \\STATE Let $k = $ \\CALL{FindInteger2}{$s$}
  \\STATE Determine the points $Q$ and $-Q$ having the smallest x-coordinate on $\\mathcal{E}(\\mathbb{F}_p)$. Randomly select one of them as point $P$
  \\STATE Compute the base point $G = [k]P$.
  \\RETURN ($A, B, G$)
  \\ENDPROCEDURE
  \\PROCEDURE{FindInteger2}{$s$}
  \\STATE Let $v = \\lfloor (L-1) / 160 \\rfloor$ and $w = L - 160v - 1$
  \\STATE Compute $h = \\text{SHA-1}(s)$
  \\STATE Let $h_0$ be the bit string obtained by taking the $w$ rightmost bits of $h$
  \\STATE Convert $s$ to an integer $z$
  \\FOR{$i = 1$ \\textbf{to} $v$}
    \\STATE Let $z_i = (z + i) \\mod 2^{160}$
    \\STATE Convert $z_i$ to bit-string $s_i$
    \\STATE Let $h_i = \\text{SHA-1}(s_i)$
  \\ENDFOR
  \\STATE Let $h$ be the string obtained by the concatenation of $h_0 , \\ldots , h_v$ from left to right
  \\STATE Convert $h$ to an integer $x$
  \\RETURN $x$
  \\ENDPROCEDURE
  \\end{algorithmic}
  \\end{algorithm}`;
  return (
    <Entry data={data} location={location} title={"Brainpool"}>
      <Styled.h2>Brainpool</Styled.h2>

      <Styled.h3>Technical requirements</Styled.h3>
      <ul>
        <li>For each of the bit-lengths <InlineMath>160, 192, 224, 256, 320, 384, 512</InlineMath> one curve shall be proposed.</li>
        <li>The base field size <InlineMath>p</InlineMath> should be congruent to <InlineMath>{`3 \\mod 4`}</InlineMath>.</li>
        <li>The curve should be <InlineMath>{`\\mathbb{F}_p`}</InlineMath>-isomorphic to a curve with <InlineMath>{`A \\equiv -3 \\mod p`}</InlineMath>.</li>
        <li>The prime <InlineMath>p</InlineMath> must not be of a special form in order to avoid patented fast arithmetic on the base field.</li>
        <li>The order of the curve <InlineMath>{`\\lvert \\mathcal{E}(\\mathbb{F}_p) \\rvert`}</InlineMath> should be smaller than the size of the base field <InlineMath>p</InlineMath>.</li>
        <li>The curve coefficient <InlineMath>B</InlineMath> should be non-square in <InlineMath>{`\\mathbb{F}_p`}</InlineMath>.</li>
      </ul>
      <Styled.h3>Security requirements</Styled.h3>
      <ul>
        <li>The embedding degree <InlineMath>{`l = \\min\\{t \\vert q \\text{divides} p^t - 1 \\}`}</InlineMath> should be large, where <InlineMath>q</InlineMath> is the order
        of the basepoint and <InlineMath>p</InlineMath> the size of the base field. Specifically, <InlineMath>{`(q - 1) / l < 100`}</InlineMath>.</li>
        <li>The curves are not trace one curves. Specifically <InlineMath>{`\\lvert \\mathcal{E}(\\mathbb{F}_p) \\rvert \\ne p`}</InlineMath>.</li>
        <li>The class number of the maximal order of the endomorphism ring of the curve is larger than <InlineMath>10000000</InlineMath>.</li>
        <li>The group order <InlineMath>{`\\lvert \\mathcal{E}(\\mathbb{F}_p) \\rvert`}</InlineMath> should be a prime number <InlineMath>q</InlineMath>.</li>
      </ul>

      <Styled.h3>Original method</Styled.h3>
      Brainpool published their method of generating verifiably random curves in the <b>ECC Brainpool Standard Curves and Curve Generation</b> <Link to="#brainpool-std">[1]</Link> document,
      along with generated domain parameters claimed to be generated using the presented method and seeds.
      However, the presented <Link to={"/brainpool/"}>curves</Link> were (with the exception of the 512-bit curves) <b>not</b> generated
      using the presented method, as they have properties that can not result from the presented method of generating curves.
      See the <b>BADA55 paper</b> <Link to="bada55-brainpool">[3]</Link> for more information.

      <Styled.h3>RFC 5639 method</Styled.h3>
      Brainpool published an RFC with their fixed method of generating verifiably random curves and generated curves in <b>RFC 5639</b> <Link to="#rfc-5639">[2]</Link>,
      which matches the generated curves and seeds.

      <pre>
        <Pseudocode code={rfcCodeCommon} options={{lineNumber: true, noEnd: true, captionCount: 0}}/>
      </pre>

      <Styled.h4>Generating primes</Styled.h4>
      <pre>
        <Pseudocode code={rfcCodePrimes} options={{lineNumber: true, noEnd: true, captionCount: 1}}/>
      </pre>

      <Styled.h4>Generating curves</Styled.h4>
      <pre>
        <Pseudocode code={rfcCodeCurves} options={{lineNumber: true, noEnd: true, captionCount: 2}}/>
      </pre>
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