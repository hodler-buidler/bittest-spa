import Core from '../index';

var CoreToVueAdapter = {
    install(Vue, options) {
        if (options.defaultPlugins) {
            this.addDefaultPluginsToCore(Core, options.defaultPlugins);
        }

        Vue.prototype.$core = Core;
    },

    addDefaultPluginsToCore(Core, plugins) {
        for (let namespace in plugins) {
            Core.$registerPlugin(namespace, plugins[namespace]);
        }
    }
};

export default CoreToVueAdapter;