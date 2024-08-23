import { useState, useRef, Suspense, useEffect } from "react";

import { Canvas, useFrame, useThree } from "@react-three/fiber";


import {
  Environment,
  OrbitControls, FlyControls,
  Html,
  useGLTF,
  useAnimations,
} from "@react-three/drei";
import * as THREE from "three";

import ComputerScreenHTML from "./htmloverlay/computerscreen";
import Skyscrapers from "./skyscraper";

const ModelWithAnimation = ({ url, secondaryModelUrl,  HTMLPosition, HTMLRotation, ...props }) => {
  const { scene, animations, nodes } = useGLTF(url);
  const secondaryScene  = useGLTF(secondaryModelUrl);
  const { actions } = useAnimations(animations, scene);
  const monitorRef = useRef(null);
  

  console.log(nodes);
  console.log(secondaryScene)


  // const defaultScreenRotation = new THREE.Euler(-0.3, 0.47, 0.145);
  // const defaultScreenPosition = new THREE.Vector3(0.025, 0.41, 2.16);
  
  const [screenPosition, setScreenPosition] = useState(new THREE.Vector3(-0.09495129436254501,0.930014729499817,4.181510925292969
  ));

 

  useEffect(() => {
    if (actions) {
      actions[Object.keys(actions)[0]].play(); // Play the first animation
    }
  }, [actions]);

  return (
    <>
    <group>
      <primitive object={scene} {...props} />
      <primitive  object={nodes.Cube009_55} {...props} ref={monitorRef} position = {screenPosition}  >
      <ComputerScreenHTML  HTMLRotation={HTMLRotation} HTMLPosition={HTMLPosition} 
          
        />
        </primitive>

        <primitive  object={nodes.Cube002_33} {...props}  position = {[ -0.022806406021118164, 2.8019936084747314,6.124861717224121]}  >  
        <directionalLight position={[0, -20, 0 ]} intensity={0.5} />
        </primitive>


      <mesh position={[-3.92, 1.2, 3.9]}>
        <boxGeometry args={[1.55, 2.075, 0.1]} />
        <meshBasicMaterial color="black" />
      </mesh>
      <mesh position={[3.92, 1.2, 3.9]}>
        <boxGeometry args={[1.55, 2.075, 0.1]} />
        <meshBasicMaterial color={new THREE.Color("rgb(0, 0, 0)")} />
      </mesh>
      
      
    </group>
    
    
    {/* <primitive  object={secondaryScene.nodes.Building_0} {...props} ref={buildingRef}   ></primitive> */}
    </>
  );
};

const Sky = () => {
  const radius = 100; // Size of the sky sphere

  return (
    <mesh>
      <sphereGeometry args={[radius, 32, 32]} />
      <meshBasicMaterial color="#7c9df7" side={THREE.BackSide} />
    </mesh>
  );
};




const CameraShift = ({ targetPosition, targetRotation }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationStartTime, setAnimationStartTime] = useState(0);

  useFrame(({ camera }) => {
    if (isAnimating && targetPosition && targetRotation) {
      const elapsedTime = Date.now() - animationStartTime;
      const duration = 2000; // Duration of the animation in milliseconds
      const t = Math.min(elapsedTime / duration, 0.1);

      camera.position.lerpVectors(camera.position.clone(), targetPosition, t);
      camera.rotation.x = THREE.MathUtils.lerp(
        camera.rotation.x,
        targetRotation.x,
        t
      );
      camera.rotation.y = THREE.MathUtils.lerp(
        camera.rotation.y,
        targetRotation.y,
        t
      );
      camera.rotation.z = THREE.MathUtils.lerp(
        camera.rotation.z,
        targetRotation.z,
        t
      );

      if (t === 1) {
        setIsAnimating(false);
        camera.position.copy(targetPosition);
        camera.rotation.copy(targetRotation);
      }
    }
  });

  const { camera } = useThree();

  useEffect(() => {
    if (targetPosition && targetRotation) {
      setAnimationStartTime(Date.now());
      setIsAnimating(true);
    }
  }, [targetPosition, targetRotation]);

  return null;
};

function App() {
  const [targetPosition, setTargetPosition] = useState(null);
  const [targetRotation, setTargetRotation] = useState(null);
  const [HTMLRotation, setHTMLRotation] = useState([0,0,0]);
  const [HTMLPosition, setHTMLPosition] =useState([-.008,-.124,.025])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowUp") {
        handleButtonClick();
      } else if (event.key === "ArrowDown") {
        handleBackClick();
      } else if (event.key === "ArrowLeft") {
        handleProjectClick();
      } else if (event.key === "ArrowRight") {
        handleContactClick();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleButtonClick = () => {
    setTargetPosition(new THREE.Vector3(0.15, 1.10, 4.75)); // Define the target position for the camera shift
    setTargetRotation(new THREE.Euler(-0.4, 0.6, 0.225));
    //setHTMLRotation(new THREE.Euler(-0.30255377056249727,  0.48176162984942383,  0.14362979953155677))
    // setScreenPosition(new THREE.Vector3(0.2445, 0.8985, 4.25))
  };

  const handleBackClick = () => {
    setTargetRotation(new THREE.Euler(-0.16514867741462677, 0, 0));
    setTargetPosition(new THREE.Vector3(0, 1.5, 9));
    setHTMLPosition(new THREE.Vector3(-.008,-.124,.025))

    
    
  };

  const handleProjectClick = () => {
    setTargetPosition(new THREE.Vector3(-3.95, 1.5, 6.05));
    setTargetRotation(new THREE.Euler(0,0,0))
  };

  const handleContactClick = () => {
    setTargetPosition(new THREE.Vector3(3.95, 1.5, 6.05));
     setTargetRotation(new THREE.Euler(0,0,0));
    //  setHTMLPosition(new THREE.Vector3(0,0,0))
   };

  return (


    <>
    <div className="App flex justify-center items-center relative">
      <div className="flex justify-around w-1/3 absolute bottom-2">
        <button
          className="bg-black/60 rounded-lg p-4 text-white   "
          onClick={handleProjectClick}
          style={{ zIndex: 1 }}
        >
          Projects
        </button>
        <button
          className="bg-black/60 rounded-lg p-4 text-white    "
          onClick={handleButtonClick}
          style={{ zIndex: 1 }}
        >
          About Me
        </button>
        <button
          className="bg-black/60 rounded-lg p-4 text-white   "
          onClick={handleContactClick}
          style={{ zIndex: 1 }}
        >
          Contact Me
        </button>
        <button
          className="bg-black/60 rounded-lg p-4 text-white   "
          onClick={handleBackClick}
          style={{ zIndex: 1 }}
        >
          Back
        </button>
      </div>
      <Canvas
        camera={{
          position: new THREE.Vector3(0, 1.5, 9), // default z 9
        }}
      >
        <Suspense fallback={null}>
          <ModelWithAnimation url="/scene.gltf" secondaryModelUrl= "/buildings.gltf" position={[0, -1, 0]} HTMLPosition={HTMLPosition} HTMLRotation={HTMLRotation} />
          <Skyscrapers secondaryModelUrl= "/buildings.gltf"/>
          <Sky />
          <OrbitControls
            enableRotate={true}
            enablePan={true}
            enableZoom={true}
          />
          {/* <FlyControls movementSpeed={5} rollSpeed={0.5} /> */}
          <Environment preset="sunset" />
          <CameraShift
            targetPosition={targetPosition}
            targetRotation={targetRotation}
          />
        </Suspense>
      </Canvas>
    </div>
    </>
  );
}

export default App;
