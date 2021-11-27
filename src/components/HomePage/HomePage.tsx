import { useCallback, useEffect, useState, useMemo, ChangeEvent, KeyboardEvent } from 'react'
import { useRouter } from 'next/router'
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
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import useSummoner from '../../hooks/useSummoner'
import { D_DRAGON_CDN_URL, HIDE_ROTATION_PARAM, SUMMONER_SEARCH_PARAM } from '../../constants'
import ChampionList from '../ChampionList'
import { Champion } from '../../types'

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
        justifyContent: 'space-between',
    },
})

function getSingleQueryParam(value: string | string[] | undefined) {
    const valueStr = Array.isArray(value) ? value[0] : value

    return valueStr
}

function HomePage() {
    const classes = useStyles()
    const router = useRouter()
    const initialSummonerName = getSingleQueryParam(router.query[SUMMONER_SEARCH_PARAM]) ?? ''
    const initialShouldHideRotation = getSingleQueryParam(router.query[HIDE_ROTATION_PARAM])

    const [value, setValue] = useState<string>(initialSummonerName)
    const [championQuery, setChampionQuery] = useState<string>('')
    const [wasInitialFetchCalled, setInitialFetchCalled] = useState<boolean>(false)
    const [shouldHideChampionsFromRotation, setShouldHideChampionsFromRotation] = useState<boolean>(
        initialShouldHideRotation === 'true'
    )
    const { fetchSummoner, summoner, error, loading } = useSummoner(value)

    useEffect(
        function initialFetchEffect() {
            if (!wasInitialFetchCalled && !!initialSummonerName && value === initialSummonerName) {
                fetchSummoner()
                setInitialFetchCalled(true)
            }
        },
        [wasInitialFetchCalled, value, fetchSummoner, initialSummonerName]
    )

    const isSummonerNameEmpty = useMemo(() => value.trim().length === 0, [value])

    const handleSubmitButtonClick = useCallback(() => {
        if (isSummonerNameEmpty) {
            return
        }

        fetchSummoner()

        const searchParams = new URLSearchParams({
            [SUMMONER_SEARCH_PARAM]: getSingleQueryParam(router.query[SUMMONER_SEARCH_PARAM]) ?? '', // TODO: test replacing it with initial values
            [HIDE_ROTATION_PARAM]: getSingleQueryParam(router.query[HIDE_ROTATION_PARAM]) ?? '',
        })
        searchParams.set(SUMMONER_SEARCH_PARAM, value)
        router.push(router.pathname + '?' + searchParams.toString())
    }, [fetchSummoner, value, isSummonerNameEmpty, router])

    const handleEnterPress = (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
            handleSubmitButtonClick()
        }
    }

    const handleChampionRotationCheckboxChange = (_: unknown, checked: boolean) => {
        setShouldHideChampionsFromRotation(checked)
    }

    const handleSummonerNameInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value)
    }

    const filterOutChampionsFromFreeRotation = (list: Champion[]) =>
        shouldHideChampionsFromRotation
            ? list.filter(({ championId }) => summoner?.freeChampionIds?.indexOf(championId) === -1)
            : list

    const filterInChampionNameQuery = (list: Champion[]) =>
        championQuery ? list.filter(({ name }) => name.toLowerCase().indexOf(championQuery.toLowerCase()) > -1) : list

    return (
        <Card className={classes.container} raised>
            <Box mb={2} pb={2} pt={2}>
                <TextField
                    disabled={loading}
                    onChange={handleSummonerNameInputChange}
                    onKeyDown={handleEnterPress}
                    placeholder="Summoner's name"
                    required
                    type="text"
                    value={value}
                />
                <Button
                    className={classes.button}
                    color="primary"
                    disabled={loading || isSummonerNameEmpty}
                    onClick={handleSubmitButtonClick}
                    variant="contained"
                >
                    Submit
                </Button>
            </Box>
            {summoner === null && !loading && error?.message !== undefined && (
                <>
                    <Divider />
                    <Box className={classes.header}>
                        <Typography color="error" component="h2" variant="h3">
                            {error.message}
                        </Typography>
                    </Box>
                    <Divider />
                </>
            )}
            {summoner === null && loading && error?.message === undefined && (
                <>
                    <Divider />
                    <Box className={classes.header}>
                        <Typography component="h2" variant="h3">
                            Loading...
                        </Typography>
                    </Box>
                    <Divider />
                </>
            )}
            {summoner !== null && !loading && error?.message === undefined && (
                <>
                    <Divider />
                    <Box className={classes.header}>
                        <Typography component="h2" variant="h3">
                            Hi {summoner.name}!
                        </Typography>
                        <Avatar
                            alt={`${summoner.name} avatar`}
                            className={classes.avatar}
                            src={`${D_DRAGON_CDN_URL}/${summoner.patchVersion}/img/profileicon/${summoner.profileIconId}.png`}
                        />
                    </Box>
                    <Box className={classes.toolbar}>
                        <TextField
                            className={classes.championSearch}
                            onChange={(e) => setChampionQuery(e.target.value)}
                            placeholder="Find champion"
                            type="search"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={shouldHideChampionsFromRotation}
                                    name="checked"
                                    onChange={handleChampionRotationCheckboxChange}
                                />
                            }
                            label="Hide champions from current free rotation"
                        />
                    </Box>
                    <ChampionList
                        champions={filterInChampionNameQuery(filterOutChampionsFromFreeRotation(summoner.champions))}
                        patchVersion={summoner.patchVersion}
                    />
                </>
            )}
        </Card>
    )
}

export default HomePage
