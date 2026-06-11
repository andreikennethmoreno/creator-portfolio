type VercelProject = {
  id: string;
  name: string;
  framework: string | null;
  targets?: {
    production?: {
      alias?: string[];
    };
  };
  latestDeployments?: {
    url: string;
    state: string;
    target?: string;
  }[];
};

export type EnrichedProject = {
  name: string;
  deployedUrl: string;
  deploymentCount: number;
  framework: string | null;
  favicon: string;
};

const BASE = "https://api.vercel.com";

function vercelHeaders() {
  return {
    Authorization: `Bearer ${process.env.MY_VERCEL_API_TOKEN}`,
    "Content-Type": "application/json",
  };
}

function teamQuery() {
  return process.env.MY_VERCEL_TEAM_ID
    ? `&teamId=${process.env.MY_VERCEL_TEAM_ID}`
    : "";
}

async function getDeploymentCount(projectId: string): Promise<number> {
  try {
    const res = await fetch(
      `${BASE}/v7/deployments?projectId=${projectId}&state=READY&target=production&limit=100${teamQuery()}`,
      {
        headers: vercelHeaders(),
        next: { revalidate: 3600 },
      }
    );
    if (!res.ok) return 0;
    const data = await res.json();
    return data.pagination?.count ?? data.deployments?.length ?? 0;
  } catch {
    return 0;
  }
}

function getProductionUrl(project: VercelProject): string {
  const alias = project.targets?.production?.alias?.[0];
  if (alias) return alias;

  const latest = project.latestDeployments?.find(
    (d) => d.state === "READY" && d.target === "production"
  );
  if (latest?.url) return latest.url;

  return `${project.name}.vercel.app`;
}

export async function getTopVercelProjects(limit = 3): Promise<EnrichedProject[]> {
  try {
    const res = await fetch(
      `${BASE}/v10/projects?limit=100${teamQuery()}`,
      {
        headers: vercelHeaders(),
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) {
      console.error("Vercel projects fetch failed:", await res.text());
      return [];
    }

    const data = await res.json();
    const projects: VercelProject[] = data.projects ?? [];

    const enriched = await Promise.all(
      projects.map(async (project) => {
        const deploymentCount = await getDeploymentCount(project.id);
        const deployedUrl = getProductionUrl(project);

        return {
          name: project.name,
          deployedUrl,
          deploymentCount,
          framework: project.framework ?? null,
          favicon: `https://${deployedUrl}/favicon.ico`,
        } satisfies EnrichedProject;
      })
    );

    return enriched
      .sort((a, b) => b.deploymentCount - a.deploymentCount)
      .slice(0, limit);
  } catch (err) {
    console.error("getTopVercelProjects error:", err);
    return [];
  }
}
