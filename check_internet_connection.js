/*
 * Code to detect if internet connection exists
 * Feel free to pick up the stuff you need, use it, modify it and redistribute
 */

YourApp = function(container) {
    // Get your constructor stuff here
};

YourApp.isServerReachable = false;

YourApp.TIMERS = {};

YourApp.POLL_INTERVAL = 30000;

YourApp.YOUR_EVENTS = {};

YourApp.prototype._addListeners = function() {

    if (!YourApp.TIMERS.checkServerStatusTimer) {        
        // ----------------------------------------------------------------------
        // Poll your service every 30 seconds by default else it is configurable
        $(window).on("online offline", YourApp.checkServerStatus);
        // ----------------------------------------------------------------------

        YourApp.TIMERS.checkServerStatusTimer = setInterval(YourApp.checkServerStatus, YourApp.POLL_INTERVAL);
        // Set the counter while attaching the listener, it produces a NaN if not set to 0.
        YourApp.TIMERS.ConnectTriggerCount = 0;
    }

    YourApp.YOUR_EVENTS.bind("FooConnect", this._reconnectFoo, this);
    YourApp.YOUR_EVENTS.bind("FooDisconnect", this._disconnectFoo, this);
};

YourApp.checkServerStatus = function(doStop, doNotTrigger, callback) {

    $.ajax({
        type: "HEAD",
        url: "/public/blank.html",
        cache: false,
        statusCode: {
            0: function() {
                if (YourApp.isServerReachable === true) {
                    if (doStop) {
                        // Reset the state here - state must be correct for functions triggered by the calee function
                        YourApp.isServerReachable = false;
                        if (!doNotTrigger) {
                            // Reset the trigger counter when disconnected and let retry or auto-reconnect drive the trigger count.
                            YourApp.TIMERS.ConnectTriggerCount = 0;                            
                            YourApp.YOUR_EVENTS.trigger("FooDisconnect");
                        }
                    }
                    else {
                        return YourApp.checkServerStatus(true);
                    }
                }
                YourApp.isServerReachable = false;
            },
            200: function() {
                if (YourApp.isServerReachable === false) {
                    if (doStop) {
                        // Reset the state here - state must be correct for functions triggered by the calee function
                        YourApp.isServerReachable = true;
                        if (!doNotTrigger) {
                            // Increment the connect trigger count to keep track of event trigger activity
                            YourApp.TIMERS.ConnectTriggerCount++;
                            YourApp.YOUR_EVENTS.trigger("FooConnect");
                        }
                    }
                    else {
                        return YourApp.checkServerStatus(true);
                    }
                }
                YourApp.isServerReachable = true;
            }
        },
        complete: callback
    });
 };
YourApp.checkServerStatus(true, true);