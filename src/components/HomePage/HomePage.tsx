import { useCallback, useEffect, useState, useMemo, ChangeEvent, KeyboardEvent } from 'react'
import { useRouter } from 'next/router'
import { TextField, Button, Box, Avatar, Card, Divider, Typography, FormControlLabel, Checkbox } from '@mui/material'
import useSummoner from '../../hooks/useSummoner'
import { D_DRAGON_CDN_URL, HIDE_ROTATION_PARAM, SUMMONER_SEARCH_PARAM } from '../../constants'
import ChampionList from '../ChampionList'
import { Champion } from '../../types'
import { getSingleQueryParam } from '../../utils'

type HomePageProps = {
    summonerName: string
    shouldHideRotation: boolean
}

function HomePage({ summonerName: initialSummonerName, shouldHideRotation: initialShouldHideRotation }: HomePageProps) {
    const router = useRouter()
    const [value, setValue] = useState<string>(initialSummonerName)
    const [championQuery, setChampionQuery] = useState<string>('')
    const [wasInitialFetchCalled, setInitialFetchCalled] = useState<boolean>(false)
    const [shouldHideChampionsFromRotation, setShouldHideChampionsFromRotation] =
        useState<boolean>(initialShouldHideRotation)
    const { fetchSummoner, summoner, error, loading } = useSummoner(value)

    useEffect(() => {
        setValue(initialSummonerName)
    }, [initialSummonerName])

    useEffect(() => {
        setShouldHideChampionsFromRotation(initialShouldHideRotation)
    }, [initialShouldHideRotation])

    useEffect(() => {
        if (!wasInitialFetchCalled && !!initialSummonerName && value === initialSummonerName) {
            fetchSummoner()
            setInitialFetchCalled(true)
        }
    }, [wasInitialFetchCalled, value, fetchSummoner, initialSummonerName])

    const isSummonerNameEmpty = useMemo(() => value.trim().length === 0, [value])

    const handleSubmitButtonClick = useCallback(() => {
        if (isSummonerNameEmpty) {
            return
        }

        fetchSummoner()

        const searchParams = new URLSearchParams()
        if (value) {
            searchParams.set(SUMMONER_SEARCH_PARAM, value)
        }
        if (shouldHideChampionsFromRotation) {
            searchParams.set(HIDE_ROTATION_PARAM, shouldHideChampionsFromRotation.toString())
        }
        router.push(router.pathname + '?' + searchParams.toString())
    }, [fetchSummoner, value, isSummonerNameEmpty, router, shouldHideChampionsFromRotation])

    const handleEnterPress = (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
            handleSubmitButtonClick()
        }
    }

    const handleChampionRotationCheckboxChange = (_: unknown, checked: boolean) => {
        setShouldHideChampionsFromRotation(checked)

        const searchParams = new URLSearchParams()
        if (initialSummonerName) {
            searchParams.set(SUMMONER_SEARCH_PARAM, initialSummonerName)
        }
        if (checked) {
            searchParams.set(HIDE_ROTATION_PARAM, checked.toString())
        }
        router.push(router.pathname + '?' + searchParams.toString())
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
        <Card raised sx={{ padding: '30px 40px', margin: '20px 0' }}>
            <Box mb={2} pb={2} pt={2} sx={{ display: 'flex', alignItems: 'center' }}>
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
                    color="primary"
                    disabled={loading || isSummonerNameEmpty}
                    onClick={handleSubmitButtonClick}
                    sx={{ marginLeft: '20px' }}
                    variant="contained"
                >
                    Submit
                </Button>
            </Box>
            {summoner === null && !loading && error?.message !== undefined && (
                <>
                    <Divider />
                    <Box sx={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
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
                    <Box sx={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
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
                    <Box sx={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
                        <Typography component="h2" variant="h3">
                            Hi {summoner.name}!
                        </Typography>
                        <Avatar
                            alt={`${summoner.name} avatar`}
                            src={`${D_DRAGON_CDN_URL}/${summoner.patchVersion}/img/profileicon/${summoner.profileIconId}.png`}
                            sx={{ marginLeft: '10px' }}
                        />
                    </Box>
                    <Box sx={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
                        <TextField
                            onChange={(e) => setChampionQuery(e.target.value)}
                            placeholder="Find champion"
                            sx={{ marginRight: '40px' }}
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
