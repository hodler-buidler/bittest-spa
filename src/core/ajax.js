import axios from 'axios';

if (process.env.NODE_ENV === 'development') {
    var baseUrl = 'http://localhost:8010/proxy';
} else var baseUrl = 'https://api.binance.com';


var instance = axios.create({
    baseURL: baseUrl,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    },
});

export default instance;