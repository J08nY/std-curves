import React from 'react'
import { graphql } from "gatsby"
import Entry from '../components/entry'
import Link from '../components/Link'
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
  return (
    <Entry location={location} title={pageContext.name}>
      <h3>{pageContext.name}</h3>
      {data.category.desc}<br/>
      <ul>
      {data.category.children.map((curve, i) => <li key={i}><Link to={path.join(data.category.parent.parent.relativeDirectory, curve.name)}>{curve.name}</Link></li>)}
      </ul>
    </Entry>
  )
}