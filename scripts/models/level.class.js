class Level{
    enemies;
    backgroundObjects;
    clouds;
    coins;
    nottle;
    level_end_x = 2157;

    constructor(enemies, clouds, backgroundObjects, coins, bottle){
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.bottle = bottle;
    }
}