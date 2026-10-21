import 'dotenv/config'
import app from './app.js'

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`🚀 CallPilot backend running on port ${PORT}`)
    console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`)
    console.log(`   AI Provider: ${process.env.AI_PROVIDER || 'gemini'}`)
})
