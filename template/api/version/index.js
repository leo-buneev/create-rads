import packageJson from '@/../package.json'
import radsrc from '@/../.radsrc.json'

export default async function () {
  return {
    status: 200,
    body: {
      version: packageJson.version,
      serverMode: 'i2s',
      AppVersion: '9.9.9', // to enable all latest features hidden behind coreApi version flag on client
      radsEnv: process.env.RadsEnv,
      radsrc: {
        ...radsrc,
        environments: _.get(radsrc, 'environments', []).filter(env => env.key === process.env.RadsEnv),
      },
    },
  }
}
