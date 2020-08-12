import React from 'react'
import Entry from '../../components/entry'
import Link from '../../components/Link'
import {BlockMath, InlineMath} from 'react-katex';

export default ({data, location}) => {

  return (
    <Entry data={data} location={location} title={"MNT"}>
      <h2>Miyaji-Nakabayashi-Takano curves</h2>
      <p>A class of pairing-friendly curves with <InlineMath>{`k \\in \\{3, 4, 6\\}`}</InlineMath>.</p>
    </Entry>
  )
}