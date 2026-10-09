
import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, useGLTF } from "@react-three/drei";
import { Box3, Vector3 } from "three";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";
import "./CarExperience.css";

function SmokeTrail() {
  const particles = useRef([]);
  const ages = useRef(
    Array.from({ length: 28 }, (_, i) => (i % 9) * 0.12)
  );

  useFrame((_, delta) => {
    particles.current.forEach((particle, index) => {
      if (!particle) return;

      ages.current[index] += delta;

      particle.position.x -= delta * 0.42;
      particle.position.y += delta * 0.1;
      particle.position.z += Math.sin(ages.current[index] * 2) * delta * 0.06;

      const progress = Math.min(ages.current[index] / 1.6, 1);
      particle.scale.setScalar(0.07 + progress * 0.3);

      if (ages.current[index] > 1.7 || particle.position.x < -5) {
        ages.current[index] = 0;
        particle.position.set(
          -1.2 - Math.random() * 1.2,
          0.08 + Math.random() * 0.2,
          (Math.random() - 0.5) * 0.9
        );
        particle.scale.setScalar(0.07);
      }
    });
  });

  return (
    <group>
      {Array.from({ length: 28 }, (_, index) => (
        <mesh
          key={index}
          ref={(node) => {
            particles.current[index] = node;
          }}
          position={[
            -1.2 - Math.random() * 1.2,
            0.08 + Math.random() * 0.2,
            (Math.random() - 0.5) * 0.9,
          ]}
        >
          <sphereGeometry args={[0.2, 10, 10]} />
          <meshStandardMaterial
            color="#b9a17b"
            transparent
            opacity={0.12}
            roughness={1}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function CarModel() {
  const carRef = useRef();
  const elapsed = useRef(0);
  const { scene } = useGLTF("/models/ridelux-car.glb");

  const carData = useMemo(() => {
    const car = clone(scene);
    const bounds = new Box3().setFromObject(car);
    const size = bounds.getSize(new Vector3());
    const center = bounds.getCenter(new Vector3());

    const scale = 4.4 / Math.max(size.x, size.y, size.z, 0.01);
    const wheels = [];

    car.traverse((object) => {
      if (!object.isMesh) return;

      object.castShadow = true;
      object.receiveShadow = true;

      if (/wheel|tire|tyre|rim/i.test(object.name)) {
        wheels.push(object);
      }
    });

    return {
      car,
      wheels,
      scale,
      position: [
        -center.x * scale,
        -bounds.min.y * scale,
        -center.z * scale,
      ],
    };
  }, [scene]);

  useFrame((_, delta) => {
    if (!carRef.current) return;

    elapsed.current += delta;
    const time = elapsed.current;
    const driftDuration = 2.5;

    if (time < driftDuration) {
      const progress = time / driftDuration;
      const eased = 1 - Math.pow(1 - progress, 3);

      carRef.current.position.x = -1.8 + eased * 1.8;

      carRef.current.rotation.y =
        Math.sin(progress * Math.PI * 2.2) *
        0.24 *
        (1 - progress * 0.55);

      carRef.current.rotation.z =
        -Math.sin(progress * Math.PI * 2) *
        0.035 *
        (1 - progress);

      carRef.current.position.y =
        Math.abs(Math.sin(progress * Math.PI * 2)) * 0.055;
    } else {
      carRef.current.position.x = Math.sin(time * 0.45) * 0.07;
      carRef.current.rotation.y = Math.sin(time * 0.42) * 0.035;
      carRef.current.rotation.z = Math.sin(time * 0.8) * 0.008;
      carRef.current.position.y = Math.sin(time * 1.8) * 0.012;
    }

    carData.wheels.forEach((wheel) => {
      wheel.rotation.x += delta * 5.5;
    });
  });

  return (
    <group ref={carRef} position={[-1.8, 0, 0]}>
      <primitive
        object={carData.car}
        scale={carData.scale}
        position={carData.position}
      />
    </group>
  );
}

function Scene() {
  return (
    <>
      <color attach="background" args={["#100f0d"]} />
      <fog attach="fog" args={["#100f0d", 9, 23]} />

      <ambientLight intensity={1.15} />

      <directionalLight
        position={[4, 7, 5]}
        intensity={2.8}
        color="#f0dfc0"
        castShadow
      />

      <pointLight
        position={[-4, 2, -3]}
        intensity={30}
        color="#c69a55"
      />

      <pointLight
        position={[3, 2, 3]}
        intensity={22}
        color="#f0d4a0"
      />

      <pointLight
        position={[0, 3, -5]}
        intensity={15}
        color="#8c6840"
      />

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.035, 0]}
        receiveShadow
      >
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial
          color="#100f0d"
          roughness={0.72}
          metalness={0.12}
        />
      </mesh>

      <Suspense fallback={null}>
        <CarModel />
        <SmokeTrail />

        <ContactShadows
          position={[0, 0.005, 0]}
          opacity={0.48}
          scale={9}
          blur={2.8}
          far={3}
          color="#000000"
        />
      </Suspense>
    </>
  );
}

export default function CarExperience() {
  return (
    <div className="car-experience">
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [4.8, 2.8, 7.2], fov: 36 }}
        gl={{ antialias: true, alpha: false }}
      >
        <Scene />
      </Canvas>

      <div className="car-light-streak car-light-streak-one" />
      <div className="car-light-streak car-light-streak-two" />
    </div>
  );
}

useGLTF.preload("/models/ridelux-car.glb");
