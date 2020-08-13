/** @jsx jsx */
import {jsx, Styled} from "theme-ui";
import Highlight, { defaultProps } from "prism-react-renderer";
import theme from '../codeTheme';

function CodeBlock({code, language}) {
  return <Highlight {...defaultProps} theme={theme} code={code} language={language}>
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
}

export default CodeBlock