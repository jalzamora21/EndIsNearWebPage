import { Canvas, useFrame, extend, useThree } from '@react-three/fiber';
import { useControls } from 'leva';
import { Color, Raycaster, Vector2 } from 'three';
import { inverseLerp, moveTowards } from '../utils/math';
import { useRef, useState } from 'react';
import { shaderMaterial } from '@react-three/drei';

const ColorShiftMaterial = shaderMaterial(
  { color: new Color(0xfff), u_mouse: new Vector2(0, 0) },
  /*glsl*/`
    uniform vec2 u_mouse;
    varying vec2 vUv;
    varying float mouseDistance;
    
    void main() {
      vUv = uv;
      mouseDistance = abs(distance(vUv, u_mouse))*1.0;
      vec4 newPosition = vec4(position, 1.0);
      gl_Position = projectionMatrix * modelViewMatrix * mix(newPosition, vec4(0, 0, 0, 1.0), 0.2-mouseDistance);
    }
  `,
  // fragment shader
  /*glsl*/`
    uniform float time;
    uniform vec3 color;
    uniform vec2 u_mouse;
    varying vec2 vUv;
    varying float mouseDistance;
    
    void main() {
      // gl_FragColor.rgba = vec4(mouseDistance, mouseDistance, mouseDistance, 1.0);
      // gl_FragColor.rgba = mouseDistance < 50.0 ? vec4(color, 1.0) : vec4(color2, 1.0);
      vec4 colorShiftedColor = vec4(u_mouse, 128.0, 1.0);
      gl_FragColor.rgba = mix(vec4(color, 1.0), colorShiftedColor, mouseDistance*4.0);
    }
  `
);

extend({ ColorShiftMaterial });

const PlaneWarp = (props) => {
  const { baseColor } = useControls('WarpGeometry', {
    baseColor: '#000',
  });
    // This reference will give us direct access to the mesh
  const mesh = useRef();
  // Set up state for the hovered and active state
  const [uvPosition, setUvPosition] = useState(new Vector2(0, 0));

  const [active, setActive] = useState(false);

  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => {
  });

  const { camera, scene } = useThree();

  const raycaster = new Raycaster();
  const pointer = new Vector2();

  // Return view, these are regular three.js elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? 1.1 : 1}
      onClick={() => {
        // mesh.current.userData.currentSpeed = speedOnClick;
        // setActive(!active);
      }}
      // onPointerDown={() => setActive(true)}
      // onPointerUp={() => setActive(false)}
      // onPointerOver={(event) => {
      //   setHover(true);
      // }}
      // onPointerOut={() => setHover(false)}
      onPointerMove={(event) => {
        pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        raycaster.setFromCamera( pointer, camera );
        const intersects = raycaster.intersectObjects( scene.children );
        const uvPos = intersects[0]?.uv;
        setUvPosition(new Vector2(uvPos.x, uvPos.y));
      }}
    >
      <planeGeometry args={[20, 10, 20, 10]} />
      {/*<meshStandardMaterial wireframe={true} />*/}
      <colorShiftMaterial wireframe={true} u_mouse={uvPosition} color={baseColor} />
    </mesh>
  );
};

const MouseWarpGeometry = (props) => {
  return (
    <Canvas>
      <ambientLight />
      <PlaneWarp></PlaneWarp>
    </Canvas>
  );
};

export default MouseWarpGeometry;
