import React from 'react'
import Entry from '../components/entry'

export default ({data, location}) => {
  return (
    <Entry data={data} location={location} title={"404 Not Found"}>
      <h2>404 Not Found</h2>
      <p>The page you are looking for was not found.</p>
    </Entry>
  )
}