import 'tailwindcss/tailwind.css'
import T from 'prop-types'

const GreenBlocks = ({ Component, pageProps }) => <Component {...pageProps} />

GreenBlocks.propTypes = {
  Component: T.elementType,
  pageProps: T.object,
}

export default GreenBlocks
