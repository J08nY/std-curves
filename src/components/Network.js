import React, { Component } from "react"
import { Graph } from "react-d3-graph";

class Network extends Component {
	componentDidMount() {

	}
	render() {
		return (
			<Graph id="net-id" {...this.props}>

			</Graph>
		)
	}
}
export default Network