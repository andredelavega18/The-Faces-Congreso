import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'

const envFile = fs.readFileSync('.env.local', 'utf-8')
envFile.split('\n').forEach(line => {
    const match = line.match(/^([^#=]+)=(.*)$/)
    if (match) {
        const key = match[1].trim()
        const value = match[2].trim()
        process.env[key] = value
    }
})

async function check() {
    const prisma = new PrismaClient()
    try {
        const count = await prisma.claim.count()
        console.log('Claims count:', count)
    } catch (e: any) {
        console.error('Prisma Error:', e.message)
    } finally {
        await prisma.$disconnect()
    }
}

check()
