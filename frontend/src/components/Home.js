import React from 'react'
import {makeStyles} from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
	Home: {
		backgroundColor: 'gray'
  }
}));

const Home = props => {
  const classes = useStyles();
  return (
    <div className={classes.Home}>
      
    </div>
  )
}

export default Home
