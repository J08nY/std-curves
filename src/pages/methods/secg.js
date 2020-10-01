import React from 'react'
import Entry from '../../components/entry'
import Link from '../../components/Link'
import Pseudocode from '../../components/Pseudocode'
import { Styled } from "theme-ui"

export default ({data, location}) => {
  let curveCode = `
  \\begin{algorithm}
  \\caption{SECG Verifiably Random Curves}
  \\begin{algorithmic}
  \\REQUIRE A "seed" octet string $S$ of length $g/8$ octets
  \\REQUIRE field size $q$
  \\REQUIRE hash function $Hash$ of output length $hashlen$ octets
  \\REQUIRE field element $a \\in \\mathbb{F}_q$
  \\ENSURE field element $b \\in \\mathbb{F}_q$
  \\PROCEDURE{GenerateCurve}{$S$, $g$, $q$, $Hash$, $hashlen$, $a$}
  \\STATE Let $m = \\lceil \\log_2 q \\rceil$
  \\STATE Let $t = 8hashlen$
  \\STATE Let $s = \\lfloor (m - 1) / t \\rfloor$
  \\STATE Let $k = m - st$ if $q$ is even, else $k = m - st - 1$
  \\STATE Convert $S$ to an integer $s_0$.
  \\FOR{$j$ \\textbf{from} $0$ \\textbf{to} $s$}
    \\STATE Let $s_j = s_0 + j \\mod 2^g$
    \\STATE Let $S_j$ be the integer $s_j$ converted to an octet string of length $g/8$ octets
    \\STATE Let $H_j = Hash(S_j)$
    \\STATE Convert $H_j$ to an integer $e_j$
  \\ENDFOR
  \\STATE Let $e = e_0 2^{ts} + e_1 2^{t(s-1)} + \\ldots + e_s \\mod 2^{k + st}$
  \\STATE Convert $e$ to an octet string $E$ of length $mlen = \\lceil (\\log_2 q)/8 \\rceil$ octets
  \\STATE Convert $E$ to a field element $r \\in \\mathbb{F}_q$
  \\IF{$q$ is even}
    \\IF{$r = 0$}
    \\RETURN "failure"
    \\ELSE
    \\RETURN $b = r \\in \\mathbb{F}_q$
    \\ENDIF
  \\ELSE
    \\IF{$a = 0$ \\textbf{or} $4r + 27 \\equiv 0$ \\textbf{or} $a^3/r$ does not have a square root}
    \\RETURN "failure"
    \\ENDIF
    \\RETURN $b = \\sqrt{a^3/r}$
  \\ENDIF
  \\ENDPROCEDURE
  \\end{algorithmic}
  \\end{algorithm}`;
  let pointCode = `
  \\begin{algorithm}
  \\caption{SECG Verifiably Random Points}
  \\begin{algorithmic}
  \\REQUIRE A "seed" octet string $S$ of length $g/8$ octets
  \\REQUIRE field size $q$
  \\REQUIRE hash function $Hash$ of output length $hashlen$ octets
  \\REQUIRE elliptic curve parameters $a, b \\in \\mathbb{F}_q$
  \\REQUIRE elliptic curve cofactor $h$
  \\ENSURE elliptic curve point $G$
  \\PROCEDURE{GeneratePoint}{$S$, $g$, $q$, $Hash$, $hashlen$, $a$, $b$, $h$}
  \\STATE Let $A = 4261736520706F696E74_{16}$ which is the octet string of "Base point" in ASCII
  \\STATE Let $B = 01_{16}$ an octet string of length 1
  \\STATE Let $c = 1$
  \\STATE Convert integer c to an octet string $C$ of length $1 + \\lfloor \\log_{256} (c) \\rfloor$
  \\STATE Let $H = Hash(A \\Vert B \\Vert C \\Vert S)$
  \\STATE Convert $H$ to an integer $e$
  \\STATE Let $t = e \\mod 2q$
  \\STATE Let $u = t \\mod q$ and $z = \\lfloor t / q \\rfloor$
  \\STATE Convert integer $u$ to a field element $x \\in \\mathbb{F}_q$
  \\STATE Recover a y-coordinate from the compressed point information $(x, z)$ as appropriate to the elliptic curve
  \\IF{no valid $y$ exists}
  \\STATE Increment $c$
  \\STATE Goto step $4$
  \\ENDIF
  \\STATE Let $R = (x, y)$
  \\RETURN $G = [h]R$
  \\ENDPROCEDURE
  \\end{algorithmic}
  \\end{algorithm}
`;
  return (
    <Entry data={data} location={location} title={"SECG"}>
      <Styled.h2>SECG</Styled.h2>
      <Styled.p>
        The SECG method for generating verifiably random domain parameters is specified in the <b>SEC 1: Elliptic Curve Cryptography</b> <Link to="#secg-sec1">[1]</Link> standard,
        specifically in sections <i>3.1.3.1</i> and <i>3.1.3.2</i>. These methods are compatible to those in the <b>ANSI X9.62</b> standard.
      </Styled.p>

      <Styled.h3>Generating curves</Styled.h3>
      <pre>
        <Pseudocode code={curveCode} options={{lineNumber: true, noEnd: true, captionCount: 0}}/>
      </pre>

      <Styled.h3>Generating base points</Styled.h3>
      <pre>
        <Pseudocode code={pointCode} options={{lineNumber: true, noEnd: true, captionCount: 1}}/>
      </pre>

      <Styled.h4>References</Styled.h4>
      <ol>
        <li id="secg-sec1">Standards for Efficient Cryptography Group: <Link to="https://www.secg.org/sec1-v2.pdf">SEC 1: Elliptic Curve Cryptography</Link></li>
      </ol>
    </Entry>
  )
}