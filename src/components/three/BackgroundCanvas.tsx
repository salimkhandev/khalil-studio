"use client";
import { Line } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Mesh, MeshBasicMaterial, Points, PointsMaterial as PointsMaterialType, Line as ThreeLine } from "three";
import { BufferAttribute, BufferGeometry, Color, Fog, Group, Vector3 } from "three";

function PointsField({ isDark }: { isDark: boolean }) {
  const particlesCount = 2000;
  const pointsRef = useRef<Points>(null);
  const geometry = useMemo(() => new BufferGeometry(), []);
  const positions = useMemo(() => new Float32Array(particlesCount * 3), [particlesCount]);
  const materialRef = useRef<PointsMaterialType>(null);

  useMemo(() => {
    for (let i = 0; i < particlesCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 100;
    }
    geometry.setAttribute("position", new BufferAttribute(positions, 3));
  }, [geometry, positions, particlesCount]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (pointsRef.current) pointsRef.current.rotation.y = t * 0.02;
  });

  useEffect(() => {
    if (!materialRef.current) return;
    materialRef.current.color = new Color(isDark ? 0x333333 : 0xcccccc);
    materialRef.current.opacity = 0.6;
    materialRef.current.size = 0.08;
    materialRef.current.transparent = true;
  }, [isDark]);

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial ref={materialRef} />
    </points>
  );
}

function FilmFrames({ isDark }: { isDark: boolean }) {
  const count = 30;
  const groupRef = useRef<Group>(null);
  const frames = useMemo(() => {
    return new Array(count).fill(0).map((_, i) => ({
      position: new Vector3((Math.random() - 0.5) * 60, (Math.random() - 0.5) * 40, (Math.random() - 0.5) * 40),
      rotation: new Vector3(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI),
      rotationSpeed: { x: (Math.random() - 0.5) * 0.01, y: (Math.random() - 0.5) * 0.01, z: (Math.random() - 0.5) * 0.005 },
      isAccent: i % 3 === 0,
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
        material.opacity = 0.2 + Math.sin(t * 2 + index) * 0.15;
      }
    });
  });

  const materialColor = (isAccent: boolean) => (isDark ? (isAccent ? 0xff4d4d : 0x1a1a1a) : (isAccent ? 0xff4d4d : 0xdddddd));

  return (
    <group ref={groupRef}>
      {frames.map((f, i) => (
        <mesh key={i} position={f.position} rotation={[f.rotation.x, f.rotation.y, f.rotation.z]}>
          <boxGeometry args={[2, 1.2, 0.1]} />
          <meshBasicMaterial wireframe opacity={0.3} transparent color={materialColor(f.isAccent)} />
        </mesh>
      ))}
    </group>
  );
}

function Timeline() {
  const groupRef = useRef<Group>(null);
  const count = 10;

  const lines = useMemo(() => {
    return new Array(count).fill(0).map(() => {
      const points: Array<[number, number, number]> = [];
      const segments = 20;
      for (let j = 0; j < segments; j++) {
        points.push([(j - segments / 2) * 3, Math.sin(j * 0.5) * 3, (Math.random() - 0.5) * 20]);
      }
      const y = (Math.random() - 0.5) * 30;
      return { points, y };
    });
  }, [count]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, index) => {
      const obj = child as ThreeLine;
      obj.rotation.z = Math.sin(t * 0.3 + index) * 0.1;
      obj.position.x = Math.sin(t * 0.2 + index) * 2;
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
          lineWidth={1}
          transparent
          opacity={0.15}
        />
      ))}
    </group>
  );
}

function ThemeEffects({ isDark }: { isDark: boolean }) {
  const { gl, scene, camera } = useThree();
  useEffect(() => {
    scene.background = new Color(isDark ? 0x0a0a0a : 0xf5f5f5);
    scene.fog = new Fog(isDark ? 0x0a0a0a : 0xf5f5f5, 10, 50);
    gl.setClearColor(scene.background as Color);
  }, [gl, scene, isDark]);

  // Mouse parallax
  useEffect(() => {
    let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
    const onMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    const onFrame = () => {
      targetX = mouseX * 3;
      targetY = mouseY * 3;
      camera.position.x += (targetX - camera.position.x) * 0.05;
      camera.position.y += (targetY - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);
      raf = requestAnimationFrame(onFrame);
    };
    window.addEventListener("mousemove", onMove);
    let raf = requestAnimationFrame(onFrame);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [camera]);
  return null;
}

export default function BackgroundCanvas() {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const current = theme === "system" ? systemTheme : theme;
  const isDark = (current ?? "light") === "dark";
  if (!mounted) return null;

  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 30], fov: 75 }}>
        <ThemeEffects isDark={isDark} />
        <PointsField isDark={isDark} />
        <FilmFrames isDark={isDark} />
        <Timeline />
      </Canvas>
    </div>
  );
}


