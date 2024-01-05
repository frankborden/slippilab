import {
  Environment,
  OrbitControls,
  OrthographicCamera,
  useAnimations,
  useGLTF,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";

const actions = [
  "AttackAirB",
  "AttackAirF",
  "AttackAirHi",
  "AttackAirLw",
  "AttackAirN",
];

export default function Page() {
  const [action, setAction] = useState("AttackAirB");
  const [modelUrl, setModelUrl] = useState("/models/falco.glb");
  const [actionPrefix, setActionPrefix] = useState("Falco");
  return (
    <>
      <div className="mb-2 flex items-center gap-1 *:px-2 *:py-0.5 *:bg-indigo-500 *:text-white *:rounded">
        <button
          onClick={() => {
            setModelUrl("/models/falco.glb");
            setActionPrefix("Falco");
          }}
        >
          Falco
        </button>
        <button
          onClick={() => {
            setModelUrl("/models/mario.glb");
            setActionPrefix("Mario");
          }}
        >
          Mario
        </button>
        <button
          onClick={() => {
            setModelUrl("/models/sheik.glb");
            setActionPrefix("Seak");
          }}
        >
          Sheik
        </button>
        <button
          onClick={() => {
            setModelUrl("/models/fox.glb");
            setActionPrefix("Fox");
          }}
        >
          Fox
        </button>
      </div>
      <div className="mb-2 flex items-center gap-1 *:px-2 *:py-0.5 *:bg-indigo-500 *:text-white *:rounded">
        {actions.map((action) => (
          <button key={action} onClick={() => setAction(action)}>
            {action}
          </button>
        ))}
      </div>

      <Canvas
        style={{
          backgroundColor: "peachpuff",
          borderRadius: "4px",
          width: "70vmin",
          height: "70vmin",
        }}
      >
        <OrthographicCamera
          makeDefault
          position={[-100, 0, 0]}
          left={-15}
          right={15}
          top={25}
          bottom={-5}
        />
        <OrbitControls />
        <Environment preset="warehouse" />
        <Model
          modelUrl={modelUrl}
          actionPrefix={actionPrefix}
          action={action}
        />
      </Canvas>
    </>
  );
}

function Model({
  modelUrl,
  action,
  actionPrefix,
}: {
  modelUrl: string;
  actionPrefix: string;
  action: string;
}) {
  const { scene, animations } = useGLTF(modelUrl);
  const { mixer, actions } = useAnimations(animations, scene);

  useEffect(() => {
    mixer.stopAllAction();
    actions[`Ply${actionPrefix}5K_Share_ACTION_${action}_figatree`]!.play();
  }, [mixer, actions, action, actionPrefix]);

  return <primitive object={scene} />;
}
