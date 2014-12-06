game.resources = [

    /* Graphics.
     * @example
     * {name: "example", type:"image", src: "data/img/example.png"},
     */
    //our level tileset
    {name: "area01_level_tiles", type:"image", src:"data/img/map/area01_level_tiles.png"},
    // The main player spritesheet
    {name: "gripe_run_right", type:"image", src: "data/img/sprite/gripe_run_right.png"},
    // the background
    // !NOTE! need to change for our game
    {name: "area01_bkg0", type: "image", src: "data/img/area01_bkg0.png"},
    {name: "area01_bkg1", type: "image", src: "data/img/area01_bkg1.png"},

    /* Texture Atlases
     * @example
     * {name: "texture", type: "json", src: "data/img/example_tps.json"},
     */

    /* Maps.
     * @example
     * {name: "example01", type: "tmx", src: "data/map/example01.tmx"},
     * {name: "example01", type: "tmx", src: "data/map/example01.json"},
      */
    {name: "area01",type: "tmx", src: "data/map/area01.tmx"}

    /* Background music.
     * @example
     * {name: "example_bgm", type: "audio", src: "data/bgm/"},
     */

    /* Sound effects.
     * @example
     * {name: "example_sfx", type: "audio", src: "data/sfx/"}
     */
];
