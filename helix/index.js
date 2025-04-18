/* tslint:disable */
/* eslint-disable */
/* prettier-ignore */

/* auto-generated by NAPI-RS */

const { existsSync, readFileSync } = require('fs')
const { join } = require('path')

const { platform, arch } = process

let nativeBinding = null
let localFileExisted = false
let loadError = null

function isMusl() {
  // For Node 10
  if (!process.report || typeof process.report.getReport !== 'function') {
    try {
      const lddPath = require('child_process').execSync('which ldd').toString().trim()
      return readFileSync(lddPath, 'utf8').includes('musl')
    } catch (e) {
      return true
    }
  } else {
    const { glibcVersionRuntime } = process.report.getReport().header
    return !glibcVersionRuntime
  }
}

switch (platform) {
  case 'android':
    switch (arch) {
      case 'arm64':
        localFileExisted = existsSync(join(__dirname, 'Helix Lite.android-arm64.node'))
        try {
          if (localFileExisted) {
            nativeBinding = require('./Helix Lite.android-arm64.node')
          } else {
            nativeBinding = require('@helix/db-android-arm64')
          }
        } catch (e) {
          loadError = e
        }
        break
      case 'arm':
        localFileExisted = existsSync(join(__dirname, 'Helix Lite.android-arm-eabi.node'))
        try {
          if (localFileExisted) {
            nativeBinding = require('./Helix Lite.android-arm-eabi.node')
          } else {
            nativeBinding = require('@helix/db-android-arm-eabi')
          }
        } catch (e) {
          loadError = e
        }
        break
      default:
        throw new Error(`Unsupported architecture on Android ${arch}`)
    }
    break
  case 'win32':
    switch (arch) {
      case 'x64':
        localFileExisted = existsSync(
          join(__dirname, 'Helix Lite.win32-x64-msvc.node')
        )
        try {
          if (localFileExisted) {
            nativeBinding = require('./Helix Lite.win32-x64-msvc.node')
          } else {
            nativeBinding = require('@helix/db-win32-x64-msvc')
          }
        } catch (e) {
          loadError = e
        }
        break
      case 'ia32':
        localFileExisted = existsSync(
          join(__dirname, 'Helix Lite.win32-ia32-msvc.node')
        )
        try {
          if (localFileExisted) {
            nativeBinding = require('./Helix Lite.win32-ia32-msvc.node')
          } else {
            nativeBinding = require('@helix/db-win32-ia32-msvc')
          }
        } catch (e) {
          loadError = e
        }
        break
      case 'arm64':
        localFileExisted = existsSync(
          join(__dirname, 'Helix Lite.win32-arm64-msvc.node')
        )
        try {
          if (localFileExisted) {
            nativeBinding = require('./Helix Lite.win32-arm64-msvc.node')
          } else {
            nativeBinding = require('@helix/db-win32-arm64-msvc')
          }
        } catch (e) {
          loadError = e
        }
        break
      default:
        throw new Error(`Unsupported architecture on Windows: ${arch}`)
    }
    break
  case 'darwin':
    localFileExisted = existsSync(join(__dirname, 'Helix Lite.darwin-universal.node'))
    try {
      if (localFileExisted) {
        nativeBinding = require('./Helix Lite.darwin-universal.node')
      } else {
        nativeBinding = require('@helix/db-darwin-universal')
      }
      break
    } catch {}
    switch (arch) {
      case 'x64':
        localFileExisted = existsSync(join(__dirname, 'Helix Lite.darwin-x64.node'))
        try {
          if (localFileExisted) {
            nativeBinding = require('./Helix Lite.darwin-x64.node')
          } else {
            nativeBinding = require('@helix/db-darwin-x64')
          }
        } catch (e) {
          loadError = e
        }
        break
      case 'arm64':
        localFileExisted = existsSync(
          join(__dirname, 'Helix Lite.darwin-arm64.node')
        )
        try {
          if (localFileExisted) {
            nativeBinding = require('./Helix Lite.darwin-arm64.node')
          } else {
            nativeBinding = require('@helix/db-darwin-arm64')
          }
        } catch (e) {
          loadError = e
        }
        break
      default:
        throw new Error(`Unsupported architecture on macOS: ${arch}`)
    }
    break
  case 'freebsd':
    if (arch !== 'x64') {
      throw new Error(`Unsupported architecture on FreeBSD: ${arch}`)
    }
    localFileExisted = existsSync(join(__dirname, 'Helix Lite.freebsd-x64.node'))
    try {
      if (localFileExisted) {
        nativeBinding = require('./Helix Lite.freebsd-x64.node')
      } else {
        nativeBinding = require('@helix/db-freebsd-x64')
      }
    } catch (e) {
      loadError = e
    }
    break
  case 'linux':
    switch (arch) {
      case 'x64':
        if (isMusl()) {
          localFileExisted = existsSync(
            join(__dirname, 'Helix Lite.linux-x64-musl.node')
          )
          try {
            if (localFileExisted) {
              nativeBinding = require('./Helix Lite.linux-x64-musl.node')
            } else {
              nativeBinding = require('@helix/db-linux-x64-musl')
            }
          } catch (e) {
            loadError = e
          }
        } else {
          localFileExisted = existsSync(
            join(__dirname, 'Helix Lite.linux-x64-gnu.node')
          )
          try {
            if (localFileExisted) {
              nativeBinding = require('./Helix Lite.linux-x64-gnu.node')
            } else {
              nativeBinding = require('@helix/db-linux-x64-gnu')
            }
          } catch (e) {
            loadError = e
          }
        }
        break
      case 'arm64':
        if (isMusl()) {
          localFileExisted = existsSync(
            join(__dirname, 'Helix Lite.linux-arm64-musl.node')
          )
          try {
            if (localFileExisted) {
              nativeBinding = require('./Helix Lite.linux-arm64-musl.node')
            } else {
              nativeBinding = require('@helix/db-linux-arm64-musl')
            }
          } catch (e) {
            loadError = e
          }
        } else {
          localFileExisted = existsSync(
            join(__dirname, 'Helix Lite.linux-arm64-gnu.node')
          )
          try {
            if (localFileExisted) {
              nativeBinding = require('./Helix Lite.linux-arm64-gnu.node')
            } else {
              nativeBinding = require('@helix/db-linux-arm64-gnu')
            }
          } catch (e) {
            loadError = e
          }
        }
        break
      case 'arm':
        if (isMusl()) {
          localFileExisted = existsSync(
            join(__dirname, 'Helix Lite.linux-arm-musleabihf.node')
          )
          try {
            if (localFileExisted) {
              nativeBinding = require('./Helix Lite.linux-arm-musleabihf.node')
            } else {
              nativeBinding = require('@helix/db-linux-arm-musleabihf')
            }
          } catch (e) {
            loadError = e
          }
        } else {
          localFileExisted = existsSync(
            join(__dirname, 'Helix Lite.linux-arm-gnueabihf.node')
          )
          try {
            if (localFileExisted) {
              nativeBinding = require('./Helix Lite.linux-arm-gnueabihf.node')
            } else {
              nativeBinding = require('@helix/db-linux-arm-gnueabihf')
            }
          } catch (e) {
            loadError = e
          }
        }
        break
      case 'riscv64':
        if (isMusl()) {
          localFileExisted = existsSync(
            join(__dirname, 'Helix Lite.linux-riscv64-musl.node')
          )
          try {
            if (localFileExisted) {
              nativeBinding = require('./Helix Lite.linux-riscv64-musl.node')
            } else {
              nativeBinding = require('@helix/db-linux-riscv64-musl')
            }
          } catch (e) {
            loadError = e
          }
        } else {
          localFileExisted = existsSync(
            join(__dirname, 'Helix Lite.linux-riscv64-gnu.node')
          )
          try {
            if (localFileExisted) {
              nativeBinding = require('./Helix Lite.linux-riscv64-gnu.node')
            } else {
              nativeBinding = require('@helix/db-linux-riscv64-gnu')
            }
          } catch (e) {
            loadError = e
          }
        }
        break
      case 's390x':
        localFileExisted = existsSync(
          join(__dirname, 'Helix Lite.linux-s390x-gnu.node')
        )
        try {
          if (localFileExisted) {
            nativeBinding = require('./Helix Lite.linux-s390x-gnu.node')
          } else {
            nativeBinding = require('@helix/db-linux-s390x-gnu')
          }
        } catch (e) {
          loadError = e
        }
        break
      default:
        throw new Error(`Unsupported architecture on Linux: ${arch}`)
    }
    break
  default:
    throw new Error(`Unsupported OS: ${platform}, architecture: ${arch}`)
}

if (!nativeBinding) {
  if (loadError) {
    throw loadError
  }
  throw new Error(`Failed to load native binding`)
}

const { HelixJs } = nativeBinding

module.exports.HelixJs = HelixJs
