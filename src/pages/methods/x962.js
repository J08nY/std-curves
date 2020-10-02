import React from 'react'
import Entry from '../../components/entry'
import Pseudocode from '../../components/Pseudocode'
import { Styled } from "theme-ui"
import { InlineMath } from "react-katex";
import Link from "../../components/Link";

export default ({data, location}) => {
  let fpCode = `
  \\begin{algorithm}
  \\caption{ANSI X9.62 Verifiably Random Curves over $\\mathbb{F}_p$}
  \\begin{algorithmic}
  \\INPUT prime field size $p$
  \\OUTPUT bit-string $SEED$ and field elements $a, b \\in \\mathbb{F}_p$ which define an elliptic curve
  \\PROCEDURE{GenerateCurve}{$p$}
  \\STATE Let $t = \\lfloor \\log_{2} p \\rfloor $; Let $s = \\lfloor (t - 1) / 160 \\rfloor $; Let $h = t - 160 s $
  \\STATE Let $SEED$ be a random bit string of at least 160 bits
  \\STATE Let $g = \\vert SEED \\vert $
  \\STATE Let $H = \\text{SHA-1}(SEED) $
  \\STATE Let $c_0$ be the bit string of $h$ rightmost bits of $H$
  \\STATE Let $W_0$ be $c_0$ with leftmost bit set to $0$
  \\FOR{$i = 1$ \\textbf{to} $s$}
    \\STATE Let $W_i = \\text{SHA-1}((SEED + i) \\mod 2^g)$
  \\ENDFOR
  \\STATE Let $W = W_0 \\Vert W_1 \\Vert \\ldots \\Vert W_s$
  \\STATE Let $r = \\sum_{i = 1}^{t} w_i 2^{t - i}$ \\COMMENT{with $w_i$ being the $i$-th bit of $W$ from the left}
  \\STATE Let $(a, b)$ be elements of $ \\mathbb{F}_p $, so that $ r b^2 \\equiv a^3 \\mod p $
  \\IF{$ 4a^3 + 27b^2 \\equiv 0 \\mod p$}
  \\STATE \\textbf{goto} $3$
  \\ENDIF
  \\RETURN ($SEED, a, b$)
  \\ENDPROCEDURE
  \\end{algorithmic}
  \\end{algorithm}`;
  let f2mCode = `
  \\begin{algorithm}
  \\caption{ANSI X9.62 Verifiably Random Curves over $\\mathbb{F}_{2^m}$}
  \\begin{algorithmic}
  \\INPUT field size $q = 2^m$
  \\OUTPUT bit-string $SEED$ and field elements $a, b \\in \\mathbb{F}_{2^m}$ which define an elliptic curve
  \\PROCEDURE{GenerateCurve}{$q = 2^m$}
  \\STATE Let $t = m$; Let $s = \\lfloor (t - 1) / 160 \\rfloor $; Let $h = t - 160 s $
  \\STATE Let $SEED$ be a random bit string of at least 160 bits
  \\STATE Let $g = \\vert SEED \\vert $
  \\STATE Let $H = \\text{SHA-1}(SEED) $
  \\STATE Let $b_0$ be the bit string of $h$ rightmost bits of $H$
  \\FOR{$i = 1$ \\textbf{to} $s$}
    \\STATE Let $b_i = \\text{SHA-1}((SEED + i) \\mod 2^g)$
  \\ENDFOR
  \\STATE Let $b = b_0 \\Vert b_1 \\Vert \\ldots \\Vert b_s \\in \\mathbb{F}_{2^m}$
  \\IF{$b = 0$}
  \\STATE \\textbf{goto} $3$
  \\ENDIF
  \\STATE Let $a$ be random element from $ \\mathbb{F}_{2^m} $
  \\RETURN ($SEED, a, b$)
  \\ENDPROCEDURE
  \\end{algorithmic}
  \\end{algorithm}`;
  return (
    <Entry data={data} location={location} title={"X962"}>
      <Styled.h2>ANSI X9.62</Styled.h2>
      <Styled.p>
        The <b>ANSI X9.62</b> <Link to="#ansi-x962">[1]</Link> standard published by the American National Standards Institute provides a way of
        generating verifiably random elliptic curves in its appendices <i>A.3.3.1</i> and <i>A.3.3.2</i>. The curves are presented
        in the <Link to={"/x962"}>ANSI X9.62</Link> category.
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
        <li id="ansi-x962">Accredited Standards Committee X9 : <Link to="https://webstore.ansi.org/standards/ascx9/ansix9621998">Public Key Cryptography For The Financial Services Industry : The Elliptic Curve Digital Signature Algorithm (ECDSA)</Link></li>
      </ol>
    </Entry>
  )
}