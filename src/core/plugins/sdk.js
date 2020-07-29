import http from '../ajax';

var SdkPlugin = {
    /**
     * https://binance-docs.github.io/apidocs/spot/en/#order-book
     * @param {string} symbol 
     */
    async getOrdersBook(symbol, limit = 500) {
        try {
            var response = await http.get(`/api/v3/depth?symbol=${symbol}&limit=${limit}`);

            return response.data;
        } catch (error) {
            console.error(error.response);
        }
    },

    /**
     * https://github.com/binance-exchange/binance-official-api-docs/blob/master/web-socket-streams.md#diff-depth-stream
     * @param {string} symbol 
     */
    getOrdersWebsocketInstance(symbol) {
        symbol = symbol.toLowerCase();
        var websocket = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol}@depth`);
        return websocket;
    }
};

export default SdkPlugin;