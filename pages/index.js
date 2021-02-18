import { useEffect, useRef } from 'react'
import useSWR from 'swr'
import Head from 'next/head'
import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Canvas, useFrame, useThree, extend } from 'react-three-fiber'

const URL = '/.netlify/functions/getGithubActivity'

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
  }, [])

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

const useActivity = (username) => {
  const { data, error } = useSWR(`${URL}?username=${username}`)
  return {
    data,
    error,
    loading: !error && !data,
  }
}

const ActivityScene = ({ username }) => {
  const { data, error, loading } = useActivity(username)
  if (loading) return <div className="text-blue-500">Loading...</div>
  if (error) return <div className="text-red-500">Uh Oh</div>
  return (
    <div className="text-green-500">{`Username: ${username}. Max Commits: ${Math.max(
      ...data.commits
    )}.`}</div>
  )
}

export default function Home() {
  useEffect(() => {})
  return (
    <div>
      <Head>
        <title>Green Blocks</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen prose lg:prose-xl">
        <div className="fixed h-full w-full bg-gray-100 inset-0">
          <ActivityScene username="jh3y" />
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
