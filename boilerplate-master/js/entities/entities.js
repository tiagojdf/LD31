/* global me, game*/
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
     * update the player position 
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
        switch(response.b.body.collisionType) {
                case me.collision.types.WORLD_SHAPE:
                // if it is a platform it is possible to go through it
                if (other.type === "platform") {
                    // if all of the following, don't pass through
                    // not pressing down, overlap the platform and have vertical speed
                    if (this.body.falling && !me.input.isKeyPressed('down') && (response.overlapV.y >0) && (this.body.vel.y >= ~~response.overlapV.y)) {
                        // Disable collision on the X axis
                        response.overlapV.x = 0;
                        return true;
                    }
                    // do not respond to the platform (pass through)
                    return false;
                }
                break;
                
                case me.collision.types.ENEMY_OBJECT:
                    if ((response.overlapV.y > 0) && !this.body.jumping) {
                        //bounce - Need to override this
                        this.body.falling = false;
                        this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
                        // set the jumping flag
                        this.body.jumping = true;
                    } else {
                        // let's flicker in case we touch an enemy
                        // !NOTE! - change to Gave over for real enemy in game
                        this.renderable.flicker(750);
                    }
                return false;
                
                default:
                    // do not respond to other objects
                    return false;
        }
        // Make all other objects solid
        return true;
    }
});
// !!! Collectibles !!!
/*  --------------
    A coin entity
    -------------- */
game.CoinEntity = me.CollectableEntity.extend({
    // extending the init function is not mandatory unless you need to add some extra initialization
    init: function(x, y, settings) {
        this._super(me.CollectableEntity, 'init', [x, y, settings]);
    },
    
    // this function is called by the engine, when an object is touched by something (here, collected)
    onCollision: function(response, other) {
        
        // do something when collected
        
        // make sure it cannot be collected "again"
        this.body.setCollisionMask(me.collision.types.NO_OBJECT);
        
        //remove it
        me.game.world.removeChild(this);
        
        return false;
        
    },
});
/*  --------------
    A slave entity
    -------------- */
game.SlaveEntity = me.CollectableEntity.extend({
    // extending the init function is not mandatory unless you need to add some extra initialization
    init: function(x, y, settings) {
        
        // Make it random between slave_01 and slave_02
        settings.image = "slave_02";
        settings.spritewidth = 64;
        settings.spriteheight = 64;
        
        this._super(me.CollectableEntity, 'init', [x, y, settings]); 
        
        // to remember which side we were walking 
        this.walkLeft = false;
        
        //define basic walking animation (using all frames)
        this.renderable.addAnimation("walk", [0, 1, 2, 3, 4, 5, 6, 7]);
        //define a standing animation (using the first frame) - change in LD for more complex later
        this.renderable.addAnimation("stand", [0]);
        // set the standing animation as default
        this.renderable.setCurrentAnimation("stand");
    },
    
    // AI and movement
    update: function(dt){
        
        this.renderable.flipX(this.walkLeft);
        //this.body.vel.x += (this.walkLeft) ? -this.body.accel.x * me.timer.tick : this.body.accel.x * me.timer.tick;
        // walk right
        this.body.vel.x += this.body.accel.x *me.timer.tick;
        // change to walking animation
        if (!this.renderable.isCurrentAnimation("walk")) {
            this.renderable.setCurrentAnimation("walk");
        }
        // update the body movement
        this.body.update(dt);
        
        me.collision.check(this);
        
        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 ); //check if ||        
    },
    
    // this function is called by the engine, when an object is touched by something (here, collected)
    onCollision: function(response, other) {
        // do something when collected
        console.log(response.b.body.collisionType);
        if (response.b.body.collisionType === me.collision.types.COLLECTABLE_OBJECT) {
        // make sure it cannot be collected "again"
        this.body.setCollisionMask(me.collision.types.NO_OBJECT);
        
        //remove it
        me.game.world.removeChild(this);
        
        return false;
        }
        return true;
    },
    
});

// !!! Enemies !!!
/*  --------------
    An enemy entity
    -------------- */
game.EnemyEntity = me.Entity.extend({
    init: function(x, y, settings){
        // define image here rather then tiled
        // !NOTE! need to change for our game
        settings.image = "thesee";
        
        //save the area size defined in Tiled
        //!NOTE! - I will need to come up with a different strategy
        var width = settings.width;
        var height = settings.height;
        
        //adjust the size settings information to match the sprite size so that the entity object is created with the right size
        // CHECK! - probably not needed for future implementation
        settings.spritewidth = settings.width = 64;
        settings.spriteheight = settings.height = 64;
        
        // call the parent constructor
        this._super(me.Entity, 'init', [x, y, settings]);
        
        // set start/end position based on the initial area size
        // !NOTE! - probably not needed
        
        // manually update the entity bounds as we manually change the position
        this.updateBounds();
        
        // to remember which side we were walking 
        this.walkLeft = false; //! is it correct?
        
        // walking and jumping speed 
        this.body.setVelocity(4, 6);
    },
    
    //manage the enemy movement
    update: function(dt){
        // boundary behaviour
        if (this.alive) {
            if (this.walkLeft && this.pos.x <= this.startX) {
                this.walkLeft = false;
            } else if(!this.walkLeft && this.pos.x >= this.endX) {
                this.walkLeft = true;
            }
            // make it walk
            this.renderable.flipX(this.walkLeft);
            this.body.vel.x += (this.walkLeft) ? -this.body.accel.x * me.timer.tick : this.body.accel.x * me.timer.tick;
            
        } else {
            this.body.vel.x = 0;
        }
        
        // update the body movement
        this.body.update(dt);
        
        //handle collisions against other shapes
        me.collision.check(this);
        
        // return true if we moved or if the renderable was updated
        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 ); //check if ||
    },
    /**
     * colision handler
     * (called when colliding with other objects)
     */
    onCollision : function (response, other) {
        if (response.b.body.collisionType !== me.collision.types.WORLD_SHAPE) {
            // res.y >0 means touched by something on the bottom which means at top position for this one
            // Finally, in the onCollision method, I make the enemy flicker if something is jumping on top of it.
            if (this.alive && (response.overlapV.y > 0) && response.a.body.falling) {
                this.renderable.flicker(750);
            }
            return false;
        }
        //make all other objects solid
        return true;
    }
});