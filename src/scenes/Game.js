export default class Game extends Phaser.Scene {
    constructor() {
        super("Game");
    }

    init(data) {
        this.columnas = 4; // Número de obstaculos por columna (horizontal)
        this.filas = 3;    // Número de obstaculos filas (vertical)

        this.score = data.score || 0;                //cantidad de puntos obtenidos en el nivel anterior
        this.cant_obst = this.filas * this.columnas; //cantidad de puntos posibles por romper todos los bloques

        this.radio = 4 //radio de la pelota

        this.vidas = data.vidas || 3; //cantidad de vidas de inicio o restantes del nivel anterior
    }

    preload() {
        this.load.image("obstaculo", "./public/sprite/obstaculo.png");
    }

    create() {
        //jugador//---------------------------------------------------------------------------------------------
        this.paleta = this.add.rectangle(216/ 2, 200, 50, 8, 0x66ffff);
        this.physics.add.existing(this.paleta);
        this.paleta.body.setImmovable(true);
        this.paleta.body.setCollideWorldBounds(true);

        //pelota//----------------------------------------------------------------------------------------------
        this.pelota = this.add.circle(216/ 2, 216/ 2, this.radio, 0xffff66);
        this.physics.add.existing(this.pelota);
        this.pelota.body.setBounce(1, 1);
        this.pelota.body.setCollideWorldBounds(true);

        this.random = Phaser.Math.Between(-100, 100);
        this.pelota.body.setVelocityX(this.random);
        this.pelota.body.setVelocityY(-100);

        //Obstaculos--------------------------------------------------------------------------------------------
        //obtener ancho y alto de la textura
        this.texture = this.textures.get("obstaculo");
        this.spriteWidth = this.texture.getSourceImage().width; //obtener el ancho de la textura
        this.spriteHeight = this.texture.getSourceImage().height; //obtener el alto de la textura

        //obtener tamaño de pantalla
        this.pantallaWidth = this.cameras.main.width; //obtener el ancho de la pantalla
        this.pantallaHeight = this.cameras.main.height; //obtener el alto de la pantalla

        //operacion para acomodar a los obstaculos
        // (tamaño de pantalla - (tamaño de sprite * cantidad de obstaculos en horizontal)) / 2 = posicion de los obstaculos centrados
        this.obstaculos_x = (this.pantallaWidth - (this.spriteWidth * this.columnas)) / 2
        //this.obstaculos_x = 0;

        //crear obstaculo
        this.obstaculos = this.physics.add.staticGroup({createCallback: function (child) {child.setOrigin(0, 0); child.body.updateFromGameObject();}});
        for (this.fila = 0; this.fila < this.filas; this.fila++) {
            for (this.columna = 0; this.columna < this.columnas; this.columna++) {
                this.obstaculos.create(this.obstaculos_x + this.columna * this.spriteWidth, 40 + this.fila * this.spriteHeight, 'obstaculo');
            }
        }

        //piso
        this.piso = this.add.rectangle(this.pantallaWidth / 2, this.pantallaHeight - 1, this.pantallaWidth, 1, 0x66ffff);
        this.physics.add.existing(this.piso);
        this.piso.body.setImmovable(true);

        //vidas//


        //puntos//
        this.puntaje = this.add.text(128, 18, "score: " + this.score, {fontFamily: "GameBoy", fontSize: 8, color: "#ffffff",})

        //controles//
        this.cursors = this.input.keyboard.createCursorKeys();

        //coliciones//
        this.physics.add.collider(this.paleta, this.pelota);
        this.physics.add.collider(this.pelota, this.obstaculos, this.collisionHandler, null, this);
        this.physics.add.collider(this.pelota, this.piso, this.lose, null, this);
    }

    update() {
        if (this.cursors.left.isDown) {
            this.paleta.body.setVelocityX(-120);
        }
        else if (this.cursors.right.isDown) {
            this.paleta.body.setVelocityX(120);
        }
        else {
            this.paleta.body.setVelocityX(0);
        }
    }

    collisionHandler(pelota, obstaculo) {
        obstaculo.destroy();
        this.score ++;
        this.puntaje.setText("score: " + this.score);

        if (this.score === this.cant_obst) {
            this.scene.start(Nex_Level);
        }
    }

    lose(pelota, piso){ //si la pelota toca el piso
        console.log("toco el piso")
        this.cameras.main.shake(100, 0.03); // temblor de la camara
        
        this.vidas --;
        if (this.vidas > 0){
        }
        else {
            this.scene.start("Game", {vidas: this.vidas});
        }
    }
}