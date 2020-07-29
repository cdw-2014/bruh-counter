import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Home from './components/Home'
import BruhSounds from './components/BruhSounds';
import MusicPlayer from './components/MusicPlayer';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import {makeStyles} from '@material-ui/core/styles'
import { AppBar } from '@material-ui/core'
import DiscordLogo from './components/images/discordblack.png'

const useStyles = makeStyles((theme) => ({
	App:{
		flexGrow: 1
	},
	nav: {
		background: '#616161',
		flexGrow: 1
	},
	logo: {
		width: '4%',
		padding: '0.5%',
	},
	brand: {
		flexGrow: 1,
		color: 'black'
	}
}));

const App = props => {
  const classes = useStyles();
  return (
    <div className={classes.App}>
		<AppBar position="static" className={classes.nav}>
			<Toolbar>

				{/* Make logo responsive */}
				<img className={classes.logo} src={DiscordLogo} alt='Discord Logo'></img>
				
				<Typography className={classes.brand} variant='h5'>
					BruhBot
				</Typography>

				<Button href="/">Home</Button>
				<Button href="/BruhSounds" disabled>BruhSounds</Button>
				<Button href="/MusicPlayer">Music Player</Button>
			</Toolbar>
			
		</AppBar>
  
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/BruhSounds" component={BruhSounds} />
          <Route exact path="/MusicPlayer" component={MusicPlayer} />
        </Switch>
      </Router>
    </div>
  );
}

export default App
