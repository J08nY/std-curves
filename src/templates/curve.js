/** @jsx jsx */
import { graphql } from "gatsby"
import Link from '../components/Link'
import Entry from '../components/entry'
import LinkButton from '../components/LinkButton'
import CopyButton from '../components/CopyButton'
import CodeBlock from '../components/CodeBlock'
import ReactMarkdown from "react-markdown"
import { clean_dict, is_nullundef } from '../utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload, faCopy, faSquare } from '@fortawesome/free-solid-svg-icons'
import { jsx, Styled } from 'theme-ui'
import { alpha } from '@theme-ui/color'
import dracula from '@theme-ui/prism/presets/dracula.json'
import Tooltip from '@material-ui/core/Tooltip';
import { BlockMath } from 'react-katex';


export const query = graphql`
  query($name: String!) {
    curve: curve(name: {eq: $name}) {
      name
      desc
      oid
      form
      field {
        type
        p
        bits
        degree
        base
        poly {
          coeff
          power
        }
        basis
      }
      params {
        a {
          raw
          poly {
            coeff
            power
          }
        }
        b {
          raw
          poly {
            coeff
            power
          }
        }
        c {
          raw
          poly {
            coeff
            power
          }
        }
        d {
          raw
          poly {
            coeff
            power
          }
        }
      }
      generator {
        x {
          raw
          poly {
            coeff
            power
          }
        }
        y {
          raw
          poly {
            coeff
            power
          }
        }
      }
      order
      cofactor
      aliases
      characteristics {
        seed
        j_invariant
        anomalous
        cm_disc
        conductor
        discriminant
        embedding_degree
        torsion_degrees {
          full
          least
          r
        }
        supersingular
        trace_of_frobenius
      }
    }
  }
`

function copyChild(event) {
  event.currentTarget.children[0].select();
  event.currentTarget.children[0].setSelectionRange(0, 99999);
  document.execCommand("copy")
}

function CurveTable(paramNames, paramTitles, params) {
  return (
    <div>
      <h3>Parameters</h3>
      <style>{"\
        #curveTable tr:hover a {\
          display: inline;\
        }\
        #curveTable tr a {\
          display: none;\
        }\
      "}</style>
      <table id="curveTable" sx={{borderCollapse: "collapse"}}>
        <thead>
        <tr>
          <th sx={{borderBottom: "1px solid", borderColor: alpha('text', 0.25)}}>Name</th>
          <th sx={{borderBottom: "1px solid", borderColor: alpha('text', 0.25)}}>Value</th>
        </tr>
        </thead>
        <tbody>
          {paramNames.map((name, i) => {
          return <tr key={i} title={paramTitles[i]} sx={{overflow: "scroll"}}>
            <td sx={{borderBottom: "1px solid", borderColor: alpha('text', 0.25)}}>
              {name}
              <Styled.a href="#" title="Copy value" onClick={copyChild} sx={{float: "right"}}>
                <textarea type="text" sx={{position: "absolute", left: "-1000px", right: "-1000px"}} readOnly value={params[i]}/>
                <span className="fa-layers fa-fw">
                  <FontAwesomeIcon icon={faSquare} color="text" />
                  <FontAwesomeIcon icon={faCopy} inverse transform="shrink-6" />
                </span>
              </Styled.a>
            </td><td sx={{borderBottom: "1px solid", borderColor: alpha('text', 0.25)}}><code>{params[i]}</code></td>
          </tr>})}
        </tbody>
      </table>
  </div>
  )
}

function formatPoly(poly, mult= false) {
  return poly.map(term => {

    if (term["power"] === 0) {
      if (term["coeff"] === "0x01") {
        return "1";
      }
      return term["coeff"];
    } else {
      return `${(term["coeff"] === "0x01") ? "" : term["coeff"] + (mult ? " *" : "")} x^${term["power"]}`;
    }
  }).join(" + ");
}

function formatElement(element) {
  if (element["raw"] !== null) {
    return element["raw"];
  } else if (element["poly"] !== null) {
    return formatPoly(element["poly"], true);
  } else {
    return "";
  }
}

