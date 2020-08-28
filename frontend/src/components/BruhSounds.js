import React from 'react'
import {makeStyles} from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
	BruhSounds: {
    backgroundColor: 'gray'
  }
}));

const BruhSounds = props => {
const classes = useStyles();

  return (
    <div className={classes.BruhSounds}>
      
    </div>
  )
}

export default BruhSounds
