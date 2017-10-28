var game = new Phaser.Game(1100, 700, Phaser.AUTO, 'canvas');

game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('play', playState);

game.state.start('boot');
