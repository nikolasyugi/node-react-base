import React, { Component } from "react";
import "./CustomDataTable.css";
import DataTable from 'react-data-table-component';

class CustomDataTable extends Component {

    async componentDidMount() {
    }

    state = {
        filteredItems: [],
        query: "",
        loading: false
    }

    handleQuery = e => {
        const query = e.target.value;
        this.setState({ query: query, loading: true }, this.searchTag)
    }

    searchTag = async () => {
        if (this.props.filterFields) {
            this.setState({
                loading: false, filteredItems: this.props.data.filter((item) => {
                    for (var field of this.props.filterFields) {
                        if (item[field] && item[field].toString().toLowerCase().includes(this.state.query.toLowerCase()))
                            return true;
                    }
                    return false;
                }
                )
            })
        } else {
            this.setState({ loading: false })
        }
    }

    render() {
        return (
            <div id="tableWrapper">
                <label>
                    Buscar:&nbsp;
                    <input className="searchBar" autoFocus type="text" name="query" autoComplete="off" placeholder="Palavra-chave" onChange={this.handleQuery} />
                </label>
                <DataTable
                    columns={this.props.columns}
                    data={ this.state.query ? this.state.filteredItems : this.props.data}
                    keyField={'_id'}
                    noHeader={true}
                    wrap={true}
                    progressPending={this.state.loading} //Loading
                    // progressComponent={Loading} //Loading
                    striped={true}
                    pagination={true}
                    paginationPerPage={20}
                    paginationRowsPerPageOptions={[10, 15, 20, 30, 50]}
                    className="customTable"
                />
            </div>
        );
    }

}

export default CustomDataTable;