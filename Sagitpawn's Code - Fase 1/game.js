var game = new Phaser.Game(1100, 700, Phaser.AUTO, 'canvas');

game.state.add('boot', bootState);

game.state.start('boot');

//http://perplexingtech.weebly.com/game-dev-blog/using-states-in-phaserjs-javascript-game-developement
