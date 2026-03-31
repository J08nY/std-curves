const path = require(`path`);

exports.sourceNodes = ({ actions }) => {
  const { createTypes } = actions;
  const typeDefs = `
    enum Form {
      Weierstrass
      Montgomery
      Edwards
      TwistedEdwards
    }
    type Curve implements Node @dontInfer {
      name: String!
      category: String!
      desc: String
      oid: String
      field: JSON
      form: Form
      params: JSON
      generator: JSON
      characteristics: JSON
      order: String!
      cofactor: String!
      aliases: [String]
    }
    type CurvesJson implements Node @dontInfer {
      name: String!
      desc: String
      curves: [JSON]
    }
    type Category implements Node @dontInfer {
      name: String!
      desc: String
    }
  `;

  createTypes(typeDefs);
};

exports.onCreateNode = ({
  node,
  actions,
  getNode,
  createNodeId,
  createContentDigest
}) => {
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

  node.curves.forEach(curve => {
    const curveId = createNodeId(
      `${node.id} >>> ${node.name} >>> ${curve.name}`
    );
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
    createParentChildLink({ parent: getNode(catId), child: getNode(curveId) });
  });
};

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
  `);
  result.data.allCategory.nodes.forEach(category => {
    createPage({
      path: category.parent.parent.relativeDirectory,
      component: path.resolve(`./src/templates/category.js`),
      context: {
        name: category.name
      }
    });
    category.children.forEach(curve => {
      createPage({
        path: path.join(category.parent.parent.relativeDirectory, curve.name),
        component: path.resolve(`./src/templates/curve.js`),
        context: {
          name: curve.name
        }
      });
    });
  });
};

exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  if (stage === "build-javascript") {
    // turn off source-maps
    actions.setWebpackConfig({
      devtool: false
    });
  } else if (stage === "build-html") {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /pseudocode/,
            use: loaders.null()
          }
        ]
      }
    });
  }
};
