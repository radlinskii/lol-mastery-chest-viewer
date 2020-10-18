import React, { useEffect, useState } from 'react';
import useSummoner from '../../hooks/useSummoner'
import { D_DRAGON_URL, SUMMONER_SEARCH_PARAM } from '../../constants';
import ChampionList from '../ChampionList';
import {
	TextField,
	Button,
	Box,
	Avatar,
	Card,
	Divider,
	Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
	button: {
		marginLeft: '20px',
	},
	header: {
		display: 'flex',
		alignItems: 'center',
		margin: '20px 0',
	},
	container: {
		padding: '20px',
		margin: '20px 0',
	},
	avatar: {
		marginLeft: '10px',
	},
});

function HomePage({ value: initialValue }) {
	const classes = useStyles();
	const [value, setValue] = useState(initialValue);
	const [championQuery, setChampionQuery] = useState('');
    const {fetchSummoner, summoner, error, loading} = useSummoner(value);

    useEffect(() => {
    	if (!!initialValue && value === initialValue) {
			fetchSummoner();
		}
	}, [value, fetchSummoner, initialValue])

    const handleInputChange = (event) => {
        setValue(event.target.value);
    };

    const handleClick = () => {
		fetchSummoner();

		const search = new URLSearchParams(window.location.search);
		search.set(SUMMONER_SEARCH_PARAM, value);
		window.location.search = search.toString();
	}

	const handleEnterPress = (event) => {
		if (event.key === "Enter") {
			handleClick();
		}
	}

	const filterChampions = (list) => championQuery 
		? list.filter(({name}) => name.toLowerCase().indexOf(championQuery.toLowerCase()) > -1) 
		: list

    return (
		<Card className={classes.container} raised >
			<Box p={2} mb={2} >
				<TextField
					type="text"
					onChange={handleInputChange}
					placeholder="Summoner's name"
					value={value}
					disabled={loading}
					onKeyDown={handleEnterPress}
				/>
				<Button
					className={classes.button}
					variant="contained"
					color="primary"
					onClick={handleClick}
					disabled={loading}>
					Submit
				</Button>
			</Box>
			{summoner === undefined && !loading && error?.message !== undefined && (
				<>
					<Divider />
					<Box className={classes.header}>
						<Typography variant="h3" component="h2" color="error" >
							{error.message}
						</Typography>
					</Box>
					<Divider />
				</>
			)}
			{summoner === undefined && loading && error?.message === undefined && (
				<>
					<Divider />
					<Box className={classes.header}>
						<Typography variant="h3" component="h2">
							Loading...
						</Typography>
					</Box>
					<Divider />
				</>
				)}
			{summoner !== undefined && !loading && error?.message === undefined && (
				<>
					<Divider />
					<Box display="flex" justifyContent="space-between" alignItems="center">
						<Box className={classes.header}>
							<Typography variant="h3" component="h2">
								Hi {summoner.name}!
							</Typography>
							<Avatar
								className={classes.avatar}
								alt={`${summoner.name} avatar`}
								src={`${D_DRAGON_URL}/img/profileicon/${summoner.profileIconId}.png`}
							/>
						</Box>
						<TextField 
								type="text"
								onChange={e => setChampionQuery(e.target.value)}
								placeholder="Find champion"/>
					</Box>
					<ChampionList champions={filterChampions(summoner.champions)} />
				</>
			)}
		</Card>
	);
}

export default HomePage;
