import React from 'react'
import ReactMarkdown from "react-markdown"
import { graphql } from "gatsby"
import Entry from '../components/entry'
import Link from '../components/Link'
import { Styled } from "theme-ui"
import Tooltip from "@material-ui/core/Tooltip";
import LinkButton from "../components/LinkButton";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDownload} from "@fortawesome/free-solid-svg-icons";
const path = require(`path`)

export const query = graphql`
  query($name: String!) {
    category: category(name: {eq: $name}) {
      name
      desc
      children {
        ... on Curve {
          name
        }
      }
      parent {
        parent {
          ... on File {
            relativeDirectory
          }
        }
      }
    }
  }
`

export default ({ data, location, pageContext }) => {
  let dir = data.category.parent.parent.relativeDirectory;
  return (
    <Entry location={location} title={pageContext.name}>
      <Styled.h3>{pageContext.name}</Styled.h3>
      <ReactMarkdown source={data.category.desc} renderers={{link: Link}}/>
      <ul>
      {data.category.children.map((curve, i) => <li key={i}><Link to={"/" + path.join(dir, curve.name)}>{curve.name}</Link></li>)}
      </ul>
      <br/>
      <div>
      <Tooltip title="Download curves in JSON" placement="bottom" arrow>
        <div>
          <LinkButton href={"https://raw.githubusercontent.com/J08nY/std-curves/data/" + dir + "/curves.json"} sx={{margin: "20px"}}>
            <FontAwesomeIcon icon={faDownload} fixedWidth /> JSON
          </LinkButton>
        </div>
      </Tooltip>
      </div>
    </Entry>
  )
}