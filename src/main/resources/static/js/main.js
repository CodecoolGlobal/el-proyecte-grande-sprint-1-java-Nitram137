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

function preload ()
{
    this.load.image('background', '../images/background.png');
    this.load.image('folder', '../images/folder.png');
    this.load.spritesheet('stickman', '../images/stickman.png', { frameWidth: 222, frameHeight: 226 });

}

function create ()
{
    this.add.image(0, 0, 'background').setOrigin(0,0).setScale(7/8);

    platforms = this.physics.add.staticGroup();

    for(let i=0;i<6;i++) {
        let tilt = 200 + i * 250;
        platforms.create(tilt, 800, 'folder').setScale(1.5).refreshBody();
        if(i>1 && i<4) platforms.create(tilt, 650, 'folder').setScale(1.5).refreshBody();
}

    player = this.physics.add.sprite(500, 350, 'stickman').setScale(2/3);

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

    if (cursors.up.isDown && player.body.touching.down) player.setVelocityY(-560);

    if (!player.body.touching.down) player.anims.play('jump');
}