import React from 'react';
import HomePage from './components/HomePage';
import { SUMMONER_SEARCH_PARAM, HIDE_ROTATION_PARAM } from './constants';
import { Container, Typography, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	logo: {
		position: 'relative',
		top: '10px',
		height: '64px',
		width: '64px',
		paddingRight: '16px',
	},
	header: {
		marginTop: '32px',
		marginBottom: '32px',
		display: 'flex',
		alignItems: 'center',
	},
	wrapper: {
		marginLeft: '40px',
		display: 'inline-block',
	},
	homeLink: {
		textDecoration: 'none',
		color: theme.palette.text.primary,
	},
}));

function App() {
	const classes = useStyles();
	const currentParams = new URLSearchParams(window.location.search);
	const summonerName = currentParams.get(SUMMONER_SEARCH_PARAM);
	const shouldHideRotation = currentParams.get(HIDE_ROTATION_PARAM);

	return (
		<Container>
			<Box className={classes.header}>
				<Box className={classes.wrapper}>
					<a href={window.location.origin} className={classes.homeLink}>
						<img alt="LoL Mastery Chest Viewer" className={classes.logo} src="https://raw.githubusercontent.com/radlinskii/lol-mastery-chest-viewer/master/docs/images/logo.png" />
						<Typography variant="h2" component="h1" display="inline" className={classes.title}>
							LoL Mastery Chest Viewer
						</Typography>
					</a>
				</Box>
			</Box>
			<HomePage value={summonerName ?? ''} shouldHideRotation={shouldHideRotation === 'true'} />
		</Container>
	);
}

export default App;
