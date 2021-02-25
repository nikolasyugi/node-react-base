import React, { Component } from "react";
import "./DatePicker.css";
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import br from 'date-fns/locale/pt-BR';
import "react-datepicker/dist/react-datepicker.css";

registerLocale('br', br)

class DatePickerComponent extends Component {
    state = {
        startDate: this.props.default ? this.props.default : new Date()
    };

    handleChange = date => {
        this.props.handleDate(date)
        this.setState({ startDate: date })
    };

    render() {
        return (
            <DatePicker
                selected={this.state.startDate}
                onChange={this.handleChange}
                dateFormat="dd/MM/yyyy"
                locale="br"
            />
        );
    }
}

export default DatePickerComponent;