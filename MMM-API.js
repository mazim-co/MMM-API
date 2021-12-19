/* MagicMirror
 * Module: MMM-API
 *
 * By mazim
 *
 */
Module.register("MMM-API", {

    // Module config defaults.
    defaults: {
		getAgeName: "Manuel",
		useHeader: true, // false if you don't want a header
        header: "Loading Age...!", // Any text you want
        maxWidth: "50px",
        rotateInterval: 30 * 1000,
        animationSpeed: 3000, // fade in and out speed
        initialLoadDelay: 4250,
        retryDelay: 2500,
        updateInterval: 60 * 60 * 1000,

    },

    getStyles: function() {
        return ["MMM-API.css"];
    },

    start: function() {
        Log.info("Starting module: " + this.name);

        requiresVersion: "2.1.0",

        // Set locale.
        this.url = "https://api.agify.io/?name=" + this.config.getAgeName;
        this.AGE = [];
        this.activeItem = 0;         // <-- starts rotation at item 0 (see Rotation below)
        this.rotateInterval = null;  // <-- sets rotation time (see below)
        this.scheduleUpdate();       // <-- When the module updates (see below)
    },

    getDom: function() {
		
		// creating the wrapper
        var wrapper = document.createElement("div");
        wrapper.className = "wrapper";
        wrapper.style.maxWidth = this.config.maxWidth;

		// The loading sequence
        if (!this.loaded) {
            wrapper.innerHTML = "Age is coming!";
            wrapper.classList.add("bright", "light", "small");
            return wrapper;
        }

		// creating the header
        if (this.config.useHeader != false) {
            var header = document.createElement("header");
            header.classList.add("xsmall", "bright", "light", "header");
            header.innerHTML = this.config.header;
            wrapper.appendChild(header);
        }

		// Rotating the data
        var Keys = Object.keys(this.AGE);
        if (Keys.length > 0) {
            if (this.activeItem >= Keys.length) {
                this.activeItem = 0;
            }
            var AGE = this.AGE[Keys[this.activeItem]];

			
			// Creating the div's for your data items
            var top = document.createElement("div");
            top.classList.add("list-row");
			
			
			// shape element from data
			var shape = document.createElement("div");
            shape.classList.add("xsmall", "bright", "shape");
            shape.innerHTML = AGE.shape + " shaped UFO object";
            wrapper.appendChild(shape);
			
			
			// date element from data
			var date = document.createElement("div");
            date.classList.add("xsmall", "bright", "date");
            date.innerHTML = "Sighted: " + moment(AGE.date, "YYYY-MM-DD HH:mm:ss Z").local().format("MMM DD, YYYY @ hh:mm a");
            wrapper.appendChild(date);
			
			
			// city and state elements from data
			var getAgeName = document.createElement("div");
            getAgeName.classList.add("xsmall", "bright", "getAgeName");
            getAgeName.innerHTML = "In " + AGE.getAgeName;
            wrapper.appendChild(getAgeName);
			
			
			// duration element from data
			var duration = document.createElement("div");
            duration.classList.add("xsmall", "bright", "duration");
            duration.innerHTML = "Duration of sighting was " + AGE.duration;
            wrapper.appendChild(duration);
			
			
			// summary element from data
            var summary = document.createElement("div");
            summary.classList.add("xsmall", "bright", "summary");
            summary.innerHTML = "Witness statement: " + AGE.summary;
            wrapper.appendChild(summary);

        } // <-- closes the rotation of the data
		
        return wrapper;
		
    }, // <-- closes the getDom function from above

	// this processes your data
    processUFO: function(data) { 
        this.AGE = data; 
    //    console.log(this.UFO); // uncomment to see if you're getting data (in dev console)
        this.loaded = true;
    },
	
	
	// this rotates your data
    scheduleCarousel: function() { 
    //    console.log("Carousel of UFO fucktion!"); // uncomment to see if data is rotating (in dev console)
        this.rotateInterval = setInterval(() => {
            this.activeItem++;
            this.updateDom(this.config.animationSpeed);
        }, this.config.rotateInterval);
    },
	
	
// this tells module when to update
    scheduleUpdate: function() { 
        setInterval(() => {
            this.getAGE();
        }, this.config.updateInterval);
        this.getAGE(this.config.initialLoadDelay);
        var self = this;
    },
	
	
	// this asks node_helper for data
    getAGE: function() { 
        this.sendSocketNotification('GET_AGE', this.url);
    },
	
	
	// this gets data from node_helper
    socketNotificationReceived: function(notification, payload) { 
        if (notification === "AGE_RESULT") {
            this.processAGE(payload);
            if (this.rotateInterval == null) {
                this.scheduleCarousel();
            }
            this.updateDom(this.config.animationSpeed);
        }
        this.updateDom(this.config.initialLoadDelay);
    },
});