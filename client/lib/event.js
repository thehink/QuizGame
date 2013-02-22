/**
 * By using the native call and apply methodology, this class allows
 * the user to have full control over custom event creation and handling.
 *
 * @author Garth Henson garth@guahanweb.com
 * @version 1.0
 */

/** @namespace */
var Events = {};
(function() {
    Events = /** @lends Events */{
        /**
         * Enables event consumption and management on the provided class. This
         * needs to be called from the context of the object in which events are
         * to be enabled.
         * 
         * @public
         * @example
         * var MyObj = function() {
         *     var self = this;
         *     this.init = function() {
         *         Events.enable.call(self);
         *     };
         *     
         *     this.log = function() {
         *         console.log(self);
         *         self.fireEvent('log');
         *     };
         *
         *     this.init();
         * };
         *
         * var o = new MyObj();
         * o.addListener('log', function() { console.log('Event fired!'); });
         * o.log();
         */
        enable : function() {
            var self = this;
            self.listeners = {};
            
            // Fire event
            self.dispatch = function(ev, args) {
                Events.dispatch.call(self, ev, args);
            };
            
            // Add listener
            self.addListener = function(ev, fn) {
                Events.addListener.call(self, ev, fn);
            };
            
            // Remove listener
            self.removeListener = function(ev, fn) {
                Events.removeListener.call(self, ev, fn);
            }
        },
        
        /**
         * Fires the provided <code>ev</code> event and executes all listeners attached
         * to it. If <code>args</code> is provided, they will be passed along to the
         * listeners.
         *
         * @public
         * @param {string} ev The name of the event to fire
         * @param {array} args Optional array of args to pass to the listeners
         */
        dispatch : function(ev, args) {
            if (!!this.listeners[ev]) {
                for (var i = 0; i < this.listeners[ev].length; i++) {
                    var fn = this.listeners[ev][i];
                    fn.apply(window, args);
                }
            }
        },
        
        /**
         * Binds the execution of the provided <code>fn</code> when the <code>ev</code> is fired.
         *
         * @public
         * @param {string} ev The name of the event to bind
         * @param {function} fn A function to bind to the event
         */
        addListener : function(ev, fn) {
            // Verify we have events enabled
            Events.enable.call(this, ev);
            
            if (!this.listeners[ev]) {
                this.listeners[ev] = [];
            }
            
            if (fn instanceof Function) {
                this.listeners[ev].push(fn);
            }
        },
        
        /**
         * Removes the provided <code>fn</code> from the <code>ev</code>. If no function is
         * provided, all listeners for this event are removed.
         *
         * @public
         * @param {string} ev The name of the event to unbind
         * @param {function} fn An optional listener to be removed
         */
        removeListener : function(ev, fn) {
            if (!!this.listeners[ev] && this.listeners[ev].length > 0) {
                // If a function is provided, remove it
                if (!!fn) {
                    var new_fn = [];
                    for (var i = 0; i < this.listeners[ev].length; i++) {
                        if (this.listeners[ev][i] != fn) {
                            new_fn.push(this.listeners[ev][i]);
                        }
                    }
                    this.listeners[ev] = new_fn;
                } else { // Otherwise, remove them all
                    this.listeners[ev] = [];
                }
            }
        }
    };
}());