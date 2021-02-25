import React, { Component } from "react";
import "./Home.css";
import { ResponsiveContainer, ComposedChart, Bar, XAxis, YAxis, Label, CartesianGrid, Line, Tooltip } from 'recharts';

class Home extends Component {


    async componentDidMount() {
        this.setState({ loading: true }, this.getChart)
    }

    state = {
        loading: false,
        data: []
    }

    getChart = async () => {
        this.setState({ loading: false })
    }

    render() {

        return (
            <div className="pageWrapper">
                <div className="pageHeader">
                    <h5 className="pageTitle">Dashboard</h5>
                </div>
                <div className="contentWrapper">
                    <div className="cardWrapper">
                        <h2 className="cardTitle">Controle</h2>
                        {this.state.loading ?
                            <p>Loading...</p>
                            :
                            <div id="chartWrapper">
                                <ResponsiveContainer width="100%" height={400}>
                                    <ComposedChart
                                        data={this.state.data} margin={{ top: 5, right: 30, bottom: 20, left: 15 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <Line type="monotone" yAxisId="left" dataKey="receita" stroke="#00ff00" />
                                        <Line type="monotone" yAxisId="left" dataKey="despesas" stroke="#ff0000" />
                                        <Line type="monotone" yAxisId="left" dataKey="lucro" stroke="#0000ff" />
                                        <Bar yAxisId="right" dataKey="pedidos" fill="var(--primary)" />

                                        <XAxis dataKey="date">
                                            <Label position="bottom" style={{ textAnchor: 'middle' }}>
                                                Data
                                        </Label>
                                        </XAxis>
                                        <YAxis yAxisId="left" >
                                            <Label angle={270} position='left' style={{ textAnchor: 'middle' }}>
                                                Total (R$)
                                        </Label>
                                        </YAxis>
                                        <YAxis yAxisId="right" orientation="right" >
                                            <Label angle={270} position='right' style={{ textAnchor: 'middle' }}>
                                                Pedidos
                                        </Label>
                                        </YAxis>
                                        <Tooltip />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </div>

                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;
