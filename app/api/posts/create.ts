import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { getTokenFromRequest } from '../../../lib/auth'
import { verifyToken } from '../../../lib/auth'

type PostInput = {
  title: string
  content?: string
  published?: boolean
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Verify the JWT token
    const token = getTokenFromRequest(req)
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    const { title, content, published }: PostInput = req.body

    if (!title) {
      return res.status(400).json({ error: 'Title is required' })
    }

    // Create the new post
    const post = await prisma.post.create({
      data: {
        title,
        content,
        published: published || false,
        authorId: decoded.userId,
      },
    })

    return res.status(201).json(post)
  } catch (error) {
    console.error('Error creating post:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}