/*global game, me, console*/
/**
 * a HUD container and child items
 */

game.HUD = game.HUD || {};


game.HUD.Container = me.Container.extend({

    init: function() {
        // call the constructor
        this._super(me.Container, 'init');

        // persistent across level change
        this.isPersistent = true;

        // make sure we use screen coordinates
        this.floating = true;

        // make sure our object is always draw first
        this.z = Infinity;

        // give a name
        this.name = "HUD";

        // add our child score object at the top left corner
        this.addChild(new game.HUD.ScoreItem(32, 16));
        this.addChild(new game.HUD.Timer(me.game.currentLevel.width, 16));
    }
});


/**
 * a basic HUD item to display score
 */
game.HUD.ScoreItem = me.Renderable.extend({
    /**
     * constructor
     */
    init: function(x, y) {

        // call the parent constructor
        // (size does not matter here)
        this._super(me.Renderable, 'init', [x, y, 10, 10]);
        
        //create a font
        this.font  = new me.Font("SATYP___", 24, '#e0dedc', 'left');

        // local copy of the global score
        this.score = -1;
        
        // make sure we use screen coordinates
        this.floating = true;
    },

    /**
     * update function
     */
    update : function () {
        // we don't do anything fancy here, so just
        // return true if the score has been updated
        if (this.score !== game.data.score) {
            this.score = game.data.score;
            return true;
        }
        return false;
    },

    /**
     * draw the score
     */
    draw : function (renderable) {
        // draw it baby !
        this.font.draw(renderable.getContext() , "Slave: " + game.data.score +"/14", this.pos.x, this.pos.y);
    }
});

/**
 * a basic HUD item to display time
 */
game.HUD.Timer = me.Renderable.extend({
    /*
    Consider updating to me.timer.setInterval();
    @Tiagojdferreira The update() methods all receive a parameter with relative timing information.
If you just want wall-clock time, use new Date()
You can also create timers that pause with the game engine, using me.timer.setTimeout() and me.timer.setInterval()
    */
    /**
     * constructor
     */
    init: function(x, y) {

        // call the parent constructor
        // (size does not matter here)
        this._super(me.Renderable, 'init', [x, y, 10, 10]);
        
        //create a font
        this.font  = new me.Font("SATYP___", 24, '#e0dedc', 'right');

        // local copy of the global score
        this.time = me.timer.getTime();
        this.startTime = this.time;
        
        // make sure we use screen coordinates
        this.floating = true;
    },

    /**
     * update function
     */
    update : function () {
        // we don't do anything fancy here, so just
        // return true if the score has been updated
        //var this.time = this.init.getMilliseconds();
        //this.time = new Date().getTime() - this.start;
        this.time = me.timer.getTime() - this.startTime;
        return true;
    },

    /**
     * draw the score
     */
    draw : function (renderable) {
        // draw it baby !
        this.font.draw(renderable.getContext() ,"TIME: " + (Math.floor(this.time/(1000*60)))+ ":" + pad((Math.floor((this.time/1000)%60)),2)+ ":" + pad((this.time % 1000), 3), this.pos.x, this.pos.y);
    }
});

function pad(num, size) {
    var s = "000000000" + num;
    return s.substr(s.length-size);
}
