var config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
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

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('background', '../images/background.png');
    this.load.image('pipe', '../images/pipe.png');
    this.load.spritesheet('stickman', '../images/stickman.png', { frameWidth: 222, frameHeight: 226 });

}

function create ()
{
    this.add.image(0, 0, 'background').setOrigin(0,0).setScale(2/3);

    platforms = this.physics.add.staticGroup();

    platforms.create(640, 600, 'pipe').refreshBody();

    player = this.physics.add.sprite(700, 350, 'stickman').setScale(2/3);

    player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('stickman', { start: 0, end: 6 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'stickman', frame: 7 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'jump',
        frames: [ { key: 'stickman', frame: 15 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('stickman', { start: 8, end: 14 }),
        frameRate: 10,
        repeat: -1
    });

    cursors = this.input.keyboard.createCursorKeys();

    this.physics.add.collider(player, platforms);
}

function update ()
{
    if (cursors.left.isDown)
    {
        player.setVelocityX(-160);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(160);
        player.anims.play('right', true);
    }
    else
    {
        player.setVelocityX(0);
        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down) player.setVelocityY(-450);

    if (!player.body.touching.down) player.anims.play('jump');
}