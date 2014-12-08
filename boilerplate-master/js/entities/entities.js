/* global me, game, console, setTimeout*/
/**
 * Player Entity
 */
var wrapAround = function(obj) {
    if (obj.pos.x > me.game.currentLevel.width - obj.width/2) {
            obj.pos.x = obj.pos.x - me.game.currentLevel.width;
        } else if (obj.pos.x + obj.width/2 <= 0) {
            obj.pos.x = obj.pos.x + me.game.currentLevel.width;
        }
        if (obj.pos.y > (me.game.currentLevel.height - obj.height)) {
            obj.pos.y = obj.pos.y - me.game.currentLevel.height;
        } else if (obj.pos.y +  obj.height< 0) {
            obj.pos.y = obj.pos.y + me.game.currentLevel.height;
        }
    
};

game.PlayerEntity = me.Entity.extend({

    /**
     * constructor
     */
    init:function (x, y, settings) {
        // call the constructor
        // define image here rather then tiled
        // !NOTE! need to change for our game
        settings.image = "gripe_run_right";
        
        this._super(me.Entity, 'init', [x, y , settings]);
        
        // Set the types of collision with player to PLAYER_OBJECT
        this.body.setCollisionType = me.collision.types.PLAYER_OBJECT;
        
        // set the default horizontal & vertical speed (accel vector)
        this.body.setVelocity(3, 15);
        
        // ensure the player is updated even when outside of the viewport
        this.alwaysUpdate = true;
        // Why do I need this?
        
        //define basic walking animation (using all frames)
        this.renderable.addAnimation("walk", [1, 2, 3, 4, 5, 6, 7]);
        //define a standing animation (using the first frame) - change in LD for more complex later
        this.renderable.addAnimation("stand", [0]);
        // set the standing animation as default
        this.renderable.setCurrentAnimation("stand");
        
        //custom variables
        this.indestructible = false;
        this.lastvel = new me.Vector2d();
        
    },

    /**
     * update the player position 
     */
    update : function (dt) {
        
        if (this.lastvel.y > 0 && this.body.vel.y === 0) {
            me.audio.play("tombe");
            }
        this.lastvel.copy(this.body.vel);
        
        wrapAround(this);
        
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
                me.audio.play("saute");
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
        switch(other.body.collisionType) {
                
            case me.collision.types.WORLD_SHAPE:
                break;
                
            case me.collision.types.ENEMY_OBJECT:
                if (game.data.score === 13) {
                    other.death();                    
                } else if ((response.overlapV.y > 0) && !this.body.jumping) {
                        //bounce - Need to override this
                        this.body.falling = false;
                        this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
                        // set the jumping flag
                        this.body.jumping = true;
                    } else {
                        // let's flicker in case we touch an enemy
                        // !NOTE! - change to Gave over for real enemy in game
                        console.log("Hurt.");
                        //alert("Game Over");
                        
                        // Effect of being hit
                        if (!this.indestructible) {
                            console.log("Ouch!");
                            game.data.lives -=1;
                            this.indestructible = true;
                            this.renderable.flicker(750);
                            me.audio.play("hit");
                            var that = this;
                            setTimeout(function() {that.indestructible = false;},750);
                        }
                        if (game.data.lives <= 0) {
                            console.log("Dead! Game Over");
                            setTimeout(function() {me.state.change(me.state.GAMEOVER);},2000);
                            this.alive = false;
                            me.game.world.removeChild(this);
                        }
                        // Death //deactivate during development
                        //
                    }
                return false;
            
            case me.collision.types.COLLECTABLE_OBJECT:
                other.death();
                
        }
        
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
                // CHANGE
                // console.log(other.body.collisionType);
                break;
                    
                
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
    A slave entity
    -------------- */
game.SlaveEntity = me.CollectableEntity.extend({
    // extending the init function is not mandatory unless you need to add some extra initialization
    init: function(x, y, settings) {
        
        //sex of the slave
        this.male = (Math.random() <= 0.5);
        // Make it random between slave_01 and slave_02
        if (this.male) {
            settings.image = "slave_01";
        } else {
            settings.image = "slave_02";
        }
        
        settings.spritewidth = 64;
        settings.spriteheight = 64;
        
        this._super(me.CollectableEntity, 'init', [x, y, settings]); 
        
        // to remember which side we were walking 
        this.walkLeft = false;
        
        // walking and jumping speed 
        this.body.setVelocity(4, 10);
        
        // keep previous position
        this.previousX = this.pos.x;
        this.previousY = this.pos.y;
        
        //define basic walking animation (using all frames)
        this.renderable.addAnimation("walk", [0, 1, 2, 3, 4, 5, 6, 7]);
        //define death animation (using all frames)
        this.renderable.addAnimation("death", [8, 9, 10]);
        //define death animation (using all frames)
        this.renderable.addAnimation("dead", [10]);
        //define a standing animation (using the first frame) - change in LD for more complex later
        this.renderable.addAnimation("stand", [0]);
        // set the standing animation as default
        this.renderable.setCurrentAnimation("stand");
    },
    
    // AI and movement
    update: function(dt){
        if (this.alive) {
        wrapAround(this);
        
        this.renderable.flipX(this.walkLeft);
        //this.body.vel.x += (this.walkLeft) ? -this.body.accel.x * me.timer.tick : this.body.accel.x * me.timer.tick;
        // walk right
        if (this.previousX === this.pos.x && this.previousY === this.pos.y) {
            if (Math.random() <= 0.5) {
                        this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
                    } else {
                        this.walkLeft = !this.walkLeft;
                    }
            
        }
        
        this.previousX = this.pos.x;
        this.previousY = this.pos.y;
        this.body.vel.x += (this.walkLeft) ? -this.body.accel.x * me.timer.tick : this.body.accel.x * me.timer.tick;
        //console.log(this.body.vel.x);
        // change to walking animation
        if (!this.renderable.isCurrentAnimation("walk")) {
            this.renderable.setCurrentAnimation("walk");
        }
        // update the body movement
        this.body.update(dt);
        
        // Check, if position the same, jump or change direction or both
        /*// do something when collected
        if (this.previousSpeed < this.body.vel.x) {
            this.walkLeft = !this.walkLeft;
        }*/
        
        me.collision.check(this);
        
        
        
        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 ); //check if ||  
        } else {
            return this.body.vel.x !== 0;
        }
    },
    
    // this function is called by the engine, when an object is touched by something
    onCollision: function(response, other) {
        
        switch(other.body.collisionType) {
                case me.collision.types.WORLD_SHAPE:
                    break;
                
                case me.collision.types.COLLECTABLE_OBJECT:
                case me.collision.types.ENEMY_OBJECT:
                    if (Math.random() <= 0.01) {
                        this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
                    }
                this.walkLeft = !this.walkLeft;
                return false;
        }
        return true;
    },
    death: function() {
        var p; //used for random events
        this.body.setCollisionMask(me.collision.types.WORLD_SHAPE);
        // Play sfx
        p = Math.random();
        if (this.male){
            if (p <= 1/3) {
                me.audio.play("criHomme");
            } else if (p <= 2/3) {
                me.audio.play("criHomme2");
            } else {
                me.audio.play("criHomme3"); 
            }
        } else {    
            if (p <= 1/2) {
                me.audio.play("CriFemme");                
            } else {
                me.audio.play("CriFemme2"); 
            }
        }
            
        this.alive = false;
        // Add death animation
        this.renderable.setCurrentAnimation("death");
        this.renderable.setCurrentAnimation("death");
        this.renderable.setCurrentAnimation("death");
        this.renderable.setCurrentAnimation("dead");
            
        game.data.score += 1;
        //console.log(game.data.score);
        //remove it
        //me.game.world.removeChild(this);
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
        
        settings.spritewidth = 64;
        settings.spriteheight = 64;
        
        //save the area size defined in Tiled
        //!NOTE! - I will need to come up with a different strategy
        //var width = settings.width;
        //var height = settings.height;
        
        //adjust the size settings information to match the sprite size so that the entity object is created with the right size
        // CHECK! - probably not needed for future implementation
        //settings.spritewidth = settings.width = 64;
        //settings.spriteheight = settings.height = 64;
        
        // call the parent constructor
        this._super(me.Entity, 'init', [x, y, settings]);
        
        // set start/end position based on the initial area size
        // !NOTE! - probably not needed
        
        // manually update the entity bounds as we manually change the position
        this.updateBounds();
        
        // to remember which side we were walking 
        this.walkLeft = false; //! is it correct?
        
        // walking and jumping speed 
        this.body.setVelocity(4, 10);
        
        //define basic walking animation (using all frames)
        this.renderable.addAnimation("walk", [0, 1, 2, 3, 4, 5, 6, 7]);
        //define a standing animation (using the first frame) - change in LD for more complex later
        this.renderable.addAnimation("stand", [0]);
        //define a standing animation (using the first frame) - change in LD for more complex later
        this.renderable.addAnimation("defeat", [8, 9, 10, 9], 250);
        //define a standing animation (using the first frame) - change in LD for more complex later
        this.renderable.addAnimation("death", [8, 11, 12], 300);
        //define a standing animation (using the first frame) - change in LD for more complex later
        this.renderable.addAnimation("dead", [12]);
        // set the standing animation as default
        this.renderable.setCurrentAnimation("stand");
    },
    
    //manage the enemy movement
    /*update: function(dt){
        
        wrapAround(this);
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
    },*/
    update: function(dt){
        if (!this.alive) {
            if (!this.renderable.isCurrentAnimation("dead")) {
                this.renderable.setCurrentAnimation("dead");
            }
            this.body.vel.x = 0;
            this.body.update(dt);
            me.collision.check(this);
            return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 );   
        }
        if (game.data.score >= 13) {
            if (!this.renderable.isCurrentAnimation("defeat")) {
            this.renderable.setCurrentAnimation("defeat");
        }
            this.body.vel.x = 0;
            this.body.update(dt);
            me.collision.check(this);
            return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 );
        } else {
        wrapAround(this);
        
        this.renderable.flipX(this.walkLeft);
        //this.body.vel.x += (this.walkLeft) ? -this.body.accel.x * me.timer.tick : this.body.accel.x * me.timer.tick;
        // walk right
        if (this.previousX === this.pos.x && this.previousY === this.pos.y) {
            if (Math.random() <= 0.5) {
                        this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
                    } else {
                        this.walkLeft = !this.walkLeft;
                    }
            
        }
        
        this.previousX = this.pos.x;
        this.previousY = this.pos.y;
        this.body.vel.x += (this.walkLeft) ? -this.body.accel.x * me.timer.tick : this.body.accel.x * me.timer.tick;
        //console.log(this.body.vel.x);
        // change to walking animation
        if (!this.renderable.isCurrentAnimation("walk")) {
            this.renderable.setCurrentAnimation("walk");
        }
        // update the body movement
        this.body.update(dt);
        
        // Check, if position the same, jump or change direction or both
        /*// do something when collected
        if (this.previousSpeed < this.body.vel.x) {
            this.walkLeft = !this.walkLeft;
        }*/
        
        me.collision.check(this);
        
        
        
        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 ); //check if ||  
        }
    },
    
    /**
     * colision handler
     * (called when colliding with other objects)
     */
    /*
    onCollision : function (response, other) {
        
        if (response.b.body.collisionType !== me.collision.types.WORLD_SHAPE) {
            // res.y >0 means touched by something on the bottom which means at top position for this one
            // Finally, in the onCollision method, I make the enemy flicker if something is jumping on top of it.
            if (this.alive && (response.overlapV.y > 0) && response.a.body.falling) {
                this.renderable.flicker(750);
            }
            return true;
        }
        //make all other objects solid
        return true;
    },*/
    onCollision: function(response, other) {
        var p;
        
        switch(other.body.collisionType) {
                    
                case me.collision.types.COLLECTABLE_OBJECT:
                case me.collision.types.ENEMY_OBJECT:
                    p = Math.random();
                    if (p <= 0.05) {
                        this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
                    } else  if (p <= 0.5){
                        this.walkLeft = !this.walkLeft;                        
                    }
                    return false;

        }
        return true;
    },
    death: function() {
        var p; //used for random events
        this.body.setCollisionMask(me.collision.types.WORLD_SHAPE);
        // Play sfx
        p = Math.random();
        
            if (p <= 1/3) {
                me.audio.play("criHomme");
            } else if (p <= 2/3) {
                me.audio.play("criHomme2");
            } else {
                me.audio.play("criHomme3"); 
            }
        
            
        this.alive = false;
        // Add death animation
        this.renderable.setCurrentAnimation("dead");
            
        console.log("You win!");
        // http://stackoverflow.com/questions/8375962/settimeout-does-not-work
        setTimeout(function() {me.state.change(me.state.GAME_END);},1000);
        
        //remove it
        //me.game.world.removeChild(this);
        return true;
    },
});