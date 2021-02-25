import axios from "axios";

const api = axios.create({
	baseURL: process.env.REACT_APP_API_URL,
	headers: {
		Authorization: {
			toString(){
				return JSON.parse(localStorage.getItem('user')) ? `Bearer ${JSON.parse(localStorage.getItem('user')).token}` : null;
			}
		}
	}
});

api.defaults.withCredentials = true;

api.interceptors.response.use(function (response) {
	if (process.env.NODE_ENV === "development") console.table(response.data)
	return response
}, function (error) {
	if (process.env.NODE_ENV === "development") console.log(error.response)
	if (error.response) {
		if (error.response.status === 401) {
			localStorage.clear()
			window.location.replace('/')
		} 
		return Promise.reject(error.response)
	} 
	return Promise.reject(error)
})

export default api