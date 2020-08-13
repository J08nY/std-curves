import React from 'react'
import { graphql } from "gatsby"
import Entry from '../components/entry'
import Search from '../components/Search'
import { Styled } from "theme-ui"

export const query = graphql`
	query SearchIndexQuery {
		siteSearchIndex {
		  	index
		}
  	}
`

export default ({ data, location }) => {
  return (
    <Entry data={data} location={location} title={"Search"}>
		<Styled.h3>Search by curve name:</Styled.h3>
		<Search searchIndex={data.siteSearchIndex.index} />	
    </Entry>
  )
}