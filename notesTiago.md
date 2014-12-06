My learning notes during the development process.

[1st problem with Melon.js](https://groups.google.com/forum/#!msg/melonjs/i4Cbr5R4L0U/tfqt8NrTkQUJ)

[2nd problem with Melon.js](https://groups.google.com/forum/#!topic/melonjs/3Vj6hIbt8m4)

Wondering how to use dynamic image for animation of standing. Maybe define longer sprite with images needed and use:

<pre>
this.renderable.addAnimation("stand", [8, 9, etc.]);
</pre>

What about jump animation? Need to check on left and right if jump is set to true. If so, use jump animation with renderable.flipX?

To do:

* Check player movement speed.
* Check jump dynamics
* Fix camera
* Boarder dynamics







Resources:

Not used so far:

[Create Games](http://creategames.tumblr.com/)

