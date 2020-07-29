import axios from 'axios';

const baseUrl = 'https://api.binance.com';
const proxyToAvoidCors = 'https://cors.nikitosgolubev.workers.dev/corsproxy/?apiurl=';


var instance = axios.create({
    baseURL: proxyToAvoidCors+baseUrl,
});

export default instance;