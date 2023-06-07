import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { inverseLerp, moveTowards } from '../utils/math';
import { Color } from 'three';
import { useControls } from 'leva';

const Box = (props) => {

  const levaProperties = useControls('ClickMeGeometry', {
    speedOnClick: { value: 30, min: 1, max: 100 },
    colorShiftSpeed: { value: 5, min: 1, max: 15 },
    speedStep: { value: 3, min: 1, max: 6 },
    hoverColor: '#0077ff',
    defaultColor: '#fff',
    highSpeedColor: '#ff7f00',
    highSpeedThreshold: { value: 0.7, min: 0.1, max: 100 },
  });

  levaProperties.hoverColor = new Color(levaProperties.hoverColor);
  levaProperties.defaultColor = new Color(levaProperties.defaultColor);
  levaProperties.highSpeedColor = new Color(levaProperties.highSpeedColor);

  const { speedOnClick, colorShiftSpeed, speedStep, hoverColor, defaultColor, highSpeedColor, highSpeedThreshold } = levaProperties;

  const getTargetColor = (currentSpeed, hovered) => {
    if (currentSpeed > highSpeedThreshold) {
      inverseLerp(highSpeedThreshold, speedOnClick, currentSpeed);

      return highSpeedColor
        .clone()
        .lerp(defaultColor, inverseLerp(speedOnClick, highSpeedThreshold, currentSpeed));
    } else if (hovered) return hoverColor;
    else return defaultColor;
  };

  // This reference will give us direct access to the mesh
  const mesh = useRef();
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => {
    const targetSpeed = hovered ? 0.05 : 0.5;

    const userData = mesh.current.userData;
    userData.currentSpeed ??= targetSpeed;
    userData.currentColor ??= defaultColor;
    // userData.currentSpeed = clamp(userData.currentSpeed, 0, 0.5);

    const targetColor = getTargetColor(userData.currentSpeed, hovered);

    if (userData.currentSpeed > highSpeedThreshold) userData.currentColor = highSpeedColor;

    userData.currentSpeed = moveTowards(
      userData.currentSpeed,
      targetSpeed,
      userData.currentSpeed * delta * speedStep,
    );
    userData.currentColor.lerp(targetColor, Math.min(delta * colorShiftSpeed, 1));

    mesh.current.rotation.x += delta * userData.currentSpeed;
    mesh.current.rotation.y += delta * userData.currentSpeed;
    mesh.current.material.color = userData.currentColor;
  });
  // Return view, these are regular three.js elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? 1.1 : 1}
      onClick={() => {
        mesh.current.userData.currentSpeed = speedOnClick;
        // setActive(!active);
      }}
      onPointerDown={() => setActive(true)}
      onPointerUp={() => setActive(false)}
      onPointerOver={(event) => {
        setHover(true);
      }}
      onPointerOut={() => setHover(false)}
    >
      <dodecahedronGeometry args={[2]} />
      <meshStandardMaterial wireframe={true} />
    </mesh>
  );
};

const ClickMeGeometry = () => {
  return (
    <Canvas>
      <ambientLight />
      <Box></Box>
    </Canvas>
  );
};

export default ClickMeGeometry;
