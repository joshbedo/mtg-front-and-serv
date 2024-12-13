import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import { Icosahedron, Cylinder, Box } from '@react-three/drei';
import * as THREE from 'three';

interface DiceProps {
  type: 'd6' | 'd10' | 'd20';
  result: number | null;
  onAnimationComplete: () => void;
}

function Dice({ type, result, onAnimationComplete }: DiceProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [spring, api] = useSpring(() => ({
    position: [-2, 1, 0],
    rotation: [0, 0, 0],
    config: { mass: 5, tension: 200, friction: 20 },
  }));

  useEffect(() => {
    // Create a more dynamic animation path centered on the battlefield
    api.start({
      to: [
        { position: [-1, 0.75, 0.5], rotation: [Math.PI * 2, Math.PI, Math.PI / 2] },
        { position: [0, 0.5, -0.25], rotation: [Math.PI * 3, Math.PI * 2, Math.PI] },
        { position: [1, 0.25, 0.25], rotation: [Math.PI * 4, Math.PI * 3, Math.PI * 1.5] },
        { position: [2, 0, 0], rotation: [Math.PI * 5, Math.PI * 4, Math.PI * 2] }
      ],
      onRest: onAnimationComplete,
    });
  }, [api, onAnimationComplete]);

  useFrame((state) => {
    if (!meshRef.current) return;
    // Add continuous rotation during animation
    meshRef.current.rotation.x += 0.08;
    meshRef.current.rotation.y += 0.06;
    meshRef.current.rotation.z += 0.04;
    state.camera.lookAt(0, 0, 0);
  });

  const createDiceMaterial = (number: number) => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Create metallic gradient background
      const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 360);
      gradient.addColorStop(0, '#ffd700');  // Bright gold center
      gradient.addColorStop(0.5, '#daa520'); // Medium gold
      gradient.addColorStop(0.8, '#b8860b'); // Dark gold edge
      gradient.addColorStop(1, '#8b6914');   // Darker gold border
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 512, 512);

      // Add metallic border with bevel effect
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 20;
      ctx.strokeRect(20, 20, 472, 472);
      
      // Add inner shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
      ctx.shadowBlur = 15;
      ctx.shadowOffsetX = 5;
      ctx.shadowOffsetY = 5;
      ctx.strokeRect(40, 40, 432, 432);

      // Add number with enhanced styling
      ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 240px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(number.toString(), 256, 256);

      // Add metallic shine overlay
      const shine = ctx.createLinearGradient(0, 0, 512, 512);
      shine.addColorStop(0, 'rgba(255,255,255,0.4)');
      shine.addColorStop(0.5, 'rgba(255,255,255,0)');
      shine.addColorStop(1, 'rgba(255,255,255,0.4)');
      ctx.fillStyle = shine;
      ctx.fillRect(0, 0, 512, 512);
    }

    const texture = new THREE.CanvasTexture(canvas);
    return new THREE.MeshStandardMaterial({
      map: texture,
      metalness: 0.8,
      roughness: 0.2,
      emissive: new THREE.Color(0x222222),
      emissiveIntensity: 0.3,
    });
  };

  const getGeometry = () => {
    const material = createDiceMaterial(result || (type === 'd20' ? 20 : type === 'd10' ? 10 : 6));
    
    switch (type) {
      case 'd20':
        return (
          <Icosahedron args={[0.5, 1]}>
            <primitive object={material} attach="material" />
          </Icosahedron>
        );
      case 'd10':
        return (
          <Cylinder args={[0.4, 0.5, 0.75, 10, 1]}>
            <primitive object={material} attach="material" />
          </Cylinder>
        );
      default:
        return (
          <Box args={[0.75, 0.75, 0.75]} radius={0.05}>
            <primitive object={material} attach="material" />
          </Box>
        );
    }
  };

  return (
    <animated.mesh
      ref={meshRef}
      position={spring.position as any}
      rotation={spring.rotation as any}
      castShadow
      receiveShadow
    >
      {getGeometry()}
    </animated.mesh>
  );
}

interface DiceAnimationProps {
  type: 'd6' | 'd10' | 'd20';
  result: number | null;
}

export function DiceAnimation({ type, result }: DiceAnimationProps) {
  const [isAnimating, setIsAnimating] = React.useState(true);

  const handleAnimationComplete = () => {
    setTimeout(() => setIsAnimating(false), 1000);
  };

  if (!isAnimating) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      <Canvas
        shadows
        camera={{ position: [0, 1.5, 3], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={1.5} />
        <pointLight position={[10, 10, 10]} intensity={2.5} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={1.5} />
        <directionalLight position={[0, 5, 5]} intensity={2} castShadow />
        <Dice 
          type={type} 
          result={result} 
          onAnimationComplete={handleAnimationComplete} 
        />
      </Canvas>
    </div>
  );
}