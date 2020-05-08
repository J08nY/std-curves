/** @jsx jsx */
import { graphql } from 'gatsby'
import Entry from '../components/entry'
import { jsx } from 'theme-ui'
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
	var graph = {};
	graph.nodes = [];
	graph.links = [];
	var categories = {};
	curves.forEach(curve => {
		if (curve["category"] in categories) {
			categories[curve["category"]].push(curve);
		} else {
			categories[curve["category"]] = [curve];
		}
	});
	for (var category in categories) {
		graph.nodes.push({id:category, name: category});
		categories[category].forEach(curve => {
			var curveNode = category + "/" + curve["name"];
			graph.nodes.push({id: curveNode, name: curve["name"]});
			graph.links.push({source: curveNode, target: category});
		});
	}
	return graph;
}
/*
const ClientSideOnlyLazy = React.lazy(() =>
	import("../components/Network")
)
const LazyNetwork = (props) => {
	const isSSR = typeof window === "undefined"
	return (
		<>
			{!isSSR && (
				<React.Suspense fallback={<div >Loading...</div>}>
					<ClientSideOnlyLazy {...props} />
				</React.Suspense>
			)}
		</>
	)
}

const AsyncNetwork = asyncComponent({
	resolve: () => import("../components/Network"),
	LoadingComponent: () => <div>Loading</div>,
	ErrorComponent: ({ error }) => <div>{error.message}</div>,
	serverMode: "defer"
})
*/

export default ({ data, location, navigation }) => {
	var categories = categoryGraph(data.allCurve.nodes);
	console.log(categories)
	return (
		<Entry data={data} location={location} title={"Network"}>
			<Network data={categories} config={{node: {labelProperty: "name"}}} onClickNode={(nodeId) => {navigate("/" + nodeId)}}/>
		</Entry>
	)
}