const path = require(`path`)

exports.sourceNodes = ({ actions }) => {
  const { createTypes } = actions
  const typeDefs = `
    type Polynomial {
      m: Int
      e1: Int
      e2: Int
      e3: Int
    }
    enum FieldType {
      Prime
      Binary
    }
    type Field {
      type: FieldType
      p: String
      poly: Polynomial
      bits: Int
    }
    type Point {
      x: String!
      y: String!
    }
    enum Form {
      Weierstrass
      Montgomery
      Edwards
      TwistedEdwards
    }
    type Params {
      a: String
      b: String
      c: String
      d: String
    }
    type Curve implements Node {
      name: String!
      category: String!
      desc: String
      oid: String
      field: Field
      form: Form
      params: Params
      generator: Point
      order: String!
      cofactor: String!
      aliases: [String]
    }
    type Category implements Node {
      name: String!
      desc: String
    }
  `

  createTypes(typeDefs)
}

exports.onCreateNode = ({ node, actions, getNode, createNodeId, createContentDigest }) => {
  const { createNode, createParentChildLink } = actions;
  if (node.internal.type !== `CurvesJson`) {
    return;
  }
  const fileNode = getNode(node.parent);
  if (fileNode.base === "schema.json") {
    return;
  }
  const catId = createNodeId(`${node.id} >>> Category`);
  const catContentDigest = createContentDigest(node);

  createNode({
    name: node.name,
    desc: node.desc,
    id: catId,
    parent: node.id,
    children: [],
    internal: {
      type: `Category`,
      contentDigest: catContentDigest,
      description: `Category`
    }
  });
  createParentChildLink({ parent: fileNode, child: node });

  node.curves.forEach((curve) => {
    const curveId = createNodeId(`${node.id} >>> ${node.name} >>> ${curve.name}`);
    const curveContentDigest = createContentDigest(curve);
    createNode({
      ...curve,
      id: curveId,
      parent: catId,
      children: [],
      internal: {
        type: `Curve`,
        contentDigest: curveContentDigest,
        description: `Curve`
      }
    });
    createParentChildLink({parent: getNode(catId), child: getNode(curveId)});
  });
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;
  const result = await graphql(`
    query {
      allCategory {
        nodes {
          name
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
    }
  `)
  result.data.allCategory.nodes.forEach((category) => {
    createPage({
      path: category.parent.parent.relativeDirectory,
      component: path.resolve(`./src/templates/category.js`),
      context: {
        name: category.name
      }
    });
    category.children.forEach((curve) => {
      createPage({
        path: path.join(category.parent.parent.relativeDirectory, curve.name),
        component: path.resolve(`./src/templates/curve.js`),
        context: {
          name: curve.name
        }
      });
    });
  });
}

exports.onCreateWebpackConfig = ({ actions, stage }) => {
  if (stage === 'build-javascript') {
    // turn off source-maps
    actions.setWebpackConfig({
      devtool: false
    })
  }
}