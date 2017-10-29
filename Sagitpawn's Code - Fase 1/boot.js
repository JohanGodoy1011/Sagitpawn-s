var bootState = {
    create: function(){
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        game.state.add('load', loadState);
        game.state.start('load');
    },
}