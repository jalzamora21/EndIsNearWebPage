import {Box, Button, Typography} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import ClickMeGeometry from '../components/ClickMeGeometry';
import './mainPage.css';
import ScrollNavigation from '../components/ScrollNavigation/ScrollNavigation';
import MouseWarpGeometry from '../components/MouseWarpGeometry';
import BakedScene from '../components/BakedScene';
import {useEffect, useState} from "react";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import DownloadIcon from '@mui/icons-material/Download';

const ClickMeSection = ({id}) => {
    return (<Grid id={id} container height="100vh" justifyContent="center">
        <Grid xs={12} md={6} height="100%">
            <BakedScene></BakedScene>
        </Grid>
        <Grid xs={12} md={6} sx={{p: 8, mt: 'auto', mb: 'auto'}}>
            <Typography variant="h2">{'Play now!'}</Typography>
            <Typography align="justify" sx={{
                mt: 3
            }}>
                Available now on the Meta Quest store for Quest 2 devices.
            </Typography>
            <Typography align="justify" sx={{
                mb: 3
            }}>
                Also available on Steam for the PCVR platform.
            </Typography>
            <Box sx={{
                display: 'flex',
                gap: '20px',
                my: 2
            }}>
                <a href="#"><img src={`static/OculusBadge.png`}/></a>
                <a href="#"><img src={`static/Steam_badge_website.png`}/></a>
            </Box>
        </Grid>
    </Grid>);
};

const BakedSceneSection = ({id}) => {
    return (<Box id={id} sx={{
        height: '100vh',
    }}>
        <Box sx={{
            width: '50%', height: '100%',
        }}>
            <BakedScene/>
        </Box>
    </Box>);
};

const WelcomeSection = ({id}) => {
    return (<Grid id={id}
                  container
                  height="100vh"
                  justifyContent="center"
                  sx={{
                      overflow: 'hidden'
                  }}>
        {/*<video style={{*/}
        {/*    width: '100%',*/}
        {/*    height: '100%',*/}
        {/*    objectFit: 'cover'*/}
        {/*}} src="/static/3e78e80.mp4"*/}
        {/*       autoPlay loop muted></video>*/}
        <img src={`static/banner.png`} alt="Page banner" style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
        }}/>
        {/*<Box sx={{*/}
        {/*    display: 'flex',*/}
        {/*    justifyContent: 'center',*/}
        {/*    alignItems: 'center',*/}
        {/*    width: '100%',*/}
        {/*    height: '100%',*/}
        {/*    position: 'absolute',*/}
        {/*    top: 0,*/}
        {/*    left: 0,*/}
        {/*}}>*/}
        {/*    /!*<img src="/static/Logo.png" style={{*!/*/}
        {/*    /!*    height: '200px',*!/*/}
        {/*    /!*    zIndex: 100*!/*/}
        {/*    /!*}}/>*!/*/}
        {/*    */}
        {/*</Box>*/}
    </Grid>);
};

const MainPage = () => {
    const [contentConfig, setContentConfig] = useState();

    useEffect(() => {
        fetch(`${process.env.URL_PREFIX ?? ""}/content.json`)
            .then((data) => data.json())
            .then((json) => setContentConfig(json));
    }, []);

    if (contentConfig == null) return;
    //

    return (<>
        <AppBar position="fixed">
            <Toolbar disableGutters>
                <Box sx={{
                    width: '100%',
                    p: 2,
                    display: 'flex',
                    justifyContent: 'space-between'
                }}>
                    <img src={`static/Logo.png`} style={{
                        height: '70px',
                    }}/>
                    <Button onClick={() => document.getElementById('clickMe').scrollIntoView({behavior: 'smooth'})}
                            variant='contained'
                            sx={{
                                fontSize: '20px',
                                backgroundColor: '#fcba00'
                            }}
                    >DOWNLOAD NOW</Button>
                </Box>
            </Toolbar>
        </AppBar>
        <Box className="scrollSnapContainer">
            {contentConfig.map((item) => {
                switch (item.component) {
                    case 'WelcomeSection':
                        return <WelcomeSection id={item.id}/>;
                    case 'ClickMeSection':
                        return <ClickMeSection id={item.id}/>;
                    case 'BakedSceneSection':
                        return <BakedSceneSection id={item.id}/>;
                }
            })}
        </Box>
        <ScrollNavigation
            // activeIndex={snapIndex}
            config={contentConfig}
        />
    </>);
};

export default MainPage;
