var game = new Phaser.Game(1100, 700, Phaser.AUTO, 'canvas');

game.state.add('boot', bootState);

game.state.start('boot');

