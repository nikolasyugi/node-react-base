import React, { Component } from "react";
import "./Home.css";
import { ResponsiveContainer, ComposedChart, Bar, XAxis, YAxis, Label, CartesianGrid, Line, Tooltip } from 'recharts';
import api from "../services/api";
import handle from "../services/handleError";
import Modal from './Modal';

class Home extends Component {


    async componentDidMount() {
        this.setState({ loading: false }, this.getChart)
    }

    state = {
        loading: false,
        data: [],
        showGenericModal: false,
        genericModalMessage: ""
    }

    hideModal = async () => {
        this.setState({ showGenericModal: false })
    }

    getChart = async () => {
        const [response, err] = await handle(api.get("users/chart"));
        if (err) this.setState({ loading: false, showGenericModal: true, genericModalMessage: err.data ? (typeof (err.data.message) === "string" ? err.data.message : "Erro") : "Erro" })
        else this.setState({ data: response.data, loading: false })
    }

    render() {
        
        return (
            <div className="pageWrapper">
                <div className="pageHeader">
                    <h5 className="pageTitle">Dashboard</h5>
                </div>
                <div className="contentWrapper">
                    <div className="cardWrapper">
                        <h2 className="cardTitle">Quantidade de usuários</h2>
                        {this.state.loading ?
                            <p>Loading...</p>
                            :
                            <div id="chartWrapper">
                                <ResponsiveContainer width="100%" height={400}>
                                    <ComposedChart
                                        data={this.state.data} margin={{ top: 5, right: 30, bottom: 20, left: 15 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <Line type="monotone" yAxisId="left" dataKey="Total" stroke="#e54a4a" />
                                        <Bar yAxisId="right" dataKey="Usuários" fill="var(--primary)" />

                                        <XAxis dataKey="date">
                                            <Label position="bottom" style={{ textAnchor: 'middle' }}>
                                                Data
                                        </Label>
                                        </XAxis>
                                        <YAxis yAxisId="left" >
                                            <Label angle={270} position='left' style={{ textAnchor: 'middle' }}>
                                                Usuários
                                        </Label>
                                        </YAxis>
                                        <YAxis yAxisId="right" orientation="right" >
                                            <Label angle={270} position='right' style={{ textAnchor: 'middle' }}>
                                                Usuários novos por dia
                                        </Label>
                                        </YAxis>
                                        <Tooltip />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </div>

                        }
                    </div>
                    <Modal title="Ops!" message={this.state.genericModalMessage} visible={this.state.showGenericModal} ok={this.hideModal.bind(this)} hide={this.hideModal.bind(this)} />
                </div>
            </div>
        );
    }
}

export default Home;
