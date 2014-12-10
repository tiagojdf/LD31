/*global game, me*/
game.VictoryScreen = me.ScreenObject.extend({
    /**
     *  action to perform on state change
     */
    onResetEvent: function() {
        
        // Reset some variables?
        game.data.score = 0;
        game.data.lives = 2;
        game.data.time = me.timer.getTime();
        // Title screen
        me.game.world.addChild(
            new me.Sprite (
                0,0,
                //me.loader.getImage('title_screen')
                me.loader.getImage('win')
            ),
            1
        );
        
        // Add renderable
        // add a new renderable component with the scrolling text
        me.game.world.addChild(new (me.Renderable.extend ({
            // constructor
            init : function() {
                this._super(me.Renderable, 'init', [0, 0, me.game.viewport.width, me.game.viewport.height]);
                // font for the scrolling text
                this.font  = new me.Font("SATYP___", 48, '#e0dedc', 'center');
                 
                 
            },
              
            update : function (dt) {
                return true;
            },
             
            draw : function (renderable) {
                this.font.draw(renderable.getContext(), "Your best time was " + (Math.floor(game.data.bestTime/(1000*60)))+ ":" + pad((Math.floor((game.data.bestTime/1000)%60)),2)+ ":" + pad((game.data.bestTime % 1000), 3),560, 140);
            },
            onDestroyEvent : function() {
                //just in case
                this.scrollertween.stop();
            }
        })), 2);
        // Change to play state on press of any key or click/tap
        me.input.bindKey(me.input.KEY.DOWN, "start", true);
        me.input.bindKey(me.input.KEY.SPACE, "start", true);
        me.input.bindKey(me.input.KEY.ENTER, "start", true);
        me.input.bindPointer(me.input.mouse.LEFT, me.input.KEY.DOWN);
        this.handler = me.event.subscribe(me.event.KEYDOWN, function (action) {
                                                                       if (action === "start") {
            // Add a sound?
                                                                           
            // Add transition
            me.state.change(me.state.PLAY);
        }
        }
        );
        
        
    },

    /**
     *  action to perform when leaving this screen (state change)
     */
    onDestroyEvent: function() {
        // TODO
        me.input.unbindKey(me.input.KEY.DOWN);
        me.input.unbindKey(me.input.KEY.SPACE);
        me.input.unbindKey(me.input.KEY.ENTER);
        // re-set DOWN and SPACE keys to game defaults
        me.input.bindKey(me.input.KEY.DOWN, "down");
        me.input.bindKey(me.input.KEY.SPACE, "jump", true);
        
        me.input.unbindPointer(me.input.mouse.LEFT);
        me.event.unsubscribe(this.handler);
        
    }
});
