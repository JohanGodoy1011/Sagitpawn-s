var game = new Phaser.Game(1100, 700, Phaser.AUTO, 'canvas');

game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('play', playState);
game.state.add('gameover1', finishState1);
game.state.add('gameover2', finishState2);

game.state.start('boot');

//http://perplexingtech.weebly.com/game-dev-blog/using-states-in-phaserjs-javascript-game-developement
