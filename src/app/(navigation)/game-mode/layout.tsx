import { Metadata } from 'next';
import GameMode from './page';

export const metadata: Metadata = {
    title: 'GameMode',
    description: 'The GameMode feature is where users play the game. It offers an immersive experience designed for maximum enjoyment.'
  };

  export default function LayoutGameMode(){

    return <GameMode/>
}