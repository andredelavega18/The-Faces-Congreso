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
        const speakers = await prisma.speaker.findMany({ select: { id: true, name: true, isActive: true } })

        const assets = await prisma.mediaAsset.findMany({
            where: { assetCategory: 'sponsors' },
            select: { id: true, fileName: true, assetType: true, assetCategory: true }
        })

        const sections = await prisma.eventSection.findMany({ select: { sectionKey: true, isVisible: true } })

        fs.writeFileSync('result-db.txt', JSON.stringify({
            speakers,
            assets,
            sections,
        }, null, 2))

        console.log('Saved to result-db.txt')

    } catch (e: any) {
        console.error('Error:', e.message)
    } finally {
        await prisma.$disconnect()
    }
}

check()
