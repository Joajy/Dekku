"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { DragControls } from "three/addons/controls/DragControls.js"; // 유지해야 하는 경로

const objects = [
  { name: "Cube", geometry: new THREE.BoxGeometry(), color: 0x00ff00 },
  { name: "Sphere", geometry: new THREE.SphereGeometry(), color: 0x0000ff },
  // 추가 오브젝트
];

const Page = () => {
  const [selectedObject, setSelectedObject] = useState(null); // 선택된 오브젝트 상태
  const canvasRef = useRef(null); // 캔버스 참조
  const sceneRef = useRef(new THREE.Scene()); // Three.js 장면 참조
  const cameraRef = useRef(null); // 카메라 참조 (useEffect에서 초기화)
  const rendererRef = useRef(null); // 렌더러 참조 (useEffect에서 초기화)
  const dragControlsRef = useRef(null); // 드래그 컨트롤 참조
  const gridHelperRef = useRef(null); // 그리드 헬퍼 참조
  const planeRef = useRef(null); // 평면 참조

  useEffect(() => {
    if (typeof window !== "undefined") {
      // 카메라 설정
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.set(10, 40, 60); // 카메라 위치 조정
      camera.lookAt(0, 0, 0); // 카메라가 그리드 중심을 바라보도록 설정
      cameraRef.current = camera;

      // 렌더러 설정
      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0xeeeeee); // 배경색 설정
      canvasRef.current.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      const scene = sceneRef.current;

      // 애니메이션 루프
      const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };

      animate();

      // 그리드 추가
      const gridHelper = new THREE.GridHelper(50, 20);
      scene.add(gridHelper);
      gridHelperRef.current = gridHelper;

      // 평면 추가
      const geometry = new THREE.PlaneGeometry(1000, 1000);
      geometry.rotateX(-Math.PI / 2);
      const plane = new THREE.Mesh(
        geometry,
        new THREE.MeshBasicMaterial({ visible: false })
      );
      scene.add(plane);
      planeRef.current = plane;

      const objects = [plane]; // 평면을 포함한 오브젝트 배열

      // 윈도우 리사이즈 이벤트 핸들러
      window.addEventListener("resize", () => {
        if (rendererRef.current && cameraRef.current) {
          rendererRef.current.setSize(window.innerWidth, window.innerHeight);
          cameraRef.current.aspect = window.innerWidth / window.innerHeight;
          cameraRef.current.updateProjectionMatrix();
        }
      });

      // 컴포넌트 언마운트 시 클린업
      return () => {
        window.removeEventListener("resize", () => {});
        if (canvasRef.current) {
          canvasRef.current.removeChild(renderer.domElement);
        }
      };
    }
  }, []);

  useEffect(() => {
    if (selectedObject && cameraRef.current && rendererRef.current) {
      // 선택된 오브젝트의 지오메트리와 색상 가져오기
      const { geometry, color } = selectedObject;
      const material = new THREE.MeshBasicMaterial({ color });
      const mesh = new THREE.Mesh(geometry, material);

      const scene = sceneRef.current;
      // scene.clear(); // 장면 초기화 대신, 기존 오브젝트 제거
      while (scene.children.length > 0) {
        scene.remove(scene.children[0]);
      }

      // 그리드와 평면을 다시 추가
      scene.add(gridHelperRef.current);
      scene.add(planeRef.current);
      scene.add(mesh); // 선택된 오브젝트 추가

      // 드래그 컨트롤 설정
      const dragControls = new DragControls(
        [mesh],
        cameraRef.current,
        rendererRef.current.domElement
      );
      dragControlsRef.current = dragControls;

      // 드래그 이벤트 핸들러
      dragControls.addEventListener("drag", (event) => {
        event.object.position.x = Math.round(event.object.position.x * 10) / 10;
        event.object.position.z = Math.round(event.object.position.z * 10) / 10;

        // 오브젝트가 grid 평면 위에서만 움직이도록 제한
        event.object.position.y = 0; // Y축 고정 (평면 위)
      });

      // 클린업 함수
      return () => {
        dragControls.dispose(); // 드래그 컨트롤 해제
        scene.remove(mesh); // 장면에서 오브젝트 제거
      };
    }
  }, [selectedObject]);

  return (
    <div className="flex">
      <div className="w-48 p-4">
        <h3 className="text-lg font-bold mb-2">Object Selector</h3>
        <ul className="space-y-2">
          {objects.map((obj, index) => (
            <li
              key={index}
              onClick={() => setSelectedObject(obj)}
              className="cursor-pointer hover:bg-gray-200 p-2 rounded"
            >
              {obj.name}
            </li>
          ))}
        </ul>
      </div>
      <div ref={canvasRef} className="flex-1 h-screen" />
    </div>
  );
};

export default Page;
