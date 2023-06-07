import { Box, Step, StepButton, StepLabel, Stepper } from '@mui/material';
import './styles.css';
import { useScrollPosition } from 'react-use-scroll-position/index';

const ScrollNavigation = ({ config, activeIndex }) => {

  const { x, y } = useScrollPosition();
  console.log(x, y);

  if(config == null)
    return;
  return (
    <Box className="scrollNavigator" sx={{ mr: 8 }}>
      <Stepper activeStep={-1} nonLinear orientation="vertical">
        {config.map((step, index) => (
          <Step key={step.id}>
            <StepButton
              onClick={() =>
                document.getElementById(step.id).scrollIntoView({ behavior: 'smooth' })
              }
              color="inherit"
            >
              <StepLabel>{step.label}</StepLabel>
            </StepButton>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}

export default ScrollNavigation;