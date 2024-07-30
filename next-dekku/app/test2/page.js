"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DragControls } from "three/examples/jsm/controls/DragControls";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const objects = [
  { name: "Cube", geometry: new THREE.BoxGeometry(), color: 0x00ff00 },
  { name: "Sphere", geometry: new THREE.SphereGeometry(), color: 0x0000ff },
  // 추가 오브젝트
];

const Page = () => {
  const [selectedObjects, setSelectedObjects] = useState([]); // 선택된 오브젝트 상태
  const [isBarOpen, setIsBarOpen] = useState(true); // 헤더바 펼치기/접기 상태
  const canvasRef = useRef(null); // 캔버스 참조
  const sceneRef = useRef(new THREE.Scene()); // Three.js 장면 참조
  const cameraRef = useRef(null); // 카메라 참조
  const rendererRef = useRef(null); // 렌더러 참조
  const controlsRef = useRef(null); // OrbitControls 참조
  const dragControlsRef = useRef(null); // 드래그 컨트롤 참조
  const gridHelperRef = useRef(null); // 그리드 헬퍼 참조
  const planeRef = useRef(null); // 평면 참조
  const deskRef = useRef(null); // 책상 모델 참조

  useEffect(() => {
    if (typeof window !== "undefined") {
      // 카메라 설정
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.set(10, 40, 60);
      camera.lookAt(0, 0, 0);
      cameraRef.current = camera;

      // 렌더러 설정
      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0xeeeeee);

      // 캔버스가 렌더러를 수용할 수 있는지 확인
      if (canvasRef.current) {
        canvasRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;
      } else {
        console.error("Canvas reference is not set.");
      }

      const scene = sceneRef.current;

      // 조명 추가
      const ambientLight = new THREE.AmbientLight(0x404040);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(10, 20, 10).normalize();
      scene.add(directionalLight);

      // OrbitControls 설정
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.target.set(0, 0, 0);
      controls.update();
      controls.enablePan = true;
      controls.enableDamping = true;
      controls.dampingFactor = 0.25;
      controlsRef.current = controls;

      // 애니메이션 루프
      const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      };

      animate();

      // GLTFLoader를 사용하여 책상 모델 로드
      const loader = new GLTFLoader();
      loader.load("/threedmodels/ssafydesk.glb", (gltf) => {
        const desk = gltf.scene;
        desk.name = "Desk";
        scene.add(desk);
        deskRef.current = desk;

        // 책상 모델의 초기 크기와 위치 조정
        desk.scale.set(50, 50, 50);
        desk.position.set(0, -36.5, 0);

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
      });

      // 윈도우 리사이즈 이벤트 핸들러
      const handleResize = () => {
        if (rendererRef.current && cameraRef.current) {
          rendererRef.current.setSize(window.innerWidth, window.innerHeight);
          cameraRef.current.aspect = window.innerWidth / window.innerHeight;
          cameraRef.current.updateProjectionMatrix();
        }
      };
      window.addEventListener("resize", handleResize);

      // 컴포넌트 언마운트 시 클린업
      return () => {
        window.removeEventListener("resize", handleResize);
        if (canvasRef.current && rendererRef.current) {
          canvasRef.current.removeChild(renderer.domElement);
        }
      };
    }
  }, []);

  useEffect(() => {
    const scene = sceneRef.current;
    const existingObjects = new Set(scene.children.map(obj => obj.name));
    
    if (cameraRef.current && rendererRef.current) {
      // 선택된 오브젝트 중 새로운 오브젝트만 추가
      const newObjects = selectedObjects.filter(({ id }) => !existingObjects.has(`Object_${id}`));
      newObjects.forEach(({ geometry, color, id }) => {
        const material = new THREE.MeshBasicMaterial({ color });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.name = `Object_${id}`; // 각 오브젝트를 구별할 수 있도록 이름 설정
        scene.add(mesh);
      });

      // 드래그 컨트롤 설정
      const allMeshes = selectedObjects.map(({ id }) => scene.getObjectByName(`Object_${id}`));
      if (dragControlsRef.current) {
        dragControlsRef.current.dispose();
      }
      const dragControls = new DragControls(
        allMeshes,
        cameraRef.current,
        rendererRef.current.domElement
      );
      dragControlsRef.current = dragControls;

      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      const onPointerMove = (event) => {
        const rect = rendererRef.current.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      };

      window.addEventListener('pointermove', onPointerMove);

      dragControls.addEventListener("dragstart", (event) => {
        controlsRef.current.enableRotate = false;
        controlsRef.current.enableZoom = false;
        controlsRef.current.enablePan = false;
      });

      dragControls.addEventListener("dragend", (event) => {
        controlsRef.current.enableRotate = true;
        controlsRef.current.enableZoom = true;
        controlsRef.current.enablePan = true;
      });

      dragControls.addEventListener("drag", (event) => {
        raycaster.setFromCamera(mouse, cameraRef.current);
        const intersects = raycaster.intersectObject(planeRef.current);
        if (intersects.length > 0) {
          const intersect = intersects[0];
          event.object.position.copy(intersect.point).add(intersect.face.normal);
          event.object.position.y = 0; // Y축 고정 (평면 위)
        }
      });

      // 클린업 함수
      return () => {
        if (dragControlsRef.current) {
          dragControlsRef.current.dispose();
          dragControlsRef.current = null;
        }
        window.removeEventListener('pointermove', onPointerMove);
      };
    }
  }, [selectedObjects]);

  return (
    <div className="flex">
      <div className="w-48 p-4 bg-gray-100">
        <h3 className="text-lg font-bold mb-2">Object Selector</h3>
        <ul className="space-y-2">
          {objects.map((obj, index) => (
            <li
              key={index}
              onClick={() => {
                const id = Date.now(); // 각 오브젝트에 고유 ID 부여
                setSelectedObjects(prev => [...prev, { ...obj, id }]);
              }}
              className="cursor-pointer hover:bg-gray-200 p-2 rounded"
            >
              {obj.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col">
        <header className="bg-gray-800 text-white p-4 flex items-center space-x-4 overflow-x-auto">
          <h1 className="text-xl font-bold">3D Viewer</h1>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => setIsBarOpen(prev => !prev)}
          >
            {isBarOpen ? "Hide Selected Objects" : "Show Selected Objects"}
          </button>
          {isBarOpen && (
            <div className="flex space-x-4 overflow-x-auto">
              {selectedObjects.map((obj, index) => (
                <div
                  key={index}
                  className="bg-gray-300 p-2 rounded"
                >
                  {obj.name}
                </div>
              ))}
            </div>
          )}
        </header>
        <div ref={canvasRef} className="" />
      </div>
    </div>
  );
};

export default Page;
