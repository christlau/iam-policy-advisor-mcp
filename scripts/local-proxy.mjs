import http from 'node:http'
import fs from 'node:fs'

const PORT = 8002
const EXTENSIONS = { python: 'py', typescript: 'ts', javascript: 'js', go: 'go', java: 'java' }

const cors = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

const server = http.createServer((req, res) => {
  cors(res)
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return }

  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ status: 'ok' }))
    return
  }

  if (req.method === 'POST' && req.url === '/write-stub') {
    let body = ''
    req.on('data', c => body += c)
    req.on('end', () => {
      try {
        const { code, language } = JSON.parse(body)
        const ext = EXTENSIONS[language] || 'py'
        const filePath = `/tmp/iam-gen-stub.${ext}`
        fs.writeFileSync(filePath, code)
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ filePath }))
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: e.message }))
      }
    })
    return
  }

  res.writeHead(404)
  res.end('Not found')
})

server.listen(PORT, '0.0.0.0', () => console.log(`Proxy running on http://0.0.0.0:${PORT}`))
