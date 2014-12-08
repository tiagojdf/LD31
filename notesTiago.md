My learning notes during the development process.

[1st problem with Melon.js](https://groups.google.com/forum/#!msg/melonjs/i4Cbr5R4L0U/tfqt8NrTkQUJ)

[2nd problem with Melon.js](https://groups.google.com/forum/#!topic/melonjs/3Vj6hIbt8m4)

3rd problem - bug with empty object list. I believe it has been fixed in the meantime.

4th problem - collisions are a mess. Found a nicer syntax solution than the one use in the tutorial

5th problem - when uploading to github, it seems git is case insensitive to rename operations, so I needed to use git mv -- force <oldName> <newName>. I had to do so, because melonJS with grunt asks for lowercase url.

Table for object collision:

* NO_OBJECT: 0
* PLAYER_OBJECT: 1
* NPC_OBJECT: 2
* ENEMY_OBJECT: 4
* COLLECTABLE_OBJECT: 8
* ACTION_OBJECT: 16
* PROJECTILE_OBJECT: 32
* WORLD_SHAPE: 64* 
* ALL_OBJECT: 4294967295

Now using my own way to process collisions.
switch(other.body.collisionType)

Inspired by:
http://melonjs.github.io/docs/me.Entity.html#onCollision



Wondering how to use dynamic image for animation of standing. Maybe define longer sprite with images needed and use:

<pre>
this.renderable.addAnimation("stand", [8, 9, etc.]);
</pre>

What about jump animation? Need to check on left and right if jump is set to true. If so, use jump animation with renderable.flipX?

To do:

* Change Theese sprite to more colorfull
* Check player movement speed.
* Check jump dynamics - increase so jump can go up to 4 houses.
* Boarder dynamics
* Layer where enemies can hide - done graphicaly but did not implement mechanics
* enemy AI
    * make movement
    * direction opposite to player    
* Add timer for TIME ATTACK!!!

To remove:

* coin
* background scrolling








Resources:

[Add entities withou tiled](http://stackoverflow.com/questions/24294509/programmatically-insert-entities-in-melonjs) - needed to generate random enemies. [another site with the same](https://github.com/melonjs/melonJS/wiki/Frequently-Asked-Questions#object_pooling)

Not used so far:

[Create Games](http://creategames.tumblr.com/)