function Parameters(curve) {
  function getParams(params) {
    let names = Object.keys(params).filter((key) => {return params[key] !== null});
    let titles = names.map((name) => {return name + " coefficient"});
    let values = names.map((name) => {return formatElement(params[name])});
    return {
      names,
      titles,
      values
    }
  }
  let params;
  let paramNames;
  let paramTitles;
  let paramValues;

  if (curve.field.type === "Prime") {
    params = getParams(curve.params);
    paramNames = ["p"].concat(params.names, ["G", "n", "h"]);
    paramTitles = ["field"].concat(params.titles, ["generator", "generator order", "cofactor"]);
    paramValues = [curve.field.p].concat(params.values, [`(${formatElement(curve.generator.x)}, ${formatElement(curve.generator.y)})`, curve.order, curve.cofactor]);
  } else {
    params = getParams(curve.params);
    paramNames = ["m", "f(x)"].concat(params.names, ["G", "n", "h"]);
    paramTitles = ["field degree", "field generator polynomial"].concat(params.titles, ["generator", "generator order", "cofactor"]);
    paramValues = [curve.field.degree, formatPoly(curve.field.poly)].concat(params.values, [`(${formatElement(curve.generator.x)}, ${formatElement(curve.generator.y)})`, curve.order, curve.cofactor]);
  }
  return CurveTable(paramNames, paramTitles, paramValues);
}

function Characteristics(curve) {
  let anyChars = !is_nullundef(curve.characteristics);
  let anyValues = curve.oid !== null || anyChars;
  
  if (anyValues) {
    return (
      <div>
        <h3>Characteristics</h3>
        <ul>
          {curve.oid !== null && curve.oid !== "" &&
            <li><b>OID</b>:<br/><Styled.a href={`http://oid-info.com/get/${curve.oid}`} target="_blank">{curve.oid}</Styled.a></li>
          }
          {anyChars && curve.characteristics.seed !== null &&
            <li><b>Seed</b>:<br/><span sx={{variant: "textStyles.mono", overflowWrap: "break-word"}}>{curve.characteristics.seed}</span></li>
          }
          {anyChars && curve.characteristics.j_invariant !== null &&
            <li><b>j-invariant</b>:<br/><span sx={{variant: "textStyles.mono", overflowWrap: "break-word"}}>{curve.characteristics.j_invariant}</span></li>
          }
          {anyChars && curve.characteristics.trace_of_frobenius !== null &&
            <li><b>Trace of Frobenius</b>:<br/><span sx={{variant: "textStyles.mono", overflowWrap: "break-word"}}>{curve.characteristics.trace_of_frobenius}</span></li>
          }
          {anyChars && curve.characteristics.discriminant !== null &&
            <li><b>Discriminant</b>:<br/><span sx={{variant: "textStyles.mono", overflowWrap: "break-word"}}>{curve.characteristics.discriminant}</span></li>
          }
          {anyChars && curve.characteristics.anomalous !== null &&
            <li><b>Anomalous</b>:<br/>{curve.characteristics.anomalous ? "true": "false"}</li>
          }
          {anyChars && curve.characteristics.supersingular !== null &&
            <li><b>Supersingular</b>:<br/>{curve.characteristics.supersingular ? "true": "false"}</li>
          }
          {anyChars && curve.characteristics.embedding_degree !== null &&
            <li><b>Embedding degree</b>:<br/><span sx={{variant: "textStyles.mono", overflowWrap: "break-word"}}>{curve.characteristics.embedding_degree}</span></li>
          }
          {anyChars && curve.characteristics.cm_disc !== null &&
            <li><b>CM-discriminant</b>:<br/><span sx={{variant: "textStyles.mono", overflowWrap: "break-word"}}>{curve.characteristics.cm_disc}</span></li>
          }
          {anyChars && curve.characteristics.conductor !== null &&
            <li><b>Conductor</b>:<br/><span sx={{variant: "textStyles.mono", overflowWrap: "break-word"}}>{curve.characteristics.conductor}</span></li>
          }
        </ul>
      </div>
    )
  } else {
    return <div/>
  }
}

function Aliases(curve) {
  if (curve.aliases !== null && curve.aliases.length > 0) {
    return <span>Also known as: {curve.aliases.map((alias) => {return <Link to={"/" + alias} sx={{marginRight: "5px"}}>{alias.split("/")[1]}</Link>})}</span>
  } else {
    return <span/>
  }
}

function Equation(curve) {
  let math = null;
  if (curve.field.type === "Prime") {
    if (curve.form === "Weierstrass") {
      math = <BlockMath>y^2 \equiv x^3 + ax + b</BlockMath>
    } else if (curve.form === "Edwards") {
      math = <BlockMath>x^2 + y^2 \equiv c^2 (1 + dx^2y^2)</BlockMath>
    } else if (curve.form === "Montgomery") {
      math = <BlockMath>By^2 \equiv x^3 + Ax^2 + x</BlockMath>
    } else if (curve.form === "TwistedEdwards") {
      math = <BlockMath>ax^2 + y^2 \equiv 1 + dx^2y^2</BlockMath>
    }
  } else if (curve.field.type === "Binary") {
    if (curve.form === "Weierstrass") {
      math = <BlockMath>y^2 + xy \equiv x^3 + ax^2 + b</BlockMath>
    }
  } else if (curve.field.type === "Extension"){
    if (curve.form === "Weierstrass") {
      math = <BlockMath>y^2 \equiv x^3 + ax + b</BlockMath>
    }
  }
  if (math !== null) {
    return <div sx={{".katex":{color:dracula.color, backgroundColor: dracula.backgroundColor, borderRadius: "0.5rem", padding: "10px", boxShadow: "0px 0px 10px -3px rgba(0,0,0,0.5)"}}}>{math}</div>
  } else {
    return <div/>
  }
}

