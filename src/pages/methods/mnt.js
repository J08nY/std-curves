import React from 'react'
import Entry from '../../components/entry'
import Link from '../../components/Link'
import { InlineMath } from 'react-katex';
import { Styled } from "theme-ui"

export default ({data, location}) => {

  return (
    <Entry data={data} location={location} title={"MNT"}>
      <Styled.h2>Miyaji-Nakabayashi-Takano curves</Styled.h2>
      <Styled.p>A class of pairing-friendly curves with embedding degree <InlineMath>{`k \\in \\{3, 4, 6\\}`}</InlineMath>.</Styled.p>
	  <Styled.h4>References</Styled.h4>
	  <ul>
	  	<li>Atsuko Miyaji, Masaki Nakabayashi, Shunzou Takano: <Link to="https://dspace.jaist.ac.jp/dspace/bitstream/10119/4432/1/73-48.pdf">New explicit conditions of elliptic curve traces for FR-reduction</Link></li>
	 </ul>
      
    </Entry>
  )
}