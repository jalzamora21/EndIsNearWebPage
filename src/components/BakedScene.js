import { Canvas, useFrame, extend, useThree } from '@react-three/fiber';
import { Raycaster, Vector2, MeshBasicMaterial, sRGBEncoding } from 'three';
import { Suspense, useEffect, useRef, useState } from 'react';
import {
  OrbitControls,
  PerspectiveCamera,
  useAnimations,
  useFBX,
  useGLTF,
  useMatcapTexture,
  useTexture
} from '@react-three/drei';
import { Physics, usePlane, useSphere } from '@react-three/cannon';
import pingSound from '../resources/ping.mp3';
import { useControls } from 'leva';
import { Bloom, DepthOfField, EffectComposer, Noise, Vignette } from '@react-three/postprocessing';

const ping = new Audio(pingSound);

const BouncyBall = (props) => {
  const [matcap, url] = useMatcapTexture(
    273, // index of the matcap texture https://github.com/emmelleppi/matcaps/blob/master/matcap-list.json
    512, // size of the texture ( 64, 128, 256, 512, 1024 )
  );

  const { bounceFactor } = useControls('BouncyBall', {
    bounceFactor: { value: 0.8, min: 0, max: 2 },
  });

  // useRef to solve stale state problem
  const bounceFactorRef = useRef(bounceFactor);
  bounceFactorRef.current = bounceFactor;

  const onCollide = (e) => {
    const impactVelocity = e.contact.impactVelocity;
    ping.currentTime = 0;
    ping.play();

    const impulse = [0, impactVelocity * bounceFactorRef.current, 0];
    const worldPoint = [0, 0, 0];
    sphereApi.applyImpulse(impulse, worldPoint);
  };
  const [ref, sphereApi] = useSphere(() => ({ onCollide, ...props }));
  return (
    <mesh
      ref={ref}
      onClick={() => {
        const impulse = [0, 10, 0];
        const worldPoint = [0, 0, 0];
        sphereApi.applyImpulse(impulse, worldPoint);
      }}
    >
      <sphereGeometry />
      <meshMatcapMaterial matcap={matcap} />
    </mesh>
  );
};

const PhysicsPlane = (props) => {
  const [ref] = usePlane(() => ({ ...props }));
};

const BakedSceneGeometry = (props) => {
  // const texture = useTexture('/static/bakedScene/baked.jpg', (texture) => {
  //   texture.flipY = false;
  //   texture.encoding = sRGBEncoding;
  // });
  const fbx = useFBX(`${process.env.URL_PREFIX ?? ''}/static/zombie.fbx`);
  const { ref: meshRef, mixer, names, actions, clips } = useAnimations(fbx.animations)

  useEffect(() => {
    // actions?.['mixamo.com']?.play()
    actions?.['Armature|Armature|mixamo.com|Layer0']?.play()
  })

  // useEffect(() => {
  //   scene.traverse((child) => {
  //     const bakedMaterial = new MeshBasicMaterial({ map: texture });
  //     const portalMaterial = new MeshBasicMaterial({ color: 0xffffff });
  //
  //     child.material = bakedMaterial;
  //
  //     const portalLightMesh = scene.children.find((child) => child.name === 'Emission');
  //     portalLightMesh.material = portalMaterial;
  //   });
  // }, [scene]);

  // This reference will give us direct access to the mesh
  const mesh = useRef();

  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => {});

  // Return view, these are regular three.js elements expressed in JSX
  return (
    <primitive {...props} ref={meshRef} object={fbx}>
      {/*<meshStandardMaterial wireframe={true} map={texture} />*/}
    </primitive>
  );
};

const BakedScene = (props) => {
  const {
    dofEnabled,
    dofFocusDistance,
    dofFocalLength,
    dofBokehScale,
    bloomEnabled,
    noiseEnabled,
    noiseOpacity,
    vignetteEnabled,
  } = useControls('BakedScene', {
    dofEnabled: { value: false },
    dofFocusDistance: { value: 0, min: 0, max: 10 },
    dofFocalLength: { value: 0.02, min: 0, max: 1 },
    dofBokehScale: { value: 2, min: 0, max: 10 },
    bloomEnabled: { value: false },
    noiseEnabled: { value: true },
    noiseOpacity: { value: 0.02, min: 0, max: 1 },
    vignetteEnabled: { value: true },
  });

  return (
    <Canvas>
      <Physics>
        {/*<OrbitControls />*/}
        <PerspectiveCamera makeDefault position={[0, 45, 200]} />
        <ambientLight />
        <Suspense fallback={null}>
          {/*<BouncyBall mass={1} position={[0, 2, 0]}></BouncyBall>*/}
          {/*<PhysicsPlane rotation={[-Math.PI / 2, 0, 0]}></PhysicsPlane>*/}
          <BakedSceneGeometry></BakedSceneGeometry>
        </Suspense>
      </Physics>
      <EffectComposer>
        {dofEnabled && (
          <DepthOfField focusDistance={dofFocusDistance} focalLength={dofFocalLength} bokehScale={dofBokehScale} height={480} />
        )}
        {bloomEnabled && <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />}
        {noiseEnabled && <Noise opacity={noiseOpacity} />}
        {vignetteEnabled && <Vignette eskil={false} offset={0.1} darkness={1.1} />}
      </EffectComposer>
    </Canvas>
  );
};

export default BakedScene;
