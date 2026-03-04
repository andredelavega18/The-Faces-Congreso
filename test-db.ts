import { PrismaClient } from '@prisma/client'
import { createClient } from '@supabase/supabase-js'
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
    console.log('Testing DB connection...')
    const prisma = new PrismaClient()
    try {
        const assetCount = await prisma.siteConfig.count() // Change to siteConfig to test a tiny table
        console.log('DB connection OK! siteConfig count:', assetCount)
    } catch (e: any) {
        console.error('DB connection failed:', e.message)
    } finally {
        await prisma.$disconnect()
    }

    console.log('\nTesting Supabase connection...')
    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )
        const { data: buckets, error } = await supabase.storage.listBuckets()
        if (error) throw error
        console.log('Supabase connection OK!')
        console.log('Buckets:', buckets.map((b: any) => b.name).join(', '))
    } catch (e: any) {
        console.error('Supabase connection failed:', e.message)
    }
}

check()
