/*global me, alert, window, document*/
/* Game namespace */
var game = {

    // an object where to store game information
    data : {
        // score
        score : 0
    },


    // Run on page load.
    "onload" : function () {
    // Initialize the video.
    if (!me.video.init("screen",  me.video.CANVAS, 1136, 640, true, 'auto')) {
        alert("Your browser does not support HTML5 canvas.");
        return;
    }

    // add "#debug" to the URL to enable the debug Panel
    if (document.location.hash === "#debug") {
        window.onReady(function () {
            me.plugin.register.defer(this, me.debug.Panel, "debug", me.input.KEY.V);
        });
    }

    // Initialize the audio.
    me.audio.init("mp3,ogg");

    // Set a callback to run when loading is complete.
    me.loader.onload = this.loaded.bind(this);

    // Load the resources.
    me.loader.preload(game.resources);

    // Initialize melonJS and display a loading screen.
    me.state.change(me.state.LOADING);
},

    // Run on game resources loaded.
    "loaded" : function () {
        // Here we need to load all the resources we will be using in game.
        
        // Haven't defined a TitleScreen yet
        me.state.set(me.state.MENU, new game.TitleScreen());
        
        // set the "Play/Ingame" Screen Object
        me.state.set(me.state.PLAY, new game.PlayScreen());
        
        // set a global fading transition 
        me.state.transition("fade", "#000000", 250);

        // add our entities in the entity pool
        me.pool.register("mainPlayer", game.PlayerEntity);
        me.pool.register("SlaveEntity", game.SlaveEntity);
        me.pool.register("EnemyEntity", game.EnemyEntity);
        
        //enable the keyboard
        //left
        me.input.bindKey(me.input.KEY.LEFT, "left");
        me.input.bindKey(me.input.KEY.A, "left");
        //right
        me.input.bindKey(me.input.KEY.RIGHT, "right");
        me.input.bindKey(me.input.KEY.D, "right");
        // UP
        me.input.bindKey(me.input.KEY.UP, "jump", true);
        me.input.bindKey(me.input.KEY.SPACE, "jump", true);
        me.input.bindKey(me.input.KEY.Z, "jump", true);
        me.input.bindKey(me.input.KEY.W, "jump", true);
        // Down
        me.input.bindKey(me.input.KEY.DOWN, "down");
        me.input.bindKey(me.input.KEY.X, "down");
        me.input.bindKey(me.input.KEY.S, "down");
        me.input.bindKey(me.input.KEY.ALT, "down");
        me.input.bindKey(me.input.KEY.CTRL, "down");
        

        // Start the game.
        me.state.change(me.state.MENU);
        //me.state.change(me.state.PLAY);
    }
};
