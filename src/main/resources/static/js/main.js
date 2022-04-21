import FileController from "./Controller/fileController.js";

const config = {
    type: Phaser.AUTO,
    width: 1680,
    height: 950,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

const gameElements = {
    player: null,
    cursors: null,
    platforms: null,
}

function preload ()
{
    this.load.image('background', '../images/background.png');
    this.load.image('invisible-floor', '../images/invisible_floor.png');
    this.load.image('folder', '../images/folder.png');
    this.load.spritesheet('stickman', '../images/stickman.png', { frameWidth: 152, frameHeight: 226 });

}

function create ()
{
    // Background
    this.add.image(0, 0, 'background').setOrigin(0,0).setScale(7/8);

    // Platforms
    gameElements.platforms = this.physics.add.staticGroup();

    const fileCont = new FileController();
    fileCont.getFolderContent("").then((response) => {
        for (let i = 0; i < response.fileModels.length; i++) {
            let tilt = 200 + i * 250;
            gameElements.platforms.create(tilt, 800, 'folder').setScale(1.5).refreshBody();
            this.add.text(tilt-50, 800, response.fileModels[i].name, { font: '"Press Start 2P"' });
        }
    })

    gameElements.platforms.create(840, 925, 'invisible-floor').refreshBody();

    //Player
    gameElements.player = this.physics.add.sprite(200, 250, 'stickman').setScale(2/3);
    gameElements.player.setCollideWorldBounds(true);

    // Animations
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('stickman', { start: 0, end: 6 }),
        frameRate: 15,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'stickman', frame: 7 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('stickman', { start: 8, end: 14 }),
        frameRate: 15,
        repeat: -1
    });

    this.anims.create({
        key: 'jump_right',
        frames: [ { key: 'stickman', frame: 15 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'jump_left',
        frames: [ { key: 'stickman', frame: 16 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'jump',
        frames: [ { key: 'stickman', frame: 17 } ],
        frameRate: 20
    });

    // Controls
    gameElements.cursors = this.input.keyboard.createCursorKeys();

    // Collisions
    this.physics.add.collider(gameElements.player, gameElements.platforms);
}

function update ()
{
    let cursors = gameElements.cursors;
    let player = gameElements.player;
    if (cursors.left.isDown)
    {
        player.setVelocityX(-200);
        if (!player.body.touching.down) player.anims.play('jump_left');
        else player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(200);
        if (!player.body.touching.down) player.anims.play('jump_right');
        else player.anims.play('right', true);
    }
    else
    {
        player.setVelocityX(0);
        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down) player.setVelocityY(-540);
    if (!player.body.touching.down && !cursors.right.isDown && !cursors.left.isDown) player.anims.play('jump');
}