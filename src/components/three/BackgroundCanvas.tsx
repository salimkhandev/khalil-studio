"use client";
import { Line } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Mesh, MeshBasicMaterial, Points, Line as ThreeLine } from "three";
import { BufferAttribute, BufferGeometry, Color, Fog, Group, Vector3 } from "three";

function PointsField({ isDark }: { isDark: boolean }) {
  const particlesCount = 80000;
  const pointsRef = useRef<Points>(null);
  const geometry = useMemo(() => new BufferGeometry(), []);
  const positions = useMemo(() => new Float32Array(particlesCount * 3), [particlesCount]);

  useMemo(() => {
    for (let i = 0; i < particlesCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 80;
    }
    geometry.setAttribute("position", new BufferAttribute(positions, 3));
  }, [geometry, positions, particlesCount]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (pointsRef.current) pointsRef.current.rotation.y = t * 0.01;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial 
        color={isDark ? "#4a2a2a" : "#ccaaaa"}
        opacity={0.4}
        size={0.06}
        transparent
      />
    </points>
  );
}

function FilmFrames({ isDark }: { isDark: boolean }) {
  const count = 15; // Reduced from 30 for better performance
  const groupRef = useRef<Group>(null);
  const frames = useMemo(() => {
    return new Array(count).fill(0).map((_, i) => ({
      position: new Vector3((Math.random() - 0.5) * 50, (Math.random() - 0.5) * 30, (Math.random() - 0.5) * 30), // Reduced range
      rotation: new Vector3(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI),
      rotationSpeed: { x: (Math.random() - 0.5) * 0.005, y: (Math.random() - 0.5) * 0.005, z: (Math.random() - 0.5) * 0.003 }, // Slower rotation
      isAccent: i % 4 === 0, // Less frequent accents
    }));
  }, [count]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, index) => {
      const f = frames[index]!;
      child.rotation.x += f.rotationSpeed.x;
      child.rotation.y += f.rotationSpeed.y;
      child.rotation.z += f.rotationSpeed.z;
      const material = (child as Mesh).material as MeshBasicMaterial;
      if (f.isAccent) {
        material.opacity = 0.15 + Math.sin(t * 1.5 + index) * 0.1; // Reduced animation intensity
      }
    });
  });

  const materialColor = (isAccent: boolean) => (isDark ? (isAccent ? "#ff4d4d" : "#1a1a1a") : (isAccent ? "#ff4d4d" : "#dddddd"));

  return (
    <group ref={groupRef}>
      {frames.map((f, i) => (
        <mesh key={i} position={f.position} rotation={[f.rotation.x, f.rotation.y, f.rotation.z]}>
          <boxGeometry args={[1.5, 1, 0.08]} />
          <meshBasicMaterial 
            wireframe 
            opacity={0.2} 
            transparent 
            color={materialColor(f.isAccent)}
          />
        </mesh>
      ))}
    </group>
  );
}

function Timeline() {
  const groupRef = useRef<Group>(null);
  const count = 6; // Reduced from 10 for better performance

  const lines = useMemo(() => {
    return new Array(count).fill(0).map(() => {
      const points: Array<[number, number, number]> = [];
      const segments = 15; // Reduced from 20
      for (let j = 0; j < segments; j++) {
        points.push([(j - segments / 2) * 2.5, Math.sin(j * 0.4) * 2.5, (Math.random() - 0.5) * 15]); // Reduced complexity
      }
      const y = (Math.random() - 0.5) * 25; // Reduced range
      return { points, y };
    });
  }, [count]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, index) => {
      const obj = child as ThreeLine;
      obj.rotation.z = Math.sin(t * 0.2 + index) * 0.05; // Slower animation
      obj.position.x = Math.sin(t * 0.15 + index) * 1.5; // Reduced movement
    });
  });

  return (
    <group ref={groupRef}>
      {lines.map((l, i) => (
        <Line
          key={i}
          points={l.points}
          position={[0, l.y, 0]}
          color="#ff4d4d"
          lineWidth={0.8} // Thinner lines
          transparent
          opacity={0.12} // Reduced opacity
        />
      ))}
    </group>
  );
}

function ThemeEffects({ isDark }: { isDark: boolean }) {
  const { gl, scene, camera } = useThree();
  
  // Set background immediately on mount and theme change
  useEffect(() => {
    const backgroundColor = new Color(isDark ? "#0a0a0a" : "#f5f5f5");
    scene.background = backgroundColor;
    scene.fog = new Fog(backgroundColor, 10, 50);
    gl.setClearColor(backgroundColor);
    
    // Force immediate update
    gl.clear();
  }, [gl, scene, isDark]);

  // Mouse parallax - optimized for performance
  useEffect(() => {
    let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
    let raf: number;
    
    const onMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    
    const onFrame = () => {
      targetX = mouseX * 2;
      targetY = mouseY * 2;
      camera.position.x += (targetX - camera.position.x) * 0.03;
      camera.position.y += (targetY - camera.position.y) * 0.03;
      camera.lookAt(0, 0, 0);
      raf = requestAnimationFrame(onFrame);
    };
    
    // Throttle mouse events for better performance
    let mouseTimeout: NodeJS.Timeout;
    const throttledMouseMove = (e: MouseEvent) => {
      clearTimeout(mouseTimeout);
      mouseTimeout = setTimeout(() => onMove(e), 16);
    };
    
    window.addEventListener("mousemove", throttledMouseMove, { passive: true });
    raf = requestAnimationFrame(onFrame);
    
    return () => {
      window.removeEventListener("mousemove", throttledMouseMove);
      cancelAnimationFrame(raf);
      clearTimeout(mouseTimeout);
    };
  }, [camera]);
  
  return null;
}

export default function BackgroundCanvas() {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const current = theme === "system" ? systemTheme : theme;
  const isDark = (current ?? "light") === "dark";
  
  if (!mounted) {
    // Return a placeholder that matches the final background
    return (
      <div className="fixed inset-0 -z-10 bg-white dark:bg-gradient-to-b dark:from-[#0b1020] dark:to-[#0e1326]" />
    );
  }

  return (
    <div 
      className="fixed inset-0 -z-10"
      style={{ backgroundColor: isDark ? "#0a0a0a" : "#f5f5f5" }}
    >
      <Canvas 
        camera={{ position: [0, 0, 30], fov: 75 }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
        gl={{ 
          antialias: false,
          alpha: true,
          powerPreference: "low-power"
        }}
        style={{ backgroundColor: isDark ? "#0a0a0a" : "#f5f5f5" }}
      >
        <ThemeEffects isDark={isDark} />
        <PointsField isDark={isDark} />
        <FilmFrames isDark={isDark} />
        <Timeline />
      </Canvas>
    </div>
  );
}


