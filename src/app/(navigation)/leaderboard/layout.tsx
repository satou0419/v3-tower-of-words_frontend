import { Metadata } from 'next';
import Leaderboard from './page';

export const metadata: Metadata = {
    title: 'Leaderboard',
    description: 'The Leaderboard feature is where the users can assess how they did on the gameplay.'
  };

  export default function LayoutLeaderboard(){

    return <Leaderboard/>
}