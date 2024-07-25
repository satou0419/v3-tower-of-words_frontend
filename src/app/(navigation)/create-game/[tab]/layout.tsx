import { Metadata } from 'next';
import CreateGame from './page';

export const metadata: Metadata = {
    title: 'Create Game',
    description: 'The create game feature is where the users can make and personalize their own game to their liking.'
  };

  export default function LayoutCreateGame(){

    return <CreateGame/>
}