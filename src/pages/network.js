import React from "react"
import { graphql } from 'gatsby'
import Entry from '../components/entry'
import Network from '../components/Network'
import { navigate } from "gatsby"

export const query = graphql`
  query NetworkQuery {
    allCurve {
	  nodes {
		name
	  	category
		aliases
	  }
    }
  }
`

function categoryGraph(curves) {
    let graph = {};
    graph.nodes = [];
	graph.links = [];
    let categories = {};
    curves.forEach(curve => {
		if (curve["category"] in categories) {
			categories[curve["category"]].push(curve);
		} else {
			categories[curve["category"]] = [curve];
		}
	});
	for (let category in categories) {
		graph.nodes.push({id:category, name: category});
		categories[category].forEach(curve => {
			let curveNode = category + "/" + curve["name"];
			graph.nodes.push({id: curveNode, name: curve["name"]});
			graph.links.push({source: curveNode, target: category});
		});
	}
	return graph;
}

export default ({ data, location, navigation }) => {
	let categories = categoryGraph(data.allCurve.nodes);
	return (
		<Entry data={data} location={location} title={"Network"}>
			<Network data={categories} config={{node: {labelProperty: "name"}}} onClickNode={(nodeId) => {navigate("/" + nodeId)}}/>
		</Entry>
	)
}