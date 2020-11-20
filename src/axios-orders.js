import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://burgerbuilder-7f999.firebaseio.com/'
});

export default instance;