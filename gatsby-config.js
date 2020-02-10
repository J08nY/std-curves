/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */


module.exports = {
  /* Your site config here */
  pathPrefix: "/std",
  siteMetadata: {
  	title: "Standard curve database",
  	description: "A database of standard curves",
  	author: "CRoCS"
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `curves`,
        path: `${__dirname}/src/curves/`,
      },
    },
    {
      resolve: `gatsby-transformer-json`,
      options: {
        typeName: `CurvesJson`
      },
    },
    `gatsby-transformer-yaml`,
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [`.mdx`, `.md`]
      }
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: "Standard curve database",
        short_name: "std",
        start_url: "/std/",
        background_color: "#FDFFFC",
        theme_color: "#E71D36",
        // Enables "Add to Homescreen" prompt and disables browser UI (including back button)
        // see https://developers.google.com/web/fundamentals/web-app-manifest/#display
        display: "standalone",
        icon: "static/icon.png" // This path is relative to the root of the site.
      }
    },
    `gatsby-plugin-offline`,
    {
      resolve: `@gatsby-contrib/gatsby-plugin-elasticlunr-search`,
      options: {
        fields: ["name", "category"],
        resolvers: {
          Curve: {
            name: node => node.name,
            category: node => node.category,
            path: node => node.category + "/" + node.name,
            type: node => "curve"
          }
        },
        filter: (node, getNode) => node.internal.type === "Curve"
      }
    },
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-theme-ui` 
  ]
}
