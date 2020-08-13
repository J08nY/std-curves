import React from 'react'
import Entry from '../components/entry'
import { Styled } from "theme-ui"

export default ({data, location}) => {
  return (
    <Entry data={data} location={location} title={"404 Not Found"}>
      <Styled.h2>404 Not Found</Styled.h2>
      <Styled.p>The page you are looking for was not found.</Styled.p>
    </Entry>
  )
}