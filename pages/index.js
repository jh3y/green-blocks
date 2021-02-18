import T from 'prop-types'
import { Fragment, useEffect, useRef, useState } from 'react'
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

const Scene = ({ data }) => {
  const groupRef = useRef(null)
  useEffect(() => {
    if (groupRef.current) {
      gsap.to(groupRef.current.rotation, {
        x: (Math.PI / 180) * 360,
        repeat: -1,
        ease: 'none',
        duration: 30,
      })
    }
  }, [])

  // There are 53 columns.
  // And each day will be indexed based on the number of days right?
  // Based on 53 spaces that means

  return (
    <group ref={groupRef} rotation={[0, 0, 0]} position={[-26, 0, 0]}>
      {data.map((d, index) => {
        const COLUMN = Math.floor(index / 7) + 1
        console.info(COLUMN)
        return (
          <mesh key={index} position={[COLUMN, 0, index % 7]} width={0.5}>
            <boxGeometry args={[1, d * 0.1, 1]} />
            <meshStandardMaterial color={`hsl(${index}, 80%, 50%)`} />
          </mesh>
        )
      })}
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
  // return {
  //   data: { commits: new Array(369).fill().map(() => 5) },
  // }
}

const ActivityScene = ({ username }) => {
  if (!username) return null
  const { data, error, loading } = useActivity(username)
  if (loading) return <div className="text-blue-500">Loading...</div>
  if (error) return <div className="text-red-500">Uh Oh</div>
  // console.info(data)
  // If message, then there's an error
  if (data.message) return <div className="text-red-600">{data.message}</div>
  return (
    <Fragment>
      <div className="fixed h-full w-full bg-gray-100 inset-0">
        <Canvas camera={{ position: [-20, 0, 50] }}>
          <CameraControls />
          <pointLight position={[10, 10, 10]} />
          <Scene data={data.commits} />
        </Canvas>
      </div>
    </Fragment>
  )
  // <div className="text-green-500 fixed top-1/2 left-1/2 z-10">{`Username: ${username}. Max Commits: ${Math.max(
  //   ...data.commits
  // )}.`}</div>
}
ActivityScene.propTypes = {
  username: T.string,
}

export default function Home() {
  const [username, setUsername] = useState(null)
  const inputRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    setUsername(inputRef.current.value)
  }
  return (
    <div>
      <Head>
        <title>Green Blocks</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen prose lg:prose-xl">
        <ActivityScene username={username} />
        <div
          style={{ backdropFilter: 'blur(10px)' }}
          className="bg-green-100 bg-opacity-50 rounded-md absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 p-4">
          <h1 className="text-green-800">Green Blocks</h1>
          <p>Visualize your last 365 days of Github activity.</p>
          <form onSubmit={handleSubmit}>
            <label htmlFor="username" className="sr-only">
              Github Username
            </label>
            <input
              id="username"
              className="w-full block mb-4"
              ref={inputRef}
              type="text"
              data-lpignore={true}
              required={true}
              placeholder="Github username"
            />
            <input type="Submit" value="Generate" readOnly={true} />
          </form>
        </div>
      </main>

      <footer className="fixed bottom-0">Powered by jh3y</footer>
    </div>
  )
}
