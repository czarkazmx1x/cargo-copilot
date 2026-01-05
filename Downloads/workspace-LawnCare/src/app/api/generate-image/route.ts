import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const { prompt, filename } = await request.json()

    if (!prompt || !filename) {
      return NextResponse.json(
        { error: 'Prompt and filename are required' },
        { status: 400 }
      )
    }

    // Initialize ZAI SDK
    const zai = await ZAI.create()

    // Generate image
    const response = await zai.images.generations.create({
      prompt: prompt,
      size: '1344x768'
    })

    if (!response.data?.[0]?.base64) {
      return NextResponse.json(
        { error: 'Failed to generate image' },
        { status: 500 }
      )
    }

    // Decode base64
    const imageBuffer = Buffer.from(response.data[0].base64, 'base64')

    // Ensure public/images directory exists
    const publicDir = path.join(process.cwd(), 'public', 'images')
    await mkdir(publicDir, { recursive: true })

    // Save image
    const filepath = path.join(publicDir, filename)
    await writeFile(filepath, imageBuffer)

    return NextResponse.json({
      success: true,
      imageUrl: `/images/${filename}`,
      filename: filename
    })
  } catch (error) {
    console.error('Image generation error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate image' },
      { status: 500 }
    )
  }
}
