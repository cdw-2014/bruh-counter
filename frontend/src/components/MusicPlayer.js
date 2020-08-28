import React from 'react'
import {makeStyles} from '@material-ui/core/styles'
import AddCircleIcon from '@material-ui/icons/AddCircle';
import PanToolIcon from '@material-ui/icons/PanTool';
import { Button, Grid } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
	 MusicPlayer: {
     flexGrow: 1,
     marginTop: theme.spacing(5)
   },
   Player: {
    backgroundColor: '#616161',
   },
   QueueDiv:{
     marginTop: '2%',
     backgroundColor: '#616161'
   },
   QueueMenu: {
    marginTop: '1%',
    marginBottom: '1%',
    marginLeft: '1%',
    marginRight: '1%',
    backgroundColor: 'gray'
   },
   buttonAdd: {
    marginRight: theme.spacing(10)
  },
   buttonStop: {
     marginLeft: theme.spacing(10)
   },
   Queue: {
     marginTop: '1%',
     marginBottom: '1%',
     backgroundColor: 'gray'
   }
}));

const MusicPlayer = props => {
const classes = useStyles();

  return (
    <div className={classes.MusicPlayer}>

    {/* Player */}
    <Grid
      container
      direction="column"
      justify="space-evenly"
      alignItems="center"
    >
      <Grid item Player className={classes.Player}>
        <h1>ddsdsdds</h1>
        <h1>ddsdsdds</h1>
        <h1>ddsdsdds</h1>
        <h1>ddsdsdds</h1>
      </Grid>

      {/* Queue */}
      <Grid
        container
        className={classes.QueueDiv}
        direction="column"
        alignItems="center"
        xs = {6} 
      >
        <Grid item QueueMenu className={classes.QueueMenu}> 
          <Button className={classes.buttonAdd} startIcon={<AddCircleIcon/>}>Add To Queue</Button>
          <Button className={classes.buttonStop} startIcon={<PanToolIcon/>}>Stop Player</Button>
        </Grid>

        {/* Music Queue */}
        <Grid item Queue className={classes.Queue}>
          <h1>ddsdsdds</h1>
        </Grid>
        <Grid item Queue className={classes.Queue}>
          <h1>ddsdsdds</h1>
        </Grid>
        <Grid item Queue className={classes.Queue}>
          <h1>ddsdsdds</h1>
        </Grid>
        <Grid item Queue className={classes.Queue}>
          <h1>ddsdsdds</h1>
        </Grid>
        <Grid item Queue className={classes.Queue}>
          <h1>ddsdsdds</h1>
        </Grid>
        <Grid item Queue className={classes.Queue}>
          <h1>ddsdsdds</h1>
        </Grid>
        <Grid item Queue className={classes.Queue}>
          <h1>ddsdsdds</h1>
        </Grid>

      </Grid>

    </Grid>        
    </div>
 
  )
}

export default MusicPlayer