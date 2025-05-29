import { NextApiRequest, NextApiResponse } from 'next';
import { AgentEvent } from '@/lib/events';
import { mockAgents, mockTasks } from '@/mock/agents';
import { AgentTask } from '@/types/agent';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Set SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Send initial state
  const initialEvents: AgentEvent[] = [
    ...mockAgents.map((agent) => ({
      type: 'agent_update' as const,
      agentId: agent.id,
      data: agent,
      timestamp: new Date().toISOString(),
    })),
    ...Object.entries(mockTasks).flatMap(([agentId, tasks]) =>
      tasks.map((task) => ({
        type: 'task_created' as const,
        agentId,
        data: task,
        timestamp: new Date().toISOString(),
      }))
    ),
  ];

  initialEvents.forEach((event) => {
    res.write(`data: ${JSON.stringify(event)}\n\n`);
  });

  // Simulate periodic updates
  const interval = setInterval(() => {
    const randomAgent = mockAgents[Math.floor(Math.random() * mockAgents.length)];
    const randomTask = mockTasks[randomAgent.id]?.[0];

    if (randomTask) {
      const updatedTask: AgentTask = {
        ...randomTask,
        status: Math.random() > 0.5 ? 'completed' : 'running',
        completedAt: new Date().toISOString(),
      };

      const event: AgentEvent = {
        type: 'task_update',
        agentId: randomAgent.id,
        data: updatedTask,
        timestamp: new Date().toISOString(),
      };

      res.write(`data: ${JSON.stringify(event)}\n\n`);
    }
  }, 5000);

  // Clean up on close
  res.on('close', () => {
    clearInterval(interval);
    res.end();
  });
}