function SageCode(curve) {
  let sageCode = "";
  if (curve.field.type === "Prime") {
    sageCode += `p = ${curve.field.p}\n`
    sageCode += `K = GF(p)\n`
    if (curve.form === "Weierstrass") {
      sageCode += `a = K(${formatElement(curve.params.a)})\n`
      sageCode += `b = K(${formatElement(curve.params.b)})\n`
      sageCode += `E = EllipticCurve(K, (a, b))\n`
      sageCode += `G = E(${formatElement(curve.generator.x)}, ${formatElement(curve.generator.y)})\n`
    } else if (curve.form === "Edwards") {
      if (parseInt(curve.params.c.raw, 16) === 1) {
        sageCode += `d = K(${formatElement(curve.params.d)})\n`
        sageCode += `E = EllipticCurve(K, (0, K(2 * (1 + d)/(1 - d)^2), 0, K(1/(1 - d)^2), 0))\n`
      } else {
        sageCode += `# Edwards curves are currently unsupported\n`
      }
    } else if (curve.form === "Montgomery") {
      sageCode += `A = K(${formatElement(curve.params.a)})\n`
      sageCode += `B = K(${formatElement(curve.params.b)})\n`
      sageCode += `E = EllipticCurve(K, ((3 - A^2)/(3 * B^2), (2 * A^3 - 9 * A)/(27 * B^3)))\n`
      sageCode += `def to_weierstrass(A, B, x, y):\n`
      sageCode += `\treturn (x/B + A/(3*B), y/B)\n`
      sageCode += `def to_montgomery(A, B, u, v):\n`
      sageCode += `\treturn (B * (u - A/(3*B)), B*v)\n`
      sageCode += `G = E(*to_weierstrass(A, B, K(${formatElement(curve.generator.x)}), K(${formatElement(curve.generator.y)})))\n`
    } else if (curve.form === "TwistedEdwards") {
      sageCode += `a = K(${formatElement(curve.params.a)})\n`
      sageCode += `d = K(${formatElement(curve.params.d)})\n`
      sageCode += `E = EllipticCurve(K, (K(-1/48) * (a^2 + 14*a*d + d^2),K(1/864) * (a + d) * (-a^2 + 34*a*d - d^2)))\n`
      sageCode += `def to_weierstrass(a, d, x, y):\n`
      sageCode += `\treturn ((5*a + a*y - 5*d*y - d)/(12 - 12*y), (a + a*y - d*y -d)/(4*x - 4*x*y))\n`
      sageCode += `def to_twistededwards(a, d, u, v):\n`
      sageCode += `\ty = (5*a - 12*u - d)/(-12*u - a + 5*d)\n`
      sageCode += `\tx = (a + a*y - d*y -d)/(4*v - 4*v*y)\n`
      sageCode += `\treturn (x, y)\n`
      sageCode += `G = E(*to_weierstrass(a, d, K(${formatElement(curve.generator.x)}), K(${formatElement(curve.generator.y)})))\n`
    }
    sageCode += `E.set_order(${curve.order} * ${curve.cofactor})\n`
    
    if (curve.form === "Edwards" || curve.form === "Montgomery" || curve.form === "TwistedEdwards") {
      sageCode += `# This curve is a Weierstrass curve (SAGE does not support ${curve.form} curves) birationally equivalent to the intended curve.\n`
      sageCode += `# You can use the to_weierstrass and to_${curve.form.toLowerCase()} functions to convert the points.`
    }
  } else if (curve.field.type === "Binary") {
    if (curve.form === "Weierstrass") {
      if (curve.field.basis === "poly") {
        sageCode += `F.<x> = GF(2)[]\n`
        sageCode += `K = GF(2^${curve.field.degree}, name="x", modulus=${formatPoly(curve.field.poly, true)})\n`
        sageCode += `E = EllipticCurve(K, (1, K.fetch_int(${formatElement(curve.params.a)}), 0, 0, K.fetch_int(${formatElement(curve.params.b)})))\n`
        sageCode += `E.set_order(${curve.order} * ${curve.cofactor})\n`
        sageCode += `G = E(K.fetch_int(${formatElement(curve.generator.x)}), K.fetch_int(${formatElement(curve.generator.y)}))`
      } else if (curve.field.basis === "normal") {
        sageCode += `F.<x> = GF(2)[]\n`
        sageCode += `K.<z> = GF(2^${curve.field.degree}, name="z", modulus=${formatPoly(curve.field.poly, true)})\n`
        sageCode += `def fetch_int(K, h):\n`
        sageCode += `\treturn sum(map(lambda ix: K(Integer(ix[1]) * z^(2^ix[0])), enumerate(h.binary())), K(0))\n`
        sageCode += `E = EllipticCurve(K, (1, fetch_int(K, ${formatElement(curve.params.a)}), 0, 0, fetch_int(K, ${formatElement(curve.params.b)})))\n`
        sageCode += `E.set_order(${curve.order} * ${curve.cofactor})\n`
        sageCode += `G = E(fetch_int(K, ${formatElement(curve.generator.x)}), fetch_int(K, ${formatElement(curve.generator.y)}))`
      }
    } else {
      sageCode = null;
    }
  } else if (curve.field.type === "Extension") {
    if (curve.form === "Weierstrass") {
      sageCode += `F.<x> = GF(${curve.field.base})[]\n`
      sageCode += `K = GF(${curve.field.base}^${curve.field.degree}, name="x", modulus=${formatPoly(curve.field.poly, true)})\n`
      sageCode += `a = K(${formatElement(curve.params.a)})\n`
      sageCode += `b = K(${formatElement(curve.params.b)})\n`
      sageCode += `E = EllipticCurve(K, (a, b))\n`
      sageCode += `E.set_order(${curve.order} * ${curve.cofactor})\n`
      sageCode += `G = E(K(${formatElement(curve.generator.x)}), K(${formatElement(curve.generator.y)}))`
    } else {
      sageCode = null;
    }
  }
  return sageCode;
}

