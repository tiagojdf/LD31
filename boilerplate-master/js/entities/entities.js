/**
 * Player Entity
 */
game.PlayerEntity = me.Entity.extend({

    /**
     * constructor
     */
    init:function (x, y, settings) {
        // call the constructor
        this._super(me.Entity, 'init', [x, y , settings]);
        
        // set the default horizontal & vertical speed (accel vector)
        this.body.setVelocity(3, 15);
        
        // set the display  to follow our position on both axis
        // !NOTE! - remove for LD project
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
        
        // ensure the player is updated even when outside of the viewport
        // Why do I need this?
        
        //define basic walking animation (using all frames)
        this.renderable.addAnimation("walk", [0, 1, 2, 3, 4, 5, 6, 7]);
        //define a standing animation (using the first frame) - change in LD for more complex later
        this.renderable.addAnimation("stand", [0]);
        // set the standing animation as default
        this.renderable.setCurrentAnimation("stand");
    },

    /**
     * update the entity
     */
    update : function (dt) {
        
        // define motion
        //moving left
        if (me.input.isKeyPressed('left')) {
            //flip the sprite on horizontal axis
            // !NOTE! maybe add 1-3 extra sprite frame(s) for turning? How?
            this.renderable.flipX(true);
            // update entity velocity
            // Need to check this in detail later. Didn't fully understand what I am doing
            this.body.vel.x -= this.body.accel.x * me.timer.tick;
            // change to walking animation
            if (!this.renderable.isCurrentAnimation("walk")) {
                this.renderable.setCurrentAnimation("walk");
            }
        //moving right
        } else if(me.input.isKeyPressed('right')) {
            // unflip the sprite
            this.renderable.flipX(false);
            // update velocity
            this.body.vel.x += this.body.accel.x *me.timer.tick;
            // change to walking animation
            if (!this.renderable.isCurrentAnimation("walk")) {
                this.renderable.setCurrentAnimation("walk");
            }
        // stop
        } else {
            this.body.vel.x = 0;
            // change to standing animation
            // !NOTE! maybe here is where we can introduce different standing animations
            this.renderable.setCurrentAnimation("stand");
        }
        // jump
        if (me.input.isKeyPressed('jump')) {
            // make sure we are not already jumping or falling
            // !Note! - change for double jump.
            if (!this.body.jumping && !this.body.falling) {
                // set current velocity to the maximum defined value. Gravity will do the rest
                this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
                // set the jumping flag
                this.body.jumping = true;
            }
        }
        

        // apply physics to the body (this moves the entity)
        this.body.update(dt);

        // handle collisions against other shapes
        me.collision.check(this);

        // return true if we moved or if the renderable was updated
        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    },

   /**
     * colision handler
     * (called when colliding with other objects)
     */
    onCollision : function (response, other) {
        // Make all other objects solid
        return true;
    }
});