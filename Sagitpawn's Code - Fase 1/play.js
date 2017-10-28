var playState = {

    //Declaración de variables globales
    bolaON: false,
    turn: true,
    luzbool:false,
    
    player: undefined,
    jugador1: undefined,
    jugador2: undefined,

    gun: undefined,
    bullet: undefined,
    bitmap: undefined,
    GRAVITY: undefined,
    BULLET_SPEED:undefined,
    bulletPool:undefined,
    
    
    vidaJ1: 100,
    barraJ1:undefined,
    vidaJ2:100,
    barraJ2:undefined,
    layer:undefined,
    h: 1100,
    w: 700,

    cursor: undefined,

    limit: undefined,
    left: undefined,
    rigth: undefined, 
    top: undefined,

    // Esta variable timer controla los cambios de cámara  (al llamar a la función camera())
    timer: undefined,

    //Luciernagas
    luz:undefined,


    //Función create
    create: function () {

        // Variables para controlar la vida de cada personaje
        var barConfig;

        // Sistema de disparos
        var SHOT_DELAY;
        //this.bulletPool;
        var lastBulletShotAt;


        this.timer = game.time.create(false);

        //Declaración de funciones
        shootBullet = function(pointer){
            //Marcamos la velocidad de disparo. Tendrá un límite -> 1800 (velocidad mirada a ojo, te pasas si lo cargas a full)
            var max = 1800;
            var min = 250;
            playState.BULLET_SPEED = game.physics.arcade.distanceToPointer(pointer) * 10;
            if (playState.BULLET_SPEED >= max){playState.BULLET_SPEED = max;}
            if (playState.BULLET_SPEED <= min){playState.BULLET_SPEED = min;}


            if (lastBulletShotAt === undefined) {
                lastBulletShotAt = 0;
            }
            if (game.time.now - lastBulletShotAt < SHOT_DELAY) 
                return;
            lastBulletShotAt = game.time.now;

            //bullet = bulletPool.getFirstDead();
            if (playState.bullet === null || playState.bullet === undefined) 
            return;
            
            playState.bullet.revive();
            playState.bullet.checkWorldBounds = true;
            playState.bullet.outOfBoundsKill = true; 
            playState.bullet.body.gravity.y = 980;

            // Reasignamos la orientación de la bala en función del ángulo del sprite 'disparador'
            playState.bullet.reset(playState.gun.x, playState.gun.y);
            console.log(playState.gun.rotation + "Rotation shoot");
            playState.bullet.rotation = playState.gun.rotation;
            // Se carga el disparo en dirección contraria al desplazamiento del ratón
            playState.bullet.body.velocity.x = Math.cos(playState.bullet.rotation) * -playState.BULLET_SPEED;
            playState.bullet.body.velocity.y = Math.sin(playState.bullet.rotation) * -playState.BULLET_SPEED;

            // Cambio de sprites
            if (pointer == playState.jugador1){
                idleJ1();
            } else if(pointer == playState.jugador2){
                idleJ2();
            }

            playState.bolaON = true;

            
        },





        charge = function(pointer){
            
            // Creamos al cargar un sprite transparente donde clicamos, al mover el ratón el ángulo respecto este sprite nos dará la dirección de la bala
            playState.gun = game.add.sprite(pointer.x, pointer.y, 'shooter');
            SHOT_DELAY = 150;        // milliseconds podemos poner un delay tan grande como la trayectoria maxima
            playState.GRAVITY = 980;           // pixels/second/second


            playState.bitmap = game.add.bitmapData(game.width, game.height);
            playState.bitmap.context.fillStyle = 'rgb(255, 255, 255)';
            playState.bitmap.context.strokeStyle = 'rgb(255, 255, 255)';
            game.add.image(0, 0, playState.bitmap);
        },

        clean = function(){
            playState.bitmap.context.clearRect(0, 0, game.width, game.height);
        },
            
        // Con el parámetro pointer sabemos donde clicamos y alteramos el spritesheet
        setSprite = function(pointer) {
            if (pointer == playState.jugador1){
                chargeJ1();
            } else if (pointer == playState.jugador2){
                chargeJ2();
            }
        },

        game.world.setBounds(0, 0, 2334, 833);                  //Delimitar los bordes del mapa para que funcione el movimiento de camara
        
        //////////////////////////////////////////
        ////// Elementos de la escena:///////////
        //////////////////////////////////////////

        // Fondo
        game.add.sprite(0, -13, 'back');                      
        
        map = game.add.tilemap('MyTilemap', 32, 32, 8, 8);
        map.addTilesetImage('tiles');

        playState.layer = map.createLayer(0);

        map.setCollisionBetween(0,63);

        //Límites del mapa
        playState.limit = game.add.group();
        playState.limit.enableBody = true;
        playState.left = playState.limit.create(-10, 0, 'sides');
        playState.right = playState.limit.create(2350, 0, 'sides');
        playState.top = playState.limit.create(10, 0, 'sky');

        playState.limit.setAll('body.immovable', true);
        
        


        ///////////////////////////////
        // Gestión de jugadores:///////
        ///////////////////////////////

        // Creamos el grupo de jugadores. Activamos body para colisiones.
        playState.player = game.add.group();
        playState.player.enableBody = true;
        
        playState.jugador1 = playState.player.create(220, 620, 'jugador1');
        playState.jugador1.anchor.setTo(0.5, 0.5); 
        playState.jugador2 = playState.player.create(2050, 620, 'jugador2');
        playState.jugador2.anchor.setTo(0.5, 0.5); 
        // De momento no queremos que se muevan al colisionar con la bala
        playState.player.setAll('body.immovable', true);
        // A pesar de immovable, siguen con su gravedad
        playState.jugador1.body.gravity.y=300;
        playState.jugador2.body.gravity.y=300;

        playState.jugador1.animations.add('idle');                
        playState.jugador1.animations.play('idle', 10, true);             //Cargamos la spritesheet para el jugador 1 y le damos nombre a la animación como idle.

        playState.jugador2.animations.add('idle');                
        playState.jugador2.animations.play('idle', 10, true);             //Cargamos la spritesheet para el jugador 2 y le damos nombre a la animación como idle.

        // Animacion de luciernagas

        playState.luz = game.add.sprite(850, 285, 'luz');
        playState.luz.scale.setTo(0.75, 0.75);
        game.physics.arcade.enable(playState.luz);
        playState.luz.animations.add('bucle');
        playState.luz.animations.play('bucle', 3, true);
        playState.luz.alpha = 0;
       // playState.luz.body.velocity.x = 30;

        // Gestión de trayectoria y disparos
        playState.bitmap = game.add.bitmapData(game.width, game.height);
        playState.bulletPool = game.add.group();
        playState.bulletPool.enableBody = true;
        playState.bullet = playState.bulletPool.create(playState.player.x, playState.player.y, 'bullet');
        //Set its pivot point to the center of the bullet
        playState.bullet.anchor.setTo(0.5, 0.5);
        // Set its initial state to "dead".
        playState.bullet.kill();

        playState.bullet.body.gravity.y = playState.GRAVITY;


        // Enable input para ambos jugadores
        playState.jugador1.inputEnabled = true;
        playState.jugador1.events.onInputDown.add(charge);
        //jugador1.events.onInputDown.add(drawTraj);                //Hay que llamrlo en update de alguna forma
        playState.jugador1.events.onInputUp.add(shootBullet);         
        playState.jugador1.events.onInputDown.add(setSprite);               //Cambia el spritesheet
        //jugador1.events.onInputUp.add(clean);


        playState.jugador2.inputEnabled = true;
        playState.jugador2.events.onInputDown.add(charge);
        //jugador2.events.onDragStart.add(drawTraj);                  //Hay que llamarlo en update de alguna forma
        playState.jugador2.events.onInputUp.add(shootBullet);
        playState.jugador2.events.onInputDown.add(setSprite); 
        //jugador2.events.onInputUp.add(clean);

        // Comenzamos siguiendo las acciones del jugador 1
        game.camera.follow(playState.jugador1);


        //////////////////////////////////////////////////
        ///////////////// Barra de Vida///////////////////
        //////////////////////////////////////////////////  https://github.com/bmarwane/phaser.healthbar/blob/master/README.md
        
        //Configuración para la barra
        barConfig = {width: 70,
                    height: 15,};  

        playState.barraJ1 = new HealthBar(game, barConfig);
        playState.barraJ1.setPosition(playState.jugador1.x + 20, playState.jugador1.y - 10);

        playState.barraJ2 = new HealthBar(game, barConfig);
        playState.barraJ2.setPosition(playState.jugador2.x + 20, playState.jugador2.y - 10);

        
        //////////////////////////////////////////////////////
        //////////////// Menu de Pause ///////////////////////
        //////////////////////////////////////////////////////

        function unpause(event){
            if(game.paused){
                //Coordenadas del .png del menu
                var x1 = playState.w/2 - 200, x2 = playState.w/2 + 200,
                    y1 = playState.h/2 - 210, y2 = playState.h/2 + 210;
                    console.log("x1 " + x1 + " x2 " + x2);
                    console.log("x2 " + y1 + " y2 " + y2);
    
                    console.log("Event.x " + event.x + " x1 " + x1 + "\n Event.x " + event.x + " x2 " + x2 + " \n Event.y " + event.y + " y " + y1  + "\n Event.y " + event.y + " y2 " + y2);
                // Check if the click was inside the menu
                if(true){//event.x > x1 && event.x < x2 && event.y > y1 && event.y < y2 ){
    
                    //Coordenadas locales al menú
                    var x = event.x - x1,
                        y = event.y - y1;
                    
                        console.log("Xlocal " + x + "\n Ylocal " + y);
    
                    //Calculamos la elección
                    var choise = 3*Math.floor(y / 70);
                    console.log(choise);
                    if (choise == -6){
                        menu.destroy();
                        game.paused = false;
                    }else if (choise == -3){
                        console.log("Hola entro en Continuar");                        
                    }
                    else if(choise ==  0){
                        menu.destroy();
                    }
                }
            }
        };

        

        pause_label = game.add.text(1020, 150, 'Pause', { font: '22px Arial', fill: 'white' });
        pause_label.inputEnabled = true;

        pause_label.events.onInputUp.add(function () {
            game.paused = true;
    
            //Añadimos menú
            menu = game.add.sprite(1100/2, 700/2, 'menu');
            menu.anchor.setTo(0.5, 0);
        });
    
        //Evento de fullscreen
        game.input.onDown.add(unpause, self);


        /////////////////////////////////////////////
        //////////Full Screen ///////////////////////
        /////////////////////////////////////////////

        gofull = function() {

            console.log("reescalando");
            if (game.scale.isFullScreen)
            {
                game.scale.stopFullScreen();
            }
            else
            {
                game.scale.startFullScreen(false);
            }

        },
        cursors = game.input.keyboard.addKey(Phaser.Keyboard.F);
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
        cursors.onDown.add(gofull, this);
    },


    

    update: function() {
        
        //Variables locales a update
        var timeOffset;
        var hit;
        //var diftime;
        //var elapsed;

        colisionPelotaJ1 = function(player, bullet) {
            playState.vidaJ1 -= 20;
            playState.barraJ1.setPercent(playState.vidaJ1);
        },
        
        colisionPelotaJ2 = function(player, bullet) {
            playState.vidaJ2 -= 20;
            playState.barraJ2.setPercent(playState.vidaJ2);
        },

        chargeJ1 = function(){
            playState.jugador1.loadTexture('j1Cargando', 0);
            playState.jugador1.animations.add('charging');
            playState.jugador1.animations.play('charging', 8, true);
        },
        
        fireJ1 = function(){
            playState.jugador1.loadTexture('j1Disparando', 0);
            playState.jugador1.animations.add('fire');
            playState.jugador1.animations.play('fire', 8, true);
        },
        
        idleJ1 = function(){
            playState.jugador1.loadTexture('jugador1', 0);
            playState.jugador1.animations.add('idle');
            playState.jugador1.animations.play('idle', 8, true);
        },

        // Sistema de control de spritesheets j2:   modularizar proximamente
        chargeJ2 = function(){
            playState.jugador2.loadTexture('j2Cargando', 0);
            playState.jugador2.animations.add('charging');
            playState.jugador2.animations.play('charging', 8, true);
        },
        fireJ2 = function(){
            playState.jugador2.loadTexture('j1Disparando', 0);
            playState.jugador2.animations.add('fire');
            playState.jugador2.animations.play('fire', 8, true);
        },
        
        idleJ2 = function(){
            playState.jugador2.loadTexture('jugador2', 0);
            playState.jugador2.animations.add('idle');
            playState.jugador2.animations.play('idle', 8, true);
        },

        // Función disparos v2. dibujado de trayectoria
        drawTraj = function(){

            playState.bitmap.context.clearRect(playState.jugador1.x, playState.jugador1.y, game.width, game.height);
            playState.bitmap.context.fillStyle = 'rgba(255, 255, 255, 0.5)';
            var MARCH_SPEED = 40; // Smaller is faster
            timeOffset = timeOffset + 1 || 0;
            timeOffset = timeOffset % MARCH_SPEED;

            var correctionFactor = 0.99;
            var theta = -playState.gun.rotation;
            var x = 0;
            var y = 0;
            for(var t = 0 + timeOffset/(1000*MARCH_SPEED/60); t < 3; t += 0.03) {
                x = playState.BULLET_SPEED * t * Math.cos(theta) * correctionFactor;
                y = playState.BULLET_SPEED * t * Math.sin(theta) * correctionFactor - 0.5 * playState.GRAVITY * t * t;
                playState.bitmap.context.fillRect(x + playState.player.x, playState.player.y - y, 3, 3);
                if (y < -15) 
                break;
            }

            playState.bitmap.dirty = true;
        },


        // Colisiones jugador con el mapa
        game.physics.arcade.collide(playState.player, playState.layer);
        // Colisiones bullet con el mapa
        var hitGround = game.physics.arcade.collide(playState.bulletPool, playState.layer);
        var hitJugador = game.physics.arcade.collide(playState.player, playState.bulletPool);
        var hitBounds = game.physics.arcade.collide(playState.bulletPool, playState.limit);

        playState.bulletPool.forEachAlive(function(bullet) {
            playState.bullet.rotation = Math.atan2(playState.bullet.body.velocity.y, playState.bullet.body.velocity.x);
        }, this);

        if (playState.gun != undefined){
            playState.gun.rotation = game.physics.arcade.angleToPointer(playState.gun);
            console.log(playState.gun.rotation) + " porba    ";
            drawTraj();     

            if (playState.bullet != undefined){
                //Variable para detectar colisión pelota-jugador:
                game.physics.arcade.overlap(playState.jugador1, playState.bullet, colisionPelotaJ1, null, this);
                game.physics.arcade.overlap(playState.jugador2, playState.bullet, colisionPelotaJ2, null, this); 
            }
        } 

        /*if (hitJugador || hitGround || hitBounds) {
            hit = true;
            elapsed = 0;
            diftime = 0;            
            playState.bullet.kill();
            elapsed = game.time.totalElapsedSeconds();
        }

        //Cuando ha habido colisión, se llama a este método para esperar 0.8 segundos antes de cambiar la cámara
        if (hit){
            console.log(playState.turn); 
            playState.turn = !playState.turn;
            diftime = game.time.totalElapsedSeconds() - elapsed;
            console.log(elapsed);
            console.log(diftime);
            playState.turn = !this.turn; 
            if (diftime >= 0.8){
                playState.turn = !playState.turn;
                console.log("gallerta");
                playState.bolaON = false;
                hit = false;
            }
        }*/

        if (hitJugador || hitGround || hitBounds) {
            hit = true;
            playState.bullet.kill();
            this.timer.loop(800, camera, this);
            this.timer.start();
        }


        function camera(){
            playState.turn = !playState.turn;
            playState.bolaON = false;
            hit = false;
            this.timer.stop();
        }

        /*
        if (playState.luz.body.x === 300){
            playState.luz.body.velocity.x = -30;
            volver();
        }

        if(playState.luz.body.x === -300){
            playState.luz.body.velocity.x = 30;
        }

        function volver(){
            game.time.events.add(800, function() {      
                game.add.tween(playState.luz).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true);
            }, this);
        }*/
        if(this.luzbool === false){
            game.time.events.add(15000, function() {
                this.luzbool = true;      
                game.add.tween(playState.luz).to({alpha: 1}, 200, Phaser.Easing.Linear.None, true);
            }, this);
        }else{
            game.time.events.add(15000, function() {    
                this.luzbool = false;  
                game.add.tween(playState.luz).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true);
                
            }, this);
        }

        


        if (playState.bolaON == true){
            game.camera.follow(playState.bullet);
        }else if(playState.bolaON == false && playState.turn == true) {
            game.camera.follow(playState.jugador1);
        }else if(playState.bolaON == false && playState.turn == false) {
            game.camera.follow(playState.jugador2);                
        }


        //Comprobaciones por si se ha acabado el juego
        if (playState.vidaJ1 == 0 || playState.vidaJ2 == 0){ 
            //game.state.play(gameOver);
        }

        
    },
}