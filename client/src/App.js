import React from 'react';
import HomePage from './components/HomePage';
import { SUMMONER_SEARCH_PARAM } from './constants';
import { Container, Typography } from '@material-ui/core';

function App() {
	const currentParams = new URLSearchParams(window.location.search);
	const summonerName = currentParams.get(SUMMONER_SEARCH_PARAM);

	return (
		<Container >
			<Typography variant="h2" component="h1">
				LoL Mastery Chest Viewer
			</Typography>
			<HomePage value={summonerName ?? ''}/>
		</Container>
	);
}

export default App;
