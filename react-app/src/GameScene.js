import Phaser from "phaser";
import FileController from "./Controller/fileController";

const PLAYER_KEY = "stickman";
const FLOOR = "invisible-floor";
const FOLDER = "folder";
const startingCoords = [200, 250];

export default class GameScene extends Phaser.Scene {

    constructor() {
        super('game-scene');
    }

    fileController = new FileController();

    preload() {
        this.load.image('background', "game_assets/background.png");
        this.load.image('frame', 'game_assets/blue_frame.png');
        this.load.image(FLOOR, 'game_assets/invisible_floor.png');
        this.load.image(FOLDER, 'game_assets/folder.png');
        this.load.image('exit', 'game_assets/exit_sign.png')
        this.load.spritesheet(PLAYER_KEY, 'game_assets/stickman.png',
            {frameWidth: 152, frameHeight: 226});

    }

    create() {
        this.add.image(0, 0, 'background').setOrigin(0, 0).setScale(7 / 8);

        const platforms = this.createPlatforms();
        const FolderObject = this.createFolders();
        let folders = FolderObject.folders;
        let folderTitles = FolderObject.titles;

        this.player = this.createPlayer(startingCoords[0], startingCoords[1]);

        const exit = this.physics.add.staticImage(1400, 600, 'exit').setOrigin().setScale(0.2).refreshBody();

        this.add.image(0, 0, 'frame').setOrigin(0, 0).setScale(7 / 8);
        let locationText = this.add.text(10, 10, "Current location: " + this.fileController.currentRoute, {fontSize: '30px'});

        this.physics.add.collider(this.player, platforms);

        let folderCollision = this.physics.add.collider(this.player, folders, (player, folder) => {
            if (this.cursors.down.isDown) {
                const RefreshedContent = this.refresh(folders, folderTitles, locationText, folder.name, folderCollision, exitCollision, exit);
                folders = RefreshedContent.folders;
                folderTitles = RefreshedContent.titles;
                locationText = RefreshedContent.location;
                folderCollision = RefreshedContent.collision;
                exitCollision = RefreshedContent.exit;
            }
        });

        let exitCollision = this.physics.add.collider(this.player, exit, () => {
            if(this.fileController.currentRoute === "/") window.close();
            this.fileController.moveBack();
            const RefreshedContent = this.refresh(folders, folderTitles, locationText, "", folderCollision, exitCollision, exit);
            folders = RefreshedContent.folders;
            folderTitles = RefreshedContent.titles;
            locationText = RefreshedContent.location;
            folderCollision = RefreshedContent.collision;
            exitCollision = RefreshedContent.exit;
        });

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    createPlatforms() {
        const platforms = this.physics.add.staticGroup();

        platforms.create(840, 925, 'invisible-floor').refreshBody();

        return platforms;
    }

    createFolders(folderName = "") {
        const folders = this.physics.add.group({
            immovable: true,
            allowGravity: false
        });

        const folderTitles = [];

        this.fileController.getFolderContent(folderName).then((result) => {
            const X_START = 200;
            const distance = 250;
            const y = 800;
            for (let i = 0; i < result.fileModels.length; i++) {
                let x = X_START + i * distance;
                const folder = folders.create(x, y, FOLDER).setName(result.fileModels[i].name).setScale(1.5).refreshBody();
                folderTitles.push(this.add.text(x, y, folder.name, {color: "black"}).setOrigin());
            }
        });

        return {"folders": folders, "titles": folderTitles};
    }

    createPlayer(x, y) {

        const player = this.physics.add.sprite(x, y, PLAYER_KEY).setScale(2 / 3);
        player.setCollideWorldBounds(true);

        // Animations
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers(PLAYER_KEY, {start: 0, end: 6}),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [{key: PLAYER_KEY, frame: 7}],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers(PLAYER_KEY, {start: 8, end: 14}),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'jump_right',
            frames: [{key: PLAYER_KEY, frame: 15}],
            frameRate: 20
        });

        this.anims.create({
            key: 'jump_left',
            frames: [{key: PLAYER_KEY, frame: 16}],
            frameRate: 20
        });

        this.anims.create({
            key: 'jump',
            frames: [{key: PLAYER_KEY, frame: 17}],
            frameRate: 20
        });

        return player;
    }

    update() {

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-300);
            if (!this.player.body.touching.down) this.player.anims.play('jump_left');
            else this.player.anims.play('left', true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(300);
            if (!this.player.body.touching.down) this.player.anims.play('jump_right');
            else this.player.anims.play('right', true);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) this.player.setVelocityY(-540);
        if (!this.player.body.touching.down && !this.cursors.right.isDown && !this.cursors.left.isDown) this.player.anims.play('jump');
    }

    refresh(folders, folderTitles, locationText, folderName, folderCollision, exitCollision, exit) {
        folders.destroy(true);
        folderTitles.forEach((folderTitle) => {folderTitle.destroy()});
        locationText.destroy();
        folderCollision.destroy();
        exitCollision.destroy();
        const FolderObject = this.createFolders(folderName);
        folders = FolderObject.folders;
        folderTitles = FolderObject.titles;
        folderCollision = this.physics.add.collider(this.player, folders, (player, folder) => {
            if (this.cursors.down.isDown) {
                const RefreshedContent = this.refresh(folders, folderTitles, locationText, folder.name, folderCollision, exitCollision, exit);
                folders = RefreshedContent.folders;
                folderTitles = RefreshedContent.titles;
                locationText = RefreshedContent.location;
                exitCollision = RefreshedContent.exit;

            }
        });
        exitCollision = this.physics.add.collider(this.player, exit, () => {
            if(this.fileController.currentRoute === "/") window.close();
            this.fileController.moveBack();
            const RefreshedContent = this.refresh(folders, folderTitles, locationText, "", folderCollision, exitCollision, exit);
            folders = RefreshedContent.folders;
            folderTitles = RefreshedContent.titles;
            locationText = RefreshedContent.location;
            folderCollision = RefreshedContent.collision;
            exitCollision = RefreshedContent.exit;
        });
        this.player.setPosition(startingCoords[0], startingCoords[1]);
        locationText = this.add.text(10, 10, "Current location: " + this.fileController.currentRoute, {fontSize: '30px'});
        return {"folders": folders, "titles": folderTitles, "location": locationText, "collision": folderCollision, "exit": exit};
    }
}
