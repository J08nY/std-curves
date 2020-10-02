/** @jsx jsx */
import {jsx} from "theme-ui";
import {render as renderCode} from "pseudocode"

let cache = {}

function Pseudocode({code, options}) {
  if (typeof window === `undefined`) {
    return <div/>;
  }
  let key = JSON.stringify({"code": code, "options": options});
  let rendered = null;
  if (key in cache) {
    rendered = cache[key];
  } else {
    rendered = renderCode(code, null, options);
    cache[key] = rendered;
  }
  return <div ref={ref => {if (ref) ref.appendChild(rendered); return ref}}></div>;
}

export default Pseudocode