import { useEffect, useRef } from 'react'
import Head from 'next/head'
import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Canvas, useFrame, useThree, extend } from 'react-three-fiber'

extend({ OrbitControls })

const CameraControls = () => {
  const {
    camera,
    gl: { domElement },
  } = useThree()
  const controlsRef = useRef(null)

  useFrame(() => controlsRef.current.update())

  return (
    <orbitControls
      ref={controlsRef}
      args={[camera, domElement]}
      enableZoom={true}
    />
  )
}

const Scene = () => {
  const groupRef = useRef(null)
  useEffect(() => {
    if (groupRef.current) {
      gsap.to(groupRef.current.rotation, {
        z: (Math.PI / 180) * 360,
        repeat: -1,
        ease: 'none',
        duration: 30,
      })
    }
  }, [groupRef.current])
  // useFrame(() => {
  //   // console.info(groupRef.current.rotation)
  // })
  return (
    <group ref={groupRef} rotation={[0, 0, 0]}>
      <mesh position={[2, 0, 0]}>
        <sphereBufferGeometry />
        <meshStandardMaterial color="hotpink" />
      </mesh>
      <mesh position={[-2, 0, 0]}>
        <sphereBufferGeometry />
        <meshStandardMaterial color="hotpink" />
      </mesh>
    </group>
  )
}

export default function Home() {
  return (
    <div>
      <Head>
        <title>Green Blocks</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen prose lg:prose-xl">
        <div className="fixed h-full w-full bg-gray-100 inset-0">
          <Canvas>
            <CameraControls />
            <pointLight position={[10, 10, 10]} />
            <Scene />
          </Canvas>
        </div>
        <div className="absolute top-1/2 left-1/2 bg-blue-100 transform -translate-y-1/2 -translate-x-1/2">
          <h1 className="text-red-500">Green Blocks</h1>
          <p>Visualize your last 365 days of Github activity.</p>
          <form>
            <label>Github Username</label>
            <input type="text" required={true} placeholder="Github username" />
            <input type="Submit" value="Generate" readOnly={true} />
          </form>
        </div>
      </main>

      <footer className="fixed bottom-0">Powered by jh3y</footer>
    </div>
  )
}
