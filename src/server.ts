import app from './app'

const PORT = process.env.SERVER_PORT || 3000

app.listen(PORT, () => {
    console.log(`starting server on port: ${PORT}`)
})
