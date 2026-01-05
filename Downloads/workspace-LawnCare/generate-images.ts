import ZAI from 'z-ai-web-dev-sdk'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

const images = [
  {
    filename: 'hero-lawn.jpg',
    prompt: 'Beautiful manicured green lawn with modern suburban house in background, bright sunny day, professional lawn care, vibrant grass, landscaping perfection, high quality photography'
  },
  {
    filename: 'service-mowing.jpg',
    prompt: 'Professional lawn mowing service, riding mower on well-maintained lawn, neat grass stripes, suburban yard, bright sunlight, professional landscaping equipment, high quality photo'
  },
  {
    filename: 'service-landscaping.jpg',
    prompt: 'Beautiful residential landscaping with colorful flowers, decorative garden beds, stone pathway, manicured lawn, Florida-style garden, vibrant plants, professional landscape design, sunny day'
  },
  {
    filename: 'service-tree-care.jpg',
    prompt: 'Professional tree pruning and shrub care, neatly trimmed ornamental trees and shrubs in front yard, healthy green foliage, residential lawn care, professional arborist work, high quality'
  },
  {
    filename: 'service-irrigation.jpg',
    prompt: 'Modern lawn irrigation system with sprinklers watering green grass, water spray on lawn, residential irrigation installation, lush green grass, sunny day, professional irrigation equipment'
  },
  {
    filename: 'service-aeration.jpg',
    prompt: 'Lawn aeration machine working on grass, soil plugs visible on green lawn, professional lawn care service, lawn renovation, close-up detail of aeration process, high quality photography'
  },
  {
    filename: 'service-cleanup.jpg',
    prompt: 'Beautiful lawn after seasonal cleanup, pristine green grass, raked leaves removed, manicured garden beds, fall/spring lawn maintenance, professional clean up service, sunny day'
  },
  {
    filename: 'testimonial-1.jpg',
    prompt: 'Happy homeowner smiling in front of beautiful well-maintained lawn, suburban house, manicured grass, satisfied customer, professional lawn care result, bright sunny day'
  },
  {
    filename: 'testimonial-2.jpg',
    prompt: 'Family enjoying their beautiful backyard lawn, children playing on green grass, lush lawn, suburban yard, perfect lawn care, happy family, sunny afternoon'
  },
  {
    filename: 'testimonial-3.jpg',
    prompt: 'Beautiful front lawn of modern house, pristine green grass, perfect curb appeal, professional landscaping, American dream home, bright sunny day, manicured yard'
  },
  {
    filename: 'about-team.jpg',
    prompt: 'Professional lawn care team standing together, uniformed workers, landscaping equipment in background, friendly team, local lawn care business, outdoor setting, sunny day'
  },
  {
    filename: 'riverview-location.jpg',
    prompt: 'Beautiful residential neighborhood in Riverview Florida, green lawns, palm trees, suburban houses, sunny Florida day, well-maintained yards, Florida landscape'
  }
]

async function generateImages() {
  const zai = await ZAI.create()

  // Ensure output directory exists
  const publicDir = path.join(process.cwd(), 'public', 'images')
  await mkdir(publicDir, { recursive: true })

  console.log('🌿 Starting lawn care image generation...\n')

  for (let i = 0; i < images.length; i++) {
    const { filename, prompt } = images[i]
    const progress = `${i + 1}/${images.length}`

    try {
      console.log(`[${progress}] Generating ${filename}...`)

      const response = await zai.images.generations.create({
        prompt: prompt,
        size: '1344x768'
      })

      if (!response.data?.[0]?.base64) {
        throw new Error('No image data returned')
      }

      const imageBuffer = Buffer.from(response.data[0].base64, 'base64')
      const filepath = path.join(publicDir, filename)
      await writeFile(filepath, imageBuffer)

      console.log(`✓ Generated: ${filename} (${(imageBuffer.length / 1024).toFixed(2)} KB)\n`)
    } catch (error) {
      console.error(`✗ Failed to generate ${filename}:`, error instanceof Error ? error.message : error)
      console.log()
    }
  }

  console.log('🎉 Image generation complete!')
  console.log(`📁 Images saved to: ${publicDir}`)
}

generateImages().catch(console.error)
