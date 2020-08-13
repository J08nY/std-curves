import React from 'react'
import Entry from '../../components/entry'
import { Styled } from "theme-ui"

export default ({data, location}) => {

  return (
    <Entry data={data} location={location} title={"NIST"}>
      <Styled.p>

      </Styled.p>
    </Entry>
  )
}