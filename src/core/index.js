var Core = {
    /**
     * @param {string} namespace 
     * @param {object} content 
     */
    $registerPlugin(namespace, content) {
        if (namespace.startsWith('$')) {
            throw new Error("Plugin names must NOT start with $.");
        }

        if (this.hasOwnProperty(namespace)) {
            throw new Error(`The ${namespace} plugin is already defined!`);
        }

        if (typeof content != 'object' || content === null) {
            throw new Error('Plugin content is expected to be an object.');
        }

        this[namespace] = content;
    },

    /**
     * @param {string} namespace 
     * @param {object} extension 
     */
    $extendPlugin(namespace, extension) {
        if (this[namespace].startsWith('$') || !this.hasOwnProperty(namespace)) {
            throw new Error("Provided namespace for plugin is invalid.");
        }

        if (typeof extension != 'object' || extension === null) {
            throw new Error('Plugin extension is expected to be an object.');
        }

        Object.assign(this[namespace], extension);
    }
};


export default Core;
