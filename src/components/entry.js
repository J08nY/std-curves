import React from 'react'
import Layout from '../components/layout'
import SEO from '../components/SEO'

function Entry({ children, location, title, description }) {
  //const headingTitle = doc.headings[0] && doc.headings[0].value
  //const title = doc.slug === '/' ? null : doc.title || headingTitle
  //const description = doc.description || doc.excerpt

  return (
    <Layout location={location}>
      <SEO title={title} description={description} />
      {children}
    </Layout>
  )
}

export default Entry