function SageBox(curve) {
  let sageCode = SageCode(curve);
  return (
    <div>
      <h3>SAGE</h3>
      <CodeBlock code={sageCode} language="python"/>
      <div sx={{display: "flex"}}>
        <Tooltip title="Copy SAGE code" placement="bottom" arrow>
          <CopyButton value={sageCode} sx={{margin: "20px"}}>
            <FontAwesomeIcon icon={faCopy} fixedWidth /> SAGE
          </CopyButton>
        </Tooltip>
      
        <Tooltip title="Download SAGE code" placement="bottom" arrow>
          <div>
          <LinkButton href={"data:text/plain," + sageCode} download={curve.name + ".sage"} sx={{margin: "20px"}}>
            <FontAwesomeIcon icon={faDownload} fixedWidth /> SAGE
          </LinkButton>
          </div>
        </Tooltip>
      </div>
    </div>
  )
}

function JsonBox(curve) {
  let json = JSON.stringify(clean_dict(curve), null, 2);
  return (
    <div>
      <h3>JSON</h3>
      <CodeBlock code={json} language="json"/>
    <div sx={{display: "flex"}}>
      <Tooltip title="Copy JSON" placement="bottom" arrow>
      <CopyButton value={json} sx={{margin: "20px"}}>
        <FontAwesomeIcon icon={faCopy} fixedWidth /> JSON
      </CopyButton>
      </Tooltip>
      
      <Tooltip title="Download JSON" placement="bottom" arrow>
      <div>
        <LinkButton href={"data:application/json," + json} download={curve.name + ".json"} sx={{margin: "20px"}}>
          <FontAwesomeIcon icon={faDownload} fixedWidth /> JSON
        </LinkButton>
      </div>
      </Tooltip>
  </div>
  </div>
  )
}

export default ({ data, location, pageContext }) => {
  let dataTable = Parameters(data.curve);
  let chars = Characteristics(data.curve);
  let equation = Equation(data.curve);
  let aliases = Aliases(data.curve);
  let sage = SageBox(data.curve);
  let json = JsonBox(data.curve);
  return (
    <Entry location={location} title={pageContext.name}>
      <h2>{pageContext.name}</h2>
      {data.curve.field.bits}-bit {data.curve.field.type.toLowerCase()} field {data.curve.form} curve.<br/>
      {is_nullundef(data.curve.desc) || data.curve.desc === "" ? null : <div><ReactMarkdown source={data.curve.desc} renderers={{link: Link}}/><br/></div>}
      {aliases}
      {equation}
      {dataTable}
      <br/>
      {chars}
      <br/>
      {sage}
      <br/>
      {json}
    </Entry>
  )
}