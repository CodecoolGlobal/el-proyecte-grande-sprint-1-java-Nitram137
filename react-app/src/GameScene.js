import Phaser from "phaser";
import FileController from "./Controller/fileController";

const PLAYER_KEY = "stickman";
const FLOOR = "invisible-floor";
const FOLDER = "folder";
const FILE = "file";
const startingCoords = [200, 250];

export default class GameScene extends Phaser.Scene {

    constructor(callbacks) {
        super('game-scene');
        this.callbacks = callbacks;
    }

    fileController = new FileController();

    locationTextStyle = {fontSize: '30px', fontStyle: "bold", color: "#ffd800"}

    globals = {
        folders: null,
        folderTitles: null,
        location: null,
        folderCollision: null,
        exitCollision: null,
        exit: null,
        newFolderCount: 0
    }

    preload() {
        this.load.image('background', "game_assets/background.png");
        this.load.image('frame', 'game_assets/blue_frame.png');
        this.load.image(FLOOR, 'game_assets/invisible_floor.png');
        this.load.image(FOLDER, 'game_assets/folder.png');
        this.load.image(FILE, 'game_assets/file.png');
        this.load.image('exit', 'game_assets/exit_sign.png');
        this.load.spritesheet(PLAYER_KEY, 'game_assets/stickman.png',
            {frameWidth: 152, frameHeight: 226});

    }

    create() {

        const modalBoxClosed = () => {
            let input = document.getElementById('input');
            input.value = "";
        }

        const handleSubmitModal = () => {
            let input = document.getElementById('input');
            if (input.value !== "") {
                this.fileController.createFolder(input.value);
            }
            this.refresh("", false);
            this.refresh("", false);
            input.value = "";
        }

        window.addEventListener('close-modal', modalBoxClosed);
        window.addEventListener('submit-modal', handleSubmitModal);

        this.add.image(0, 0, 'background').setOrigin(0, 0).setScale(7 / 8);
        this.add.image(1400, 720, 'exit').setOrigin().setScale(0.2);

        const platforms = this.createPlatforms();
        this.createFolders();

        this.player = this.createPlayer(startingCoords[0], startingCoords[1]);

        this.globals.exit = this.physics.add.staticImage(1650, 800, 'exit').setOrigin().setScale(0.05).refreshBody();

        this.add.image(0, 0, 'frame').setOrigin(0, 0).setScale(7 / 8);
        this.globals.locationText = this.add.text(10, 10, "Current location: " + this.fileController.currentRoute, this.locationTextStyle);

        this.physics.add.collider(this.player, platforms);

        this.recreateColliders();

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
            const distance = 255;
            const y = 800;
            for (let i = 0; i < result.fileModels.length; i++) {
                let folder;
                let x = X_START + i * distance;
                if (result.fileModels[i].directory === true) {
                    folder = folders.create(x, y, FOLDER).setName(result.fileModels[i].name).setScale(1.5);
                } else {
                    folder = folders.create(x, y, FILE).setName(result.fileModels[i].name).setScale(1.5);
                }
                folderTitles.push(this.add.text(x, y, folder.name, {color: "black"}).setOrigin());
            }
        });
        this.globals.folders = folders;
        this.globals.folderTitles = folderTitles;
    }

    recreateColliders() {
        this.globals.folderCollision = this.physics.add.collider(this.player, this.globals.folders, (player, folder) => {
            if (this.cursors.down.isDown) {
                if (folder.name.includes(".")) {
                    this.fileController.downloadFile(folder.name).then((response) => {
                        return response.blob();
                    }).then((data) => {
                        let a = document.createElement("a");
                        a.href = window.URL.createObjectURL(data);
                        if (folder.name.split('.').pop() === "jpg" || folder.name.split('.').pop() === "png") {
                            let image = new Image();
                            image.setAttribute('src', a.toString());
                            image.setAttribute("height", "500px");
                            let w = window.open("", '_blank');
                            w.document.write(image.outerHTML);
                            w.document.close();
                        } else {
                            a.download = folder.name;
                            a.click();
                        }
                    });
                    this.refresh("", true);
                    this.refresh("", true);
                } else {
                    this.refresh(folder.name);
                }
            }
            if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X))) {
                if (window.confirm("Are you sure about deleting this folder?")) {
                    this.fileController.deleteFile(folder.name, this.fileController.currentRoute);
                    this.refresh("", false);
                    this.refresh("", false);
                }
            }
        });
        this.globals.exitCollision = this.physics.add.collider(this.player, this.globals.exit, () => {
            if(this.fileController.currentRoute === "/") window.close();
            this.fileController.moveBack();
            this.refresh("");
        });
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
        if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE))) {
            this.callbacks.toggleModal();
        }
        if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.U))) {
            this.uploadFile();
        }
    }

    uploadFile() {
        let fileTab = document.createElement("input");
        fileTab.setAttribute("type", "file");
        fileTab.addEventListener("change", () => {
            const selectedFile = fileTab.files[0];
            if (selectedFile.size <= 10485760) {
                this.fileController.uploadFile(selectedFile);
            } else {
                alert("File is too large to upload. Maximum file size is 10MB");
            }
            this.refresh("", false);
            this.refresh("", false);
        });
        fileTab.click();
    }

    refresh(folderName, resetPlayer = true) {
        this.globals.folders.destroy(true);
        this.globals.folderTitles.forEach((folderTitle) => {folderTitle.destroy()});
        this.globals.locationText.destroy();
        this.globals.folderCollision.destroy();
        this.globals.exitCollision.destroy();

        this.createFolders(folderName);
        this.recreateColliders();
        if(resetPlayer) this.player.setPosition(startingCoords[0], startingCoords[1]);
        this.globals.locationText = this.add.text(10, 10, "Current location: " + this.fileController.currentRoute, this.locationTextStyle);
    }
}
