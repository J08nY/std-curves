import React from 'react'
import { Helmet } from 'react-helmet'
import { useStaticQuery, graphql } from 'gatsby'

function SEO({ description, lang = `en`, meta = [], keywords = [], title }) {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            author
          }
        }
      }
    `
  )

  const metaDescription = description || site.siteMetadata.description

  return (
    <Helmet
      htmlAttributes={{ lang }}
      title={title}
      titleTemplate={`%s | ${site.siteMetadata.title}`}
      defaultTitle={site.siteMetadata.title}
      meta={[
        { name: `description`, content: metaDescription },
        { property: `og:title`, content: title },
        { property: `og:description`, content: metaDescription },
        { property: `og:type`, content: `article` },
        { name: `twitter:card`, content: `summary` },
        { name: `twitter:creator`, content: `@${site.siteMetadata.author}` }
      ].concat(
        [
          ...meta,
          keywords.length
            ? { name: `keywords`, content: keywords.join(`, `) }
            : null
        ].filter(Boolean)
      )}
    />
  )
}

export default SEO
