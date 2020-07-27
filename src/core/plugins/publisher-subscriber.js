var PublisherSubscriberPlugin = {
    $storage: {}, // stores: {eventName: [{observer, id: observerId}, ...]}

    /**
     * @api
     * @param {string} eventName 
     * @param {mixed} payload 
     */
    publish(eventName, payload) {
        if (!this.$storage.hasOwnProperty(eventName)) {
            this.$addStorageDependency(eventName);
        }

        this.$notify(eventName, payload);
    },


    /**
     * @api
     * @param {string} eventName 
     * @param {function} payload 
     * @param {primitive} observerId 
     */
    subscribe(eventName, observer, observerId = null) {
        if (!this.$storage.hasOwnProperty(eventName)) {
            this.$addStorageDependency(eventName);
        }

        if (!this.$isObserverExist(eventName, observer, observerId)) {
            this.$storage[eventName].push({observer, id: observerId});
        }
    },


    /**
     * @api
     * @param {string} eventName 
     * @param {function} payload 
     * @param {primitive} observerId
     */
    unsubscribe(eventName, observer, observerId = null) {
        if (this.$isObserverExist(eventName, observer, observerId)) {
            let observerRecord = this.$findObserverRecord(eventName, observer, observerId);
            let recordIndex = this.$storage[eventName].indexOf(observerRecord);

            this.$storage[eventName].splice(recordIndex, 1);
        }
    },


    $notify(eventName, payload) {
        var observers = this.$storage[eventName];

        if (observers) {
            observers.forEach(function notifyIndividualObserver({observer}) {
                observer(payload);
            })
        }
    },


    $addStorageDependency(namespace) {
        this.$storage[namespace] = [];
    },

    
    $isObserverExist(eventName, observer, observerId) {
        if (this.$storage.hasOwnProperty(eventName)) {
            return !!this.$findObserverRecord(eventName, observer, observerId);
        }

        return false;
    },


    $findObserverRecord(eventName, observer, observerId) {
        return this.$storage[eventName].find(({observerFunc, id}) => {
            // The same source
            if (observer === observerFunc) return true;

            if (id !== null) return observerId === id;
            return false;
        });
    }
};

export default PublisherSubscriberPlugin;