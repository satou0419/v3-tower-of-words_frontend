import { Metadata } from 'next';
import JoinRoom from './page';

export const metadata: Metadata = {
    title: 'Join Room',
    description: 'The Join Room feature is where the users can join custom made rooms.'
  };

  export default function LayoutJoinRoom(){

    return <JoinRoom/>
}