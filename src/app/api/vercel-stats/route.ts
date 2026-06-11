import { NextResponse } from 'next/server'

export const revalidate = 3600

export async function GET() {
  const token = process.env.MY_VERCEL_API_TOKEN
  const teamId = process.env.MY_VERCEL_TEAM_ID
  const BASE = 'https://api.vercel.com'

  if (!token) {
    return NextResponse.json({ totalDeploys: 0, activeProjects: 0, lastDeployAt: null, error: 'no token' })
  }

  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
  const teamQuery = teamId ? `&teamId=${teamId}` : ''

  try {
    const projectsRes = await fetch(`${BASE}/v10/projects?limit=100${teamQuery}`, { headers, next: { revalidate: 3600 } })

    if (!projectsRes.ok) {
      return NextResponse.json({ totalDeploys: 0, activeProjects: 0, lastDeployAt: null, error: `HTTP ${projectsRes.status}` })
    }

    const projectsData = await projectsRes.json()
    const projects = projectsData.projects ?? []

    const deploysRes = await fetch(`${BASE}/v7/deployments?state=READY&target=production&limit=100${teamQuery}`, { headers, next: { revalidate: 3600 } })

    let totalDeploys = 0
    let lastDeployAt: string | null = null

    if (deploysRes.ok) {
      const deploysData = await deploysRes.json()
      const deployments = deploysData.deployments ?? []
      totalDeploys = deployments.length
      if (deployments.length > 0) {
        const latest = deployments.reduce((a: any, b: any) => (a.createdAt > b.createdAt ? a : b))
        lastDeployAt = new Date(latest.createdAt).toISOString()
      }
    }

    return NextResponse.json({ totalDeploys, activeProjects: projects.length, lastDeployAt })
  } catch {
    return NextResponse.json({ totalDeploys: 0, activeProjects: 0, lastDeployAt: null, error: 'fetch failed' })
  }
}
