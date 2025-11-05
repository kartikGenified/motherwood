import GamesMenu from './GamesMenu';
import TapTheDot from './TapTheDot';

const gameModule = [
  {
    name: 'GamesMenu',
    component: GamesMenu,
    options: { headerShown: false },
  },
  {
    name: 'TapTheDot',
    component: TapTheDot,
    options: { headerShown: false },
  },
  {
    name:'Flappy',
    component: TapTheDot,
    options: { headerShown: false },
  }
]

export default gameModule;