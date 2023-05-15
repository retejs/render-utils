/* eslint-disable @typescript-eslint/naming-convention */
import { ReteOptions } from 'rete-cli'

export default <ReteOptions>{
  input: 'src/index.ts',
  name: 'ReteRenderUtils',
  globals: {
    'rete-area-plugin': 'ReteAreaPlugin'
  }
}
