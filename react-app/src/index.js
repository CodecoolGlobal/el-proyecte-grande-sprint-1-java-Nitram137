import Phaser from "phaser";
import React from "react";
import GameScene from "./GameScene";
import "./index.css";

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
    scene: [GameScene]
};

export default new Phaser.Game(config);
