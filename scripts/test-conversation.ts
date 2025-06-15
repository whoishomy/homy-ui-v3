import { useAgentStore } from '../stores/agentStore';

async function testConversation() {
  const store = useAgentStore.getState();

  // Start conversation with Lab Analyzer
  console.log('🚀 Starting conversation with Lab Analyzer...');
  store.startConversation('Lab Results Analysis');
  store.setSelectedAgent('lab-analyzer');

  // Simulate user messages
  const testMessages = [
    'Can you analyze the latest lab results?',
    'What trends do you see in the cholesterol levels?',
    'Are there any concerning values?',
    'What lifestyle changes would you recommend?',
  ] as const;

  // Send messages with delays
  for (const message of testMessages) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(`\n👤 User: ${message}`);
    store.addConversationMessage(message, 'user');

    // Simulate agent response
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const response = await simulateAgentResponse(message);
    console.log(`\n🤖 Agent: ${response}`);
    store.addConversationMessage(response, 'agent');
  }

  // Update context with accumulated knowledge
  store.updateConversationContext({
    userIntent: 'Seeking lab result analysis and recommendations',
    systemState: 'analysis_complete',
    previousActions: ['Analyzed trends', 'Identified concerns', 'Generated recommendations'],
  });

  console.log('\n✅ Conversation test completed!');
}

function simulateAgentResponse(message: string): Promise<string> {
  // This will be replaced with actual AI response logic
  const responses: Record<string, string> = {
    'Can you analyze the latest lab results?':
      'I see your latest lab results. Let me analyze them for any significant findings.',
    'What trends do you see in the cholesterol levels?':
      'Your cholesterol levels show a slight upward trend over the last 3 months, but still within normal range.',
    'Are there any concerning values?':
      'No immediate concerns detected. However, your vitamin D levels are slightly below optimal range.',
    'What lifestyle changes would you recommend?':
      'Based on the trends, I recommend: 1) More outdoor activity for vitamin D, 2) Maintaining your current diet habits, 3) Regular sleep schedule.',
  };

  return Promise.resolve(responses[message] || 'I understand. Let me help you with that.');
}

// Export for use in tests or manual testing
export { testConversation };
