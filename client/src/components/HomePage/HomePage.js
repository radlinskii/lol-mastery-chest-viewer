import React, { useCallback, useEffect, useState, useMemo } from 'react';
import useSummoner from '../../hooks/useSummoner';
import { D_DRAGON_CDN_URL, SUMMONER_SEARCH_PARAM } from '../../constants';
import ChampionList from '../ChampionList';
import {
    TextField,
    Button,
    Box,
    Avatar,
    Card,
    Divider,
    Typography,
    FormControlLabel,
    Checkbox,
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
        padding: '30px 40px',
        margin: '20px 0',
    },
    avatar: {
        marginLeft: '10px',
    },
    championSearch: {
        marginRight: '40px',
    },
    toolbar: {
        marginBottom: '16px',
        display: 'flex',
        justifyContent: 'space-between'
    },
});

function HomePage({ value: initialValue, shouldHideRotation }) {
    const classes = useStyles();
    const [value, setValue] = useState(initialValue);
    const [championQuery, setChampionQuery] = useState('');
    const [wasInitialFetchCalled, setInitialFetchCalled] = useState(false);
    const [shouldHideChampionsFromRotation, setShouldHideChampionsFromRotation] = useState(shouldHideRotation);
    const { fetchSummoner, summoner, error, loading } = useSummoner(value);

    useEffect(function initialFetchEffect() {
        if (!wasInitialFetchCalled && !!initialValue && value === initialValue) {
            fetchSummoner();
            setInitialFetchCalled(true);
        }
    }, [wasInitialFetchCalled, value, fetchSummoner, initialValue]);

    const isSummonerNameEmpty = useMemo(() => value.trim().length === 0, [value]);

    const handleSubmitButtonClick = useCallback(() => {
        if (isSummonerNameEmpty) {
            return;
        }

        fetchSummoner();

        const search = new URLSearchParams(window.location.search);
        search.set(SUMMONER_SEARCH_PARAM, value);
        window.location.search = search.toString();
    }, [fetchSummoner, value, isSummonerNameEmpty]);

    const handleEnterPress = (event) => {
        if (event.key === 'Enter') {
            handleSubmitButtonClick();
        }
    };

    const handleChampionRotationCheckboxChange = (event) => {
        setShouldHideChampionsFromRotation(event.target.checked);
    };

    const handleSummonerNameInputChange = (event) => {
        setValue(event.target.value);
    };

    const filterOutChampionsFromFreeRotation = (list) => shouldHideChampionsFromRotation ? list.filter(({ championId }) => summoner.freeChampionIds.indexOf(championId) === -1) : list

    const filterInChampionNameQuery = (list) => championQuery ? list.filter(({ name }) => name.toLowerCase()
        .indexOf(championQuery.toLowerCase()) > -1) : list;

    return (
        <Card className={classes.container} raised>
            <Box pt={2} pb={2} mb={2}>
                <TextField
                    type="text"
                    onChange={handleSummonerNameInputChange}
                    placeholder="Summoner's name"
                    required
                    value={value}
                    disabled={loading}
                    onKeyDown={handleEnterPress}
                />
                <Button
                    className={classes.button}
                    variant="contained"
                    color="primary"
                    onClick={handleSubmitButtonClick}
                    disabled={loading || isSummonerNameEmpty}>
                    Submit
                </Button>
            </Box>
            {summoner === undefined && !loading && error?.message !== undefined && (
                <>
                    <Divider />
                    <Box className={classes.header}>
                        <Typography variant="h3" component="h2" color="error">
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
                    <Box className={classes.header}>
                        <Typography variant="h3" component="h2">
                            Hi {summoner.name}!
                        </Typography>
                        <Avatar
                            className={classes.avatar}
                            alt={`${summoner.name} avatar`}
                            src={`${D_DRAGON_CDN_URL}/${summoner.patchVersion}/img/profileicon/${summoner.profileIconId}.png`}
                        />
                    </Box>
                    <Box className={classes.toolbar}>
                        <TextField
                            className={classes.championSearch}
                            type="search"
                            onChange={e => setChampionQuery(e.target.value)}
                            placeholder="Find champion"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={shouldHideChampionsFromRotation} onChange={handleChampionRotationCheckboxChange} name="checked" />}
                            label="Hide champions from current free rotation"
                        />
                    </Box>
                    <ChampionList champions={filterInChampionNameQuery(filterOutChampionsFromFreeRotation(summoner.champions))} patchVersion={summoner.patchVersion} />
                </>
            )}
        </Card>
    );
}

export default HomePage;
