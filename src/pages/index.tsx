import type { NextPage } from 'next'
import Link from 'next/link'
import { Container, Typography, Box } from '@mui/material'
import Image from 'next/image'
import logo from '../../public/logo.png'
import HomePage from '../../src/components/HomePage'
import { useRouter } from 'next/router'
import { getSingleQueryParam } from '../utils'
import { HIDE_ROTATION_PARAM, SUMMONER_SEARCH_PARAM } from '../constants'

const Home: NextPage = () => {
    const router = useRouter()
    const initialSummonerName = getSingleQueryParam(router.query[SUMMONER_SEARCH_PARAM]) ?? ''
    const initialShouldHideRotation = getSingleQueryParam(router.query[HIDE_ROTATION_PARAM])

    return (
        <main>
            <Container>
                <Box sx={{ mt: '32px', mb: '32px' }}>
                    <Box
                        sx={{
                            ml: '40px',
                            a: {
                                textDecoration: 'none',
                                color: 'text.primary',
                            },
                        }}
                    >
                        <Link href="/">
                            <a>
                                <Box
                                    sx={{
                                        position: 'relative',
                                        top: '10px',
                                        height: '64px',
                                        width: '64px',
                                        mr: '10px',
                                        display: 'inline-block',
                                    }}
                                >
                                    <Image alt="LoL Mastery Chest Viewer" layout="fill" src={logo} />
                                </Box>
                                <Typography component="h1" display="inline" variant="h2">
                                    LoL Mastery Chest Viewer
                                </Typography>
                            </a>
                        </Link>
                    </Box>
                </Box>
                <HomePage
                    shouldHideRotation={initialShouldHideRotation === 'true'}
                    summonerName={initialSummonerName}
                />
            </Container>
        </main>
    )
}

export default Home
