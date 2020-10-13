import React from 'react'
import Entry from '../../components/entry'
import { Styled } from "theme-ui"
import Link from "../../components/Link";
import {InlineMath} from "react-katex";
import Pseudocode from "../../components/Pseudocode";

export default ({data, location}) => {
  let fpCode = `
  \\begin{algorithm}
  \\caption{NIST Verifiably Random Curves over $\\mathbb{F}_p$}
  \\begin{algorithmic}
  \\INPUT prime field size $p$ of bit-length $l$
  \\OUTPUT bit-string seed $s$ and field elements $a, b \\in \\mathbb{F}_p$ which define an elliptic curve
  \\PROCEDURE{GenerateCurve}{$p$}
  \\STATE Let $v = \\lfloor \\ (l - 1) / 160 \\rfloor $; Let $w = l - 160v - 1 $
  \\STATE Let $s$ be a random bit string of 160 bits
  \\STATE Let $h = \\text{SHA-1}(s) $
  \\STATE Let $h_0$ be the bit string of $w$ rightmost bits of $h$
  \\STATE Let $z$ be the integer whose binary expansion is given by the 160-bit string $s$
  \\FOR{$i = 1$ \\textbf{to} $v$}
    \\STATE Let $s_i = (z + i) \\mod 2^{160}$
    \\STATE Let $h_i = \\text{SHA-1}(s_i)$
  \\ENDFOR
  \\STATE Let $h = h_0 \\Vert h_1 \\Vert \\ldots \\Vert h_v$
  \\STATE Let $c$ be the integer whose binary expansion is given by the bit string $h$
  \\IF{$c = 0$ \\textbf{or} $ 4c + 27 \\equiv 0 \\mod p$}
  \\STATE \\textbf{goto} $3$
  \\ENDIF
  \\STATE Choose integers $a, b \\in \\mathbb{F}_p$ such that $c b^2 \\equiv a^3 \\mod p$
  \\STATE Check that the elliptic curve defined by $a, b$ has suitable order. If not \\textbf{goto} 3
  \\RETURN ($s, a, b$)
  \\ENDPROCEDURE
  \\end{algorithmic}
  \\end{algorithm}`;
  let f2mCode = `
  \\begin{algorithm}
  \\caption{NIST Verifiably Random Curves over $\\mathbb{F}_{2^m}$}
  \\begin{algorithmic}
  \\INPUT binary field size $2^m$
  \\OUTPUT bit-string seed $s$ and field elements $a, b \\in \\mathbb{F}_{2^m}$ which define an elliptic curve
  \\PROCEDURE{GenerateCurve}{$p$}
  \\STATE Let $v = \\lfloor \\ (m - 1) / 160 \\rfloor $; Let $w = m - 160v $
  \\STATE Let $s$ be a random bit string of 160 bits
  \\STATE Let $h = \\text{SHA-1}(s) $
  \\STATE Let $h_0$ be the bit string of $w$ rightmost bits of $h$
  \\STATE Let $z$ be the integer whose binary expansion is given by the 160-bit string $s$
  \\FOR{$i = 1$ \\textbf{to} $v$}
    \\STATE Let $s_i = (z + i) \\mod 2^{160}$
    \\STATE Let $h_i = \\text{SHA-1}(s_i)$
  \\ENDFOR
  \\STATE Let $h = h_0 \\Vert h_1 \\Vert \\ldots \\Vert h_v$
  \\STATE Let $b$ be element of $\\mathbb{F}_{2^m}$ which binary expansion is given by the bit string $h$
  \\STATE Choose an element $a \\in \\mathbb{F}_{2^m}$
  \\STATE Check that the elliptic curve defined by $a, b$ has suitable order. If not \\textbf{goto} 3
  \\RETURN ($s, a, b$)
  \\ENDPROCEDURE
  \\end{algorithmic}
  \\end{algorithm}`;
  return (
    <Entry data={data} location={location} title={"NIST"}>
      <Styled.h2>NIST</Styled.h2>
      <Styled.p>
        The NIST <b>FIPS 186-4</b> <Link to="#fips-186-4">[1]</Link> standard defines recommended curves for use in ECDSA
        and a verifiably random method for generating them in appendices <i>D.5</i> and <i>D.7</i>. The curves are presented
        in the <Link to={"/nist/"}>NIST</Link> category.
      </Styled.p>
      <Styled.h3>Generating <InlineMath>{`\\mathbb{F}_p`}</InlineMath> curves</Styled.h3>
      <pre>
        <Pseudocode code={fpCode} options={{lineNumber: true, noEnd: true, captionCount: 0}}/>
      </pre>
      <Styled.h3>Generating <InlineMath>{`\\mathbb{F}_{2^m}`}</InlineMath> curves</Styled.h3>
      <pre>
        <Pseudocode code={f2mCode} options={{lineNumber: true, noEnd: true, captionCount: 1}}/>
      </pre>
      <Styled.h4>References</Styled.h4>
      <ol>
        <li id="fips-186-4">National Institute of Standards and Technology: <Link to="https://csrc.nist.gov/publications/detail/fips/186/4/final">FIPS 186-4 - Digital Signature Standard (DSS)</Link></li>
      </ol>
    </Entry>
  )
}