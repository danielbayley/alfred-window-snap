#! /usr/bin/osascript -l JavaScript
const os = Application('System Events')
const ca = Application.currentApplication()
ca.includeStandardAdditions = true
const fs = Application('Finder')

const process = os.applicationProcesses.where({ frontmost: true  })[0]
let window = process.windows.where({ subrole: 'AXStandardWindow' })[0]

const env = ca.systemAttribute
const debug = env('alfred_debug')
const log = message => console.log(Automation.getDisplayString(message, true))

const HOME  = ca.pathTo('home folder')
const tasks = `${HOME}/Library/Application Support/Alfred/Automation/Tasks`
const task  = `${tasks}/com.alfredapp.automation.core/window-management/window-bounds.js`
eval(ca.read(task))
const snap = run

run = bounds => {
  if (bounds.length) bounds = bounds.flat().join().split(/[^\d%]+/)
  else {
    let yaml = env('config')
    if (!yaml) {
      const workflows = `${env('alfred_preferences')}/workflows`
      const token = env('alfred_workflow_name').toLowerCase().split(/\W+/).join('-')
      const paths = [
        env('alfred_workflow_data'),
        `${workflows}/${env('alfred_workflow_uid')}`,
        `${workflows}/homebrew.workflow.${token}`
      ]
      const yml = paths.map(path => `${path}/config.yml`).map(Path).find(fs.exists)
      if (debug) log(yml.toString())
      yaml = ca.read(yml)
    }

    const app = process.name()
    const ruby = `puts YAML.load(%q{${yaml}})['${app}']&.to_json`
    const stdout = ca.doShellScript(`ruby -r yaml -r json -e "${ruby}"`)
    if (!stdout) return
    config = JSON.parse(stdout)
  }
  if (debug) log(bounds.length ? bounds : config)

  bounds = config.filter(value => {
    if (typeof value !== 'object') return true
    try {
      const app = Application(process.bundleIdentifier())
      window = app.windows[0]
      Object.entries(config.pop()).forEach(([key, value]) => window[key] = value)
    }
    catch ({message}) { if (debug) log(message) }
  })

  const screen = 'current'
  const {w,h} = frame = getUsableScreenFrame(getScreenByDesc(screen))
  if (debug) log({w,h})

  const order = ['width', 'height', 'x', 'y']
  const axis  = { x: order[0], y: order[1] }
  const size  = {}

  const calc = (percent, i) => {
    const key = order[i]
    const k = axis[key] || key
    value = frame[k.charAt(0)] * parseInt(percent) / 100
    if (['x','y'].includes(key)) value -= size[axis[key]] / 2
    if (debug) log(`${percent} of ${key} = ${value}`)
    return value.toString()
  }

  const convert = (value, i) => size[order[i]] = value.endsWith('%') ? calc(value, i) : value

  const [width, height, x = '', y = ''] = bounds.map(String).map(convert)
  if (debug) log({ width, height, x, y })

  process.frontmost = true
  snap([screen, 'custom', x, y, width, height])
}
