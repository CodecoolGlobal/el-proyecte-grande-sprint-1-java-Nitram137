import { IonPhaser } from '@ion-phaser/react'
import Phaser from 'phaser'
import GameScene from "./GameScene";
import React, { Component } from 'react'

class App extends Component {
  state = {
    initialize: true,
    game: {
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
    }
  }
  render() {
    const { initialize, game } = this.state
    return (
        <IonPhaser game={game} initialize={initialize} />
    )
  }
}

export default App;
