import React, { Component } from "react"
import { Index } from "elasticlunr"
import Link from './Link'

// Search component
export default class Search extends Component {
  constructor(props) {
    super(props)
    this.state = {
      query: ``,
      results: [],
    }
  }

  render() {
    var list;
    if (this.state.results.length !== 0) {
      list = <ul>
          {this.state.results.map(page => (
            <li key={page.id}>
              <Link to={page.path}>{page.name}</Link>
            </li>
          ))}
        </ul>
    } else {
      if (this.state.query !== "") {
        list = <span>No curves found.</span>
      } else {
        list = <span></span>
      }
    }

    return (
      <div>
        <input type="text" value={this.state.query} onChange={this.search} />
        <br/>
        {list}
      </div>
    )
  }
  getOrCreateIndex = () =>
    this.index
      ? this.index
      : // Create an elastic lunr index and hydrate with graphql query results
        Index.load(this.props.searchIndex)

  search = evt => {
    const query = evt.target.value
    this.index = this.getOrCreateIndex()
    const results = this.index
                  .search(query, {expand: true})
                  // Map over each ID and return the full document
                  .map(({ ref }) => this.index.documentStore.getDoc(ref))
    this.setState({
      query,
      // Query the index with search string to get an [] of IDs
      results: results
    })
  }
}