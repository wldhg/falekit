"use client";

import {
  _currentMotionData,
  _currentOrientationData,
  useRecoilValue,
} from "@/_recoil/client";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

function Arrow(props: {
  color: string;
  arrowLength: number;
  arrowDirection: number[];
}) {
  // using cylinderGeometry and coneGeometry, draw an arrow
  // arrow starts at (0, 0, 0) and points to some point with given direction and given length
  const { color, arrowLength, arrowDirection } = props;

  let arrowLengthToUse = Math.abs(arrowLength);

  const arrowComponentGroupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (arrowComponentGroupRef.current) {
      const arrowComponentGroup = arrowComponentGroupRef.current;

      // arrowDirection is a 3D vector pointing from (0, 0, 0) to the arrow tip,
      // with length = 1. we need to convert it to use as a rotation vector

      let arrowDirectionToUse = arrowDirection;
      if (arrowLength < 0) {
        arrowDirectionToUse = [
          -arrowDirection[0],
          -arrowDirection[1],
          -arrowDirection[2],
        ];
      }

      arrowComponentGroup.rotation.set(
        (arrowDirectionToUse[0] * Math.PI) / 2,
        (arrowDirectionToUse[1] * Math.PI) / 2,
        (arrowDirectionToUse[2] * Math.PI) / 2
      );
    }
  }, [arrowDirection, arrowLength]);

  return (
    <group ref={arrowComponentGroupRef}>
      <mesh position={[0, arrowLengthToUse / 2, 0]}>
        <cylinderGeometry args={[0.07, 0.07, arrowLengthToUse, 32]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh position={[0, arrowLengthToUse + 0.24, 0]}>
        <coneGeometry args={[0.15, 0.5, 32]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

function XYZArrows() {
  const currentMotionData = useRecoilValue(_currentMotionData);
  const currentOrientationData = useRecoilValue(_currentOrientationData);
  const arrowGroupRef = useRef<any>();
  const [
    acc_x,
    acc_y,
    acc_z,
    acc_x_ng,
    acc_y_ng,
    acc_z_ng,
    alphadelta,
    betadelta,
    gammadelta,
  ] = currentMotionData;
  const [
    alpha,
    beta,
    gamma,
    alpharef,
    betaref,
    gammaref,
    alphafinal,
    betafinal,
    gammafinal_notfixed,
    gammafinal,
    gammaflip,
    timestamp,
  ] = currentOrientationData;

  useFrame(() => {
    if (arrowGroupRef.current) {
      const arrowGroup = arrowGroupRef.current;

      const alphause = -(alphafinal / 180) * Math.PI;
      const betause = -(betafinal / 180) * Math.PI;
      const gammause = -(gammafinal / 180) * Math.PI;

      arrowGroup.rotation.set(betause, gammause, alphause);
    }
  });

  return (
    <group ref={arrowGroupRef}>
      <Arrow
        color="red"
        arrowLength={Math.log(Math.abs(acc_x) * Math.E + Math.E)}
        arrowDirection={[0, 0, -1]}
      />
      <Arrow
        color="green"
        arrowLength={Math.log(Math.abs(acc_y) * Math.E + Math.E)}
        arrowDirection={[0, -1, 0]}
      />
      <Arrow
        color="blue"
        arrowLength={Math.log(Math.abs(acc_z) * Math.E + Math.E)}
        arrowDirection={[1, 0, 0]}
      />
    </group>
  );
}

export default function Data3dView() {
  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[100, 100, 100]} />
      <XYZArrows />
    </Canvas>
  );
}
