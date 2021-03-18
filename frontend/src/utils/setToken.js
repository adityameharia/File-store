import axios from 'axios';

const setToken = (token) => {
	if (token) {
		axios.defaults.headers.common['bearer-token'] = token;
	} else {
		delete axios.defaults.headers.common['bearer-token'];
	}
};

export default setToken;
