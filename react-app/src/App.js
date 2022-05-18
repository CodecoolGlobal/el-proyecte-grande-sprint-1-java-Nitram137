import { IonPhaser } from '@ion-phaser/react';
import Phaser from 'phaser';
import GameScene from "./GameScene";
import React, { Component } from 'react';
import ModalLayout from "./Modal/ModalLayout.js";

class App extends Component {

    inputRef = React.createRef();

  toggleModal = () => {
    this.setState({ showModal: !this.state.showModal });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
      if (this.inputRef.current !== null) {
          this.inputRef.current.focus();
      }
  }

    callbacks = {
    toggleModal: this.toggleModal.bind(this)
  }

  state = {
    initialize: true,
    showModal: false,
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
      scene: [new GameScene(this.callbacks)]
    }
  }
  render() {
    const { initialize, game } = this.state
    return (
        <div>
        <IonPhaser game={game} initialize={initialize} />
        <ModalLayout isOpen={this.state.showModal}
                     toggle={this.toggleModal}
                     children={
                    <div>
                    <label htmlFor="input">Folder Name:</label>
                    <input type="text" id="input" ref={this.inputRef} className="ml-auto mr-auto w-100"/>
                    </div>}/>
        </div>
    )
  }
}

export default App;
